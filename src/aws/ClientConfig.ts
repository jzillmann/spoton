import type { RegionInputConfig } from '@aws-sdk/config-resolver';
import type { AwsAuthInputConfig } from '@aws-sdk/middleware-signing';

export declare type ClientConfig = Partial<AwsAuthInputConfig & RegionInputConfig>;

export function toClientConfig(accessKey: string, accessSecret: string, region: string): ClientConfig {
    return {
        credentials: { accessKeyId: accessKey, secretAccessKey: accessSecret },
        region,
    };
}
