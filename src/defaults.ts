import type { Config } from './config/config';

export const defaultRegion = 'us-east-2';

export const defaultConfig: Config = {
    inputs: [
        {
            name: 'Base',
            type: 'CloudFormation:Stack',
            filter: 'Stacks[Outputs.OutputKey~>/EmrClusterName/]',
            expects: '1',
            // auto: true,
            variables: [{ key: 'EmrClusterName', expression: 'Outputs[OutputKey~>/EmrClusterName/].OutputValue' }],
        },
        {
            name: 'App',
            type: 'CloudFormation:Stack',
            filter:
                'Stacks[Parameters.ParameterKey~>/EmrClusterName/ and Parameters.ParameterValue~>/${Base.EmrClusterName}/]',
            expects: '*',
            // auto: true,
            variables: [
                {
                    key: 'Address',
                    expression: 'Outputs[OutputKey~>/LoadBalancerDnsName/].OutputValue',
                },
                {
                    key: 'AssetsBucket',
                    expression: 'Outputs[OutputKey~>/AppBucketName/].OutputValue',
                },
            ],
        },
    ],
    pages: [
        {
            name: 'Overview',
            sections: [
                {
                    name: 'Addresses',
                    elements: [
                        {
                            name: 'My App',
                            type: 'Address',
                            value: '${LoadBalancerDNSName}',
                        },
                    ],
                },
            ],
        },
    ],
};
