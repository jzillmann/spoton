import type { InputPlugin, SubmitFunction } from '../../input/InputPlugin';
import type { Input } from '../../config/config';
import type ExpressionResolver from '../../input/ExpressionResolver';
import ComponentDefinition from '../../svelte/ComponentDefinition';
import StackSelection from './StackSelection.svelte';

export default class StackInputPlugin implements InputPlugin {
    type = 'CloudFormation:Stack';

    inputComponent(
        input: Input,
        expressionResolver: ExpressionResolver,
        submitFunction: SubmitFunction
    ): ComponentDefinition {
        return new ComponentDefinition(StackSelection, { input, expressionResolver, submitFunction });
    }
}
