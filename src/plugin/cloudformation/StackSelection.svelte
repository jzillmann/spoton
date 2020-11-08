<script lang="ts">
    import { fly, slide, blur } from 'svelte/transition';
    import type { SubmitFunction } from '../../input/InputPlugin';
    import type { Input } from '../../config/config';
    import StackInput from './StackInput';
    import Loading from '../../ui/Loading.svelte';
    import Spinner from '../../ui/Spinner.svelte';
    import InputVariable from '../../input/InputVariable';
    import {
        ListStacksCommand,
        StackStatus,
        StackSummary,
        DescribeStacksCommand,
    } from '@aws-sdk/client-cloudformation';
    import { cloudFormationClient } from '../../aws/clients';
    import humanizeDuration from 'humanize-duration';
    import { assert } from '../../assert';

    export let input: Input;
    export let submitFunction: SubmitFunction;

    let selectedStacks = new Array<String>();
    let selectedInputs = new Array<String>();
    $: listStacksPromise = $cloudFormationClient.send(
        new ListStacksCommand({ StackStatusFilter: [StackStatus.CREATE_COMPLETE] })
    );
    let describeStackPromise: Promise<void>;

    function submit(stack: StackSummary) {
        if (selectedStacks.includes(stack.StackName)) {
            return;
        }
        selectedStacks = [...selectedStacks, stack.StackName];
        selectedInputs = [...selectedInputs, input.name];
        describeStackPromise = $cloudFormationClient
            .send(new DescribeStacksCommand({ StackName: stack.StackName }))
            .then((stackDetails) => {
                assert(
                    stackDetails.Stacks.length == 1,
                    `Expected one stack but got ${JSON.stringify(stackDetails.Stacks)}`
                );
                const stackDetail = stackDetails.Stacks[0];
                const variables = stackDetail.Outputs.map(
                    (output) => new InputVariable(output.OutputKey, output.OutputValue)
                );
                const resolvedInput = new StackInput(
                    input,
                    variables,
                    stack.StackName,
                    stack.StackId,
                    stack.StackStatus as StackStatus
                );
                submitFunction(resolvedInput);
            });
    }
</script>

<Loading promise={listStacksPromise} message="Fetching stacks" />
{#await listStacksPromise then response}
    <div class="ml-4 mb-3 flex items-baseline content-start">
        Pick stack
        {#each selectedInputs as inputName}
            <div class="ml-2 font-bold italic text-indigo-400"><del>{inputName}</del></div>
        {/each}
        {#if !selectedInputs.includes(input.name)}
            {#key input.name}
                <div in:fly={{ y: -200 }} class="ml-2 font-bold italic text-teal-500">{input.name}</div>
            {/key}
        {/if}
    </div>
    {#await describeStackPromise}
        <span />
    {:catch error}
        <div class="ml-2 text-red-800" in:slide>ERROR: {error}</div>
    {/await}
    <div
        in:fly={{ x: 2000 }}
        class="p-2 grid whitespace-no-wrap"
        style="grid-template-columns: max-content max-content max-content min-content;">
        {#each response.StackSummaries as stack}
            <div
                class="contents row hover:shadow"
                class:selected={selectedStacks.includes(stack.StackName)}
                on:click={() => submit(stack)}>
                <div class="text-lg font-bold font-mono border-l-2 border-gray-100">{stack.StackName}</div>
                <div class="font-hairline">{stack.StackStatus}</div>
                <div class="font-hairline italic">
                    {humanizeDuration(new Date().getTime() - stack.CreationTime.getTime(), { largest: 1, round: true })}
                    old
                </div>
                <div class="w-6">
                    {#if selectedStacks[selectedStacks.length - 1] === stack.StackName}
                        {#await describeStackPromise}
                            <Spinner class="h-5 w-5 mt-1" />
                        {/await}
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{/await}

<style>
    .row > div {
        @apply px-2;
        @apply py-1;
    }

    .row:not(.selected) > div {
        @apply cursor-pointer;
    }

    .row:not(.selected):hover > div {
        @apply bg-gray-400;
        box-shadow: 0 6px 6px -6px black;
    }
    .row:not(.selected):hover > :first-child {
        @apply border-teal-500;
    }

    .selected > div {
        @apply bg-gray-400;
        box-shadow: 0 4px 6px -6px black;
    }
    .selected > :first-child {
        @apply border-indigo-400;
    }
</style>
