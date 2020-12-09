<script lang="ts">
    import { fly, slide, blur } from 'svelte/transition';
    import { region } from '../../auth/auth';
    import type { Input } from '../../config/config';
    import type ExpressionResolver from '../../input/ExpressionResolver';
    import type { SubmitFunction } from '../../input/InputPlugin';
    import StackInput from './StackInput';
    import Loading from '../../ui/Loading.svelte';

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

    function submit(stack: Stack) {
        if (selectedStacks.includes(stack.StackName)) {
            return;
        }
        selectedStacks = [...selectedStacks, stack.StackName];
        selectedInputs = [...selectedInputs, input.name];

        const variables = input.variables.map((inputVar) => {
            const varValue = expressionResolver.match(stack, inputVar.expression);
            assertDefined(
                varValue,
                `Could not resolve variable '${inputVar.key}' with expression ${
                    inputVar.expression
                } from ${JSON.stringify(stack)}`
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
    }
</script>

<Loading promise={listStacksPromise} message="Fetching stacks" />

<!-- Stack selection list -->
{#await listStacksPromise then stacks}
    <div
        in:fly={{ x: 2000 }}
        class="p-2 grid whitespace-no-wrap"
        style="grid-template-columns: max-content max-content max-content;">
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
            </div>
        {/each}
    </div>
    {#if stacks.length === 0}
        <div class="rounded shadow w-3/4">
                <div class="p-2 bg-yellow-500 text-lg font-semibold">No '{input.name}' stack found!</div>
                <ul class="p-2 bg-gray-300 list-disc list-inside ">
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
    {/if}
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
