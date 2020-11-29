import { assertDefined } from '../assert';
import type ResolvedInput from './ResolvedInput';
import type ResolvedVariable from './ResolvedVariable';

export default class InputRegistry {
    private inputs: ResolvedInput[] = [];

    registerInput(input: ResolvedInput) {
        this.inputs.push(input);
    }

    variableValue(key: string): string {
        const keyParts = key.split('.');
        const inputName = keyParts[0];
        const input = this.inputByName(inputName);
        let variable: ResolvedVariable;
        if (input) {
            variable = input.variable(keyParts.slice(1).join('.'));
        } else {
            variable = this.searchVariableAccrossInputs(key);
        }
        assertDefined(variable, `No variable '${key}'. Available are: ${this.variableKeys()}`);
        return variable.value;
    }

    variableKeys(): string[] {
        return this.inputs.reduce((result, input) => {
            const keysOfInput = input.variables.map((v) => input.inputName + '.' + v.key);
            return [...result, ...keysOfInput];
        }, []);
    }

    private inputByName(name: string): ResolvedInput {
        if (!name) {
            return;
        }
        return this.inputs.find((input) => input.inputName === name);
    }

    private searchVariableAccrossInputs(key: string): ResolvedVariable {
        for (const input of this.inputs) {
            const variable = input.variable(key);
            if (variable) {
                return variable;
            }
        }
        return null;
    }

    clear() {
        this.inputs = [];
    }
}
