import type { Input } from '../config/config';

/**
 * A defined Input that has been filled in.
 */
export default abstract class ResolvedInput {
    inputName: string;
    inputType: string;

    constructor(input: Input) {
        this.inputName = input.name;
        this.inputType = input.type;
    }
}
