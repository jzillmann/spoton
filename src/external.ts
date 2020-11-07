import type Profile from './auth/Profile';
import type { SharedConfigInit } from '@aws-sdk/shared-ini-file-loader';
import ProfileOrigin from './auth/ProfileOrigin';
import { defaultRegion } from './defaults';

export async function loadSystemProfiles(): Promise<Profile[]> {
    const externalApi = window['externalApi'];
    if (!externalApi) {
        return Promise.resolve([]);
    }
    return externalApi.loadProfilesFromSystem().then((sharedConfig: SharedConfigInit) => {
        const config = sharedConfig['configFile'];
        const credentials = sharedConfig['credentialsFile'];
        return Object.keys(credentials).map((profileName) => {
            const profile = credentials[profileName];
            const region = config[profileName]?.region || defaultRegion;
            return {
                name: profileName,
                key: profile['aws_access_key_id'],
                secret: profile['aws_secret_access_key'],
                origin: ProfileOrigin.SYSTEM,
                defaultRegion: region,
            };
        });
    });
}
