<script lang="ts">
    import { fly, slide, blur } from 'svelte/transition';
    import { region } from '../../auth/auth';
    import type { Input } from '../../config/config';
    import type ExpressionResolver from '../../input/ExpressionResolver';
    import type { SubmitFunction } from '../../input/InputPlugin';
    import StackInput from './StackInput';
    import Loading from '../../ui/Loading.svelte';
    import Spinner from '../../ui/Spinner.svelte';
    import ResolvedVariable from '../../input/ResolvedVariable';
    import { StackStatus, StackSummary, DescribeStacksCommand, Stack } from '@aws-sdk/client-cloudformation';
    import { cloudFormationClient } from '../../aws/clients';
    import humanizeDuration from 'humanize-duration';
    import { assert, assertDefined } from '../../assert';

    export let input: Input;
    export let expressionResolver: ExpressionResolver;
    export let submitFunction: SubmitFunction;

    let selectedStacks = new Array<String>();
    let selectedInputs = new Array<String>();
    $: listStacksPromise = $cloudFormationClient.send(new DescribeStacksCommand({})).then((response) => {
        if (!input.filter) {
            return response.Stacks;
        }
        const filteredStacks = expressionResolver.filterArray(response, input.filter);
        return filteredStacks as Stack[];
    });
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
                const variables = input.variables.map((inputVar) => {
                    const varValue = expressionResolver.match(stackDetail, inputVar.expression);
                    assertDefined(
                        varValue,
                        `Could not resolve variable '${inputVar.key}' with expression ${
                            inputVar.expression
                        } from ${JSON.stringify(stackDetail)}`
                    );
                    return new ResolvedVariable(inputVar.key, varValue);
                });
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
{#await listStacksPromise then stacks}
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
        {#each stacks as stack}
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
        {:else}
            <div class="rounded shadow">
                <div class="p-2 bg-yellow-500 text-lg font-semibold">No '{input.name}' stack found!</div>
                <ul class="p-2 bg-gray-300 list-disc list-inside">
                    {#if input.filter}
                        <li>
                            Maybe the filter
                            <span class="font-semibold font-mono">{input.filter}</span>
                            is outdated ?
                        </li>
                    {/if}
                    <li>Maybe you region <span class="font-semibold font-mono">{$region}</span> isn't correct ?</li>
                </ul>
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
