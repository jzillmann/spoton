<script lang="ts">
    import { blur } from 'svelte/transition';
    import type { Input } from '../config/config';
    import type ResolvedInput from '../input/ResolvedInput';
    import { inputs as inputStore } from '../input/inputs';
    import { resolveInputComponent } from '../input/inputs';

    export let inputs: Input[];
    let currentInput = 0;
    let resolvedInputs = new Array<ResolvedInput>();
    $: currentInputComponent = resolveInputComponent(inputs[currentInput]);

    function submitInput(resolvedInput: ResolvedInput) {
        resolvedInputs.push(resolvedInput);
        if (currentInput < inputs.length - 1) {
            currentInput++;
        } else {
            inputStore.set(resolvedInputs);
        }
    }
</script>

<div class="container mx-auto flex justify-center items-center">
    <div class="mt-10">
        <div class="text-4xl font-bold font-serif mb-3 text-center" in:blur>
            Pick
            {#key inputs[currentInput]}
                <div in:blur>{inputs[currentInput].name} | {inputs[currentInput].type}</div>
            {/key}
        </div>
        <svelte:component
            this={currentInputComponent.component}
            submitFunction={submitInput}
            {...currentInputComponent.args} />
    </div>
</div>
