import type { Input } from '../config/config';
import type ResolvedVariable from './ResolvedVariable';

/**
 * A defined Input that has been filled in.
 */
export default abstract class ResolvedInput {
    inputName: string;
    inputType: string;
    variables: ResolvedVariable[];

    constructor(input: Input, variables: ResolvedVariable[]) {
        this.inputName = input.name;
        this.inputType = input.type;
        this.variables = variables;
    }

    variable(key: string): ResolvedVariable {
        return this.variables.find((v) => v.key === key);
    }
}
