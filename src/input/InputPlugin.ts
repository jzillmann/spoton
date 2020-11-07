import type { Input } from '../config/config';
import type ResolvedInput from './ResolvedInput';
import type ComponentDefinition from '../svelte/ComponentDefinition';

export default interface InputPlugin {
    type: string;

    inputComponent(input: Input): ComponentDefinition;
}

export type SubmitFunction = (resolvedInput: ResolvedInput) => void;
