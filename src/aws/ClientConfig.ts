import type { RegionInputConfig } from '@aws-sdk/config-resolver';
import type { AwsAuthInputConfig } from '@aws-sdk/middleware-signing';
import type Login from '../auth/Login';
import type Profile from '../auth/Profile';

export declare type ClientConfig = Partial<AwsAuthInputConfig & RegionInputConfig>;

export function toClientConfig(profile: Profile, region: string): ClientConfig {
    return {
        credentials: { accessKeyId: profile.key, secretAccessKey: profile.secret },
        region,
    };
}
