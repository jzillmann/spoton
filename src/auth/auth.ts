import { writable } from 'svelte/store';
import { IAMClient, GetUserCommand } from '@aws-sdk/client-iam';
import { EC2Client, DescribeRegionsCommand } from '@aws-sdk/client-ec2';
import { parse as parseArn } from '@aws-sdk/util-arn-parser';
import { defaultRegion } from '../defaults';

import type Login from './Login';
import type Profile from './Profile';
import { toClientConfig } from '../aws/ClientConfig';

export const availableProfiles = writable<Profile[]>(undefined);
export const login = writable<Login>(undefined);
export const region = writable<string>(undefined);

export function loginByProfile(loginProfile: Profile): Promise<void> {
    const loginRegion = loginProfile.defaultRegion || defaultRegion;
    const config = { ...toClientConfig(loginProfile, loginRegion) };
    const iamClient = new IAMClient(config);
    const ec2Client = new EC2Client(config);
    const userPromise = iamClient.send(new GetUserCommand({}));
    const regionsPromise = ec2Client.send(new DescribeRegionsCommand({}));

    return Promise.all([userPromise, regionsPromise])
        .then((responses) => {
            const userResponse = responses[0];
            const regionsResponse = responses[1];

            const account = parseArn(userResponse.User.Arn).accountId;
            const userName = userResponse.User.UserName;
            const regionNames = regionsResponse.Regions.map((region) => region.RegionName).sort();

            region.set(loginRegion);
            login.set({
                account,
                userName,
                key: loginProfile.key,
                secret: loginProfile.secret,
                profile: loginProfile,
                availableRegions: regionNames,
            });
        })
        .finally(() => {
            iamClient.destroy();
            ec2Client.destroy();
        });
}

type LogoutResetFunction = () => void;
const logoutResets: LogoutResetFunction[] = [];

export function registerLogoutFunction(logoutFunction: LogoutResetFunction) {
    logoutResets.push(logoutFunction);
}

export function logout(): void {
    logoutResets.forEach((f) => f());
    login.set(undefined);
}
