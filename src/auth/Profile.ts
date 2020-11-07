import type ProfileOrigin from './ProfileOrigin';

export default interface Profile {
    readonly name: string;
    readonly key: string;
    readonly secret: string;
    readonly origin: ProfileOrigin;
    readonly defaultRegion?: string;
}
