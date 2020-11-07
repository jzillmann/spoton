import { derived, Readable } from 'svelte/store';
import { S3Client } from '@aws-sdk/client-s3';
import { login, region } from '../auth/auth';

import { ClientConfig, toClientConfig } from '../aws/ClientConfig';
import { CloudFormationClient } from '@aws-sdk/client-cloudformation';

export const clientConfig = derived([login, region], ([$login, $region]) =>
    $login ? toClientConfig($login.profile, $region) : undefined
);

export const s3Client: Readable<S3Client> = derived(clientConfig, ($config, set) => {
    if ($config) {
        const client = new S3Client($config);
        client.middlewareStack.add(
            (next) => (args) => {
                if (args.request['body'] === '') {
                    args.request['body'] = undefined;
                }
                return next(args);
            },
            {
                step: 'build',
            }
        );
        set(client);
        return client.destroy();
    }
});

export const cloudFormationClient: Readable<S3Client> = derived(clientConfig, ($config, set) => {
    if ($config) {
        const client = new CloudFormationClient($config);
        set(client);
        return client.destroy();
    }
});
