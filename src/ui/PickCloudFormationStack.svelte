<script lang="ts">
    import { blur, fly, slide, scale } from 'svelte/transition';
    import { ListStacksCommand, StackStatus } from '@aws-sdk/client-cloudformation';
    import { cloudFormationClient } from '../aws/clients';
    import humanizeDuration from 'humanize-duration';
    import Loading from './Loading.svelte';

    let picks = ['Shared Services'];
    let currentStack = picks[0];

    $: promise = $cloudFormationClient
        .send(new ListStacksCommand({ StackStatusFilter: [StackStatus.CREATE_COMPLETE] }))
        .then((reponses) => {
            return reponses;
        });
</script>

<div class="container mx-auto flex justify-center items-center">
    <div class="mt-10">
        <div class="text-4xl font-bold font-serif mb-3 text-center" in:blur>Pick CloudFormation Stack</div>
        <Loading {promise} message="Fetching stacks" />
        {#await promise then response}
            <div class="mb-3 flex justify-center items-baseline content-center text-center" in:fly={{ y: -200 }}>
                Pick stack
                <div class="ml-2 font-bold italic text-green-500 text-center">{currentStack}</div>
            </div>
            <div
                in:fly={{ x: 2000 }}
                class="p-2 grid whitespace-no-wrap"
                style="grid-template-columns: max-content max-content max-content;">
                {#each response.StackSummaries as stack}
                    <!-- <div class="p-2  hover:bg-gray-400 items-center whitespace-no-wrap cursor-pointer border-b-2"> -->
                    <div class="contents row">
                        <div class="text-lg font-bold font-mono">{stack.StackName}</div>
                        <div class="font-hairline">{stack.StackStatus}</div>
                        <div class="font-hairline italic">
                            {humanizeDuration(new Date().getTime() - stack.CreationTime.getTime(), {
                                largest: 1,
                                round: true,
                            })}
                            old
                        </div>
                    </div>
                {/each}
            </div>
        {/await}
    </div>
</div>

<style>
    .row > div {
        @apply px-2;
        @apply py-1;
        @apply cursor-pointer;
    }

    .row:hover > div {
        @apply bg-gray-400;
        @apply shadow;
    }
</style>
