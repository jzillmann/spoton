import type { Config } from './config/config';

export const defaultRegion = 'us-east-2';

export const defaultConfig: Config = {
    inputs: [
        {
            name: 'Base',
            type: 'CloudFormation:Stack',
        },
        {
            name: 'App',
            type: 'CloudFormation:Stack',
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
