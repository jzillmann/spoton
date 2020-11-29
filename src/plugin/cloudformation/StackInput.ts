import type { StackStatus } from '@aws-sdk/client-cloudformation/types/models/models_0';
import type { Input } from '../../config/config';
import type ResolvedVariable from '../../input/ResolvedVariable';
import ResolvedInput from '../../input/ResolvedInput';

export default class StackInput extends ResolvedInput {
    stackName: string;
    stackId: string;
    stackStatus: StackStatus;

    constructor(
        input: Input,
        variables: ResolvedVariable[],
        stackName: string,
        stackId: string,
        stackStatus: StackStatus
    ) {
        super(input, variables);
        this.stackName = stackName;
        this.stackId = stackId;
        this.stackStatus = stackStatus;
    }
}
