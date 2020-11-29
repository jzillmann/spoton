import { writable, get } from 'svelte/store';
import { registerLogoutFunction } from '../auth/auth';
import { assertDefined } from '../assert';
import InputRegistry from './InputRegistry';
import ExpressionResolver from './ExpressionResolver';
import type { Input } from '../config/config';
import type ResolvedInput from './ResolvedInput';
import type { InputPlugin, SubmitFunction } from './InputPlugin';
import type ComponentDefinition from '../svelte/ComponentDefinition';

import StackInputPlugin from '../plugin/cloudformation/StackInputPlugin';

export const inputRegistry = new InputRegistry();
export const resolvedInputs = writable<number>(0);
export const expressionResolver = new ExpressionResolver(inputRegistry);

const plugins: InputPlugin[] = [new StackInputPlugin()];

const submitFunction: SubmitFunction = (resolvedInput: ResolvedInput) => {
    inputRegistry.registerInput(resolvedInput);
    resolvedInputs.update((n) => n + 1);
};

/**
 * Resolves a configured input to an input component definition.
 *
 * @param input
 */
export function resolveInputComponent(input: Input): ComponentDefinition {
    const plugin = plugins.find((plugin) => plugin.type === input.type);
    assertDefined(
        plugin,
        `No plugin for input of type ${input.type} found. Registered are only: ${JSON.stringify(
            plugins.map((p) => p.type)
        )}`
    );
    return plugin.inputComponent(input, expressionResolver, submitFunction);
}

registerLogoutFunction(() => {
    inputRegistry.clear();
    resolvedInputs.set(0);
});
