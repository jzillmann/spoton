import { writable } from 'svelte/store';
import type { Input } from '../config/config';
import type ResolvedInput from './ResolvedInput';
import type ComponentDefinition from '../svelte/ComponentDefinition';

import StackInputPlugin from '../plugin/cloudformation/StackInputPlugin';
import { assertDefined } from '../assert';

export const inputs = writable<ResolvedInput[]>(undefined);

const plugins = [new StackInputPlugin()];

export function resolveInputComponent(input: Input): ComponentDefinition {
    const plugin = plugins.find((plugin) => plugin.type === input.type);
    assertDefined(
        plugin,
        `No plugin for input of type ${input.type} found. Registered are only: ${JSON.stringify(
            plugins.map((p) => p.type)
        )}`
    );
    return plugin.inputComponent(input);
}