import type Profile from './Profile';

export default interface Login {
    readonly account: string;
    readonly userName: string;
    readonly key: string;
    readonly secret: string;
    readonly profile?: Profile;
    readonly availableRegions: string[];
}
