import type InputPlugin from '../../input/InputPlugin';
import StackSelection from './StackSelection.svelte';
import ComponentDefinition from '../../svelte/ComponentDefinition';
import type { Input } from '../../config/config';

export default class StackInputPlugin implements InputPlugin {
    type = 'CloudFormation:Stack';

    inputComponent(input: Input): ComponentDefinition {
        return new ComponentDefinition(StackSelection, { input });
    }
}
