<script lang="ts">
    import { blur } from 'svelte/transition';
    import MenuDropdown from './MenuDropdown.svelte';
    import { login, region, availableProfiles, loginByProfile, logout } from '../auth/auth';
    import type Profile from '../auth/Profile';
    import Spinner from './Spinner.svelte';

    let loginPromise: Promise<void>;
    let targetProfile: Profile;

    function switchProfile(inactiveProfile: Profile) {
        targetProfile = inactiveProfile;
        loginPromise = loginByProfile(inactiveProfile).finally(() => {
            targetProfile = undefined;
        });
    }

    function switchRegion(inactiveRegion: string) {
        region.set(inactiveRegion);
    }
</script>

<!-- Draggable top bar -->
<div class="fixed top-0 w-full h-9 bg-gray-600" style="-webkit-app-region: drag">
        <div class="flex items-center justify-between flex-wrap text-gray-800">
            <div class="w-auto block ml-20 mt-1 text-xl font-serif font-semibold">SpotOn</div>
            {#if $login}
                <span transition:blur>
                    <div class="flex space-x-3 mt-1 mr-4 text-sm font-mono">
                        <MenuDropdown title="{$login.userName}@{$login.account}">
                            <span  class="absolute right-0 mt-7 rounded shadow-lg bg-gray-500">
                                {#if $login.profile}
                                    <div class="block px-2 py-2 bg-gray-600 font-semibold whitespace-no-wrap">Profile: {$login.profile.name}</div>
                                {/if}
                                {#if $availableProfiles.length > 0}
                                    <hr/>
                                    <div class="block px-2 py-1">Switch Profile:</div>
                                    {#each $availableProfiles.filter(p=>p!==$login.profile) as inactiveProfile}
                                        <div class="flex pl-4 pr-2 py-1 hover:bg-gray-400 hover:font-semibold cursor-pointer" on:click={()=>switchProfile(inactiveProfile)} >
                                            {inactiveProfile.name}
                                            {#if targetProfile === inactiveProfile}
                                                <Spinner class="ml-1 h-5 w-5" />
                                            {/if}
                                        </div>
                                    {/each}
                                {/if}
                                <hr/>
                                <div class="block px-2 py-2 hover:bg-gray-400 hover:font-semibold cursor-pointer" on:click={logout}>Logout</div>
                                <hr/>
                                    {#await loginPromise }
                                    <!-- only show error -->
                                    {:catch error}
                                        <div class="p-2 text-red-800 tracking-tighter font-thin" on:click={()=>loginPromise=undefined}>ERROR: {error}</div>
                                    {/await}
                            </span>
                        </MenuDropdown>
                        <MenuDropdown title="{$region}">
                            <span  class="absolute right-0 mt-7 w-40 rounded shadow-lg bg-gray-500">
                                {#each $login.availableRegions as aRegion}
                                    {#if aRegion === $region}
                                        <div class="px-2 text-base font-bold whitespace-no-wrap underline">
                                            {aRegion}
                                        </div>
                                    {:else}
                                        <div class="px-2 hover:bg-gray-400 hover:font-semibold cursor-pointer whitespace-no-wrap" on:click={()=>switchRegion(aRegion)} >
                                            {aRegion}
                                        </div>
                                    {/if}
                                {/each}
                            </span>
                        </MenuDropdown>
                    </div>
                </span>
            {/if}
        </div>
    </div>
