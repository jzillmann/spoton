<script lang="ts">
    import { blur, fly } from 'svelte/transition';
    import { loadSystemProfiles } from '../external';
    import { availableProfiles, loginByProfile } from '../auth/auth';

    import type Profile from '../auth/Profile';
    import Loading from './Loading.svelte';
    import Card from './Card.svelte';

    const systemProfiles = loadSystemProfiles().then((profiles) => {
        availableProfiles.set(profiles);
        return profiles;
    });

    let loginPromise: Promise<void>;

    function login(selectedProfile: Profile) {
        loginPromise = loginByProfile(selectedProfile);
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
                    <div on:click={() => login(aProfile)}>
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
    </div>
</div>
{#if loginPromise}
    <Loading promise={loginPromise} message="Logging in" />
{/if}
