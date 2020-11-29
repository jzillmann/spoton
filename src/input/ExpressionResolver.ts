import type InputRegistry from './InputRegistry';
import jsonata from 'jsonata';

const variableRegex: RegExp = /\${([^\s]+)}/g;

export default class ExpressionResolver {
    inputRegistry: InputRegistry;

    constructor(inputRegistry: InputRegistry) {
        this.inputRegistry = inputRegistry;
    }

    match(structure: object, expression: string): any {
        expression = this.replaceVariables(expression);
        return jsonata(expression).evaluate(structure);
    }

    filterArray(structure: object, expression: string): any[] {
        const result = this.match(structure, expression);
        if (!result) {
            return [];
        }
        if (Array.isArray(result)) {
            return result as [];
        }
        return [result];
    }

    private replaceVariables(expression: string) {
        const registry = this.inputRegistry;
        return expression.replace(variableRegex, function (match) {
            const key = match.substring(2, match.length - 1);
            return registry.variableValue(key);
        });
    }
}
