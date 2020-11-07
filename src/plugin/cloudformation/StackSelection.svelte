<script lang="ts">
    import { fly } from 'svelte/transition';
    import type { SubmitFunction } from '../../input/InputPlugin';
    import type { Input } from '../../config/config';
    import StackInput from './StackInput';
    import { ListStacksCommand, StackStatus, StackSummary } from '@aws-sdk/client-cloudformation';
    import { cloudFormationClient } from '../../aws/clients';
    import humanizeDuration from 'humanize-duration';
    import Loading from '../../ui/Loading.svelte';

    export let input: Input;
    export let submitFunction: SubmitFunction;

    $: promise = $cloudFormationClient
        .send(new ListStacksCommand({ StackStatusFilter: [StackStatus.CREATE_COMPLETE] }))
        .then((reponses) => {
            return reponses;
        });

    function submit(stack: StackSummary) {
        const resolvedInput = new StackInput(input, stack.StackName, stack.StackId, stack.StackStatus as StackStatus);
        submitFunction(resolvedInput);
    }
</script>

<Loading {promise} message="Fetching stacks" />
{#await promise then response}
    <div class="mb-3 flex justify-center items-baseline content-center text-center">
        Pick stack
        {#key input.name}
            <div in:fly={{ y: -200 }} class="ml-2 font-bold italic text-green-500 text-center">{input.name}</div>
        {/key}
    </div>
    <div
        in:fly={{ x: 2000 }}
        class="p-2 grid whitespace-no-wrap"
        style="grid-template-columns: max-content max-content max-content;">
        {#each response.StackSummaries as stack}
            <div class="contents row" on:click={() => submit(stack)}>
                <div class="text-lg font-bold font-mono">{stack.StackName}</div>
                <div class="font-hairline">{stack.StackStatus}</div>
                <div class="font-hairline italic">
                    {humanizeDuration(new Date().getTime() - stack.CreationTime.getTime(), { largest: 1, round: true })}
                    old
                </div>
            </div>
        {/each}
    </div>
{/await}

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
