import type { Input } from '../config/config';
import type InputVariable from './InputVariable';

/**
 * A defined Input that has been filled in.
 */
export default abstract class ResolvedInput {
    inputName: string;
    inputType: string;
    variables: InputVariable[];

    constructor(input: Input, variables: InputVariable[]) {
        this.inputName = input.name;
        this.inputType = input.type;
        this.variables = variables;
    }
}
