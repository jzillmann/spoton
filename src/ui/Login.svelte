<script lang="ts">
    import { blur, fly } from 'svelte/transition';
    import { loadSystemProfiles } from '../external';
    import { availableProfiles, loginByProfile, loginByKey } from '../auth/auth';

    import type Profile from '../auth/Profile';
    import Loading from './Loading.svelte';
    import Card from './Card.svelte';

    const systemProfiles = loadSystemProfiles().then((profiles) => {
        availableProfiles.set(profiles);
        return profiles;
    });

    let loginPromise: Promise<void>;

    function profileLogin(selectedProfile: Profile) {
        loginPromise = loginByProfile(selectedProfile);
    }

    let accessKey: string;
    let accessSecret: string;
    function accessKeyLogin() {
        loginPromise = loginByKey(accessKey, accessSecret);
    }
</script>

<div class="container mx-auto flex justify-center items-center">
    <div class="mt-10">
        <div class="text-4xl font-bold font-serif mb-6 text-center" in:blur>Choose a Profile</div>
        {#await systemProfiles}
            <div>Waiting on profiles...</div>
        {:then profiles}
            <div class="flex flex-wrap" in:fly={{ x: 2000 }}>
                {#each profiles as aProfile}
                    <div on:click={() => profileLogin(aProfile)}>
                        <Card>
                            <span slot="header">{aProfile.name}</span>
                            <span slot="content">{aProfile.key}</span>
                        </Card>
                    </div>
                {/each}
            </div>
        {:catch error}
            <div>ERROR: {error}</div>
        {/await}
        <div class="mt-10 text-4xl font-bold font-serif mb-6 text-center" in:blur>Login with Access Key</div>
        <div class="flex flex-col">
            <label for="accessKey" class="font-semibold">Access Key:</label>
            <input
                id="accessKey"
                type="text"
                placeholder="AKIARPABWJVA2..."
                bind:value={accessKey}
                class="w-64 mt-1 p-1 bg-gray-200" />
            <label for="accessSecret" class="mt-2 font-semibold">Access Secret:</label>
            <input
                id="accessSecret"
                type="password"
                placeholder="FwCiyMId8Im5joUVE5JWjnaffT+nbn..."
                bind:value={accessSecret}
                class="w-96 mt-1 p-1 bg-gray-200" />
            <button
                class="w-32 mt-3 p-2 bg-gray-400 font-semibold hover:font-bold rounded shadow hover:shadow-lg transform transition duration-200 hover:scale-y-105"
                on:click={accessKeyLogin}>Login</button>
        </div>
    </div>
</div>
{#if loginPromise}
    <Loading promise={loginPromise} message="Logging in" />
{/if}
