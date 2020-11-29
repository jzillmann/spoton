import type { Input } from '../config/config';
import type ResolvedInput from './ResolvedInput';
import type ComponentDefinition from '../svelte/ComponentDefinition';
import type ExpressionResolver from './ExpressionResolver';

export interface InputPlugin {
    type: string;

    inputComponent(
        input: Input,
        expressionResolver: ExpressionResolver,
        submitFunction: SubmitFunction
    ): ComponentDefinition;
}

export type SubmitFunction = (resolvedInput: ResolvedInput) => void;
