<script lang="ts">
    import SvgIcon from '../svg/SvgIcon.svelte';
    import type SvgSpec from '../svg/SvgSpec';

    export let name: string;
    export let svgSpec: SvgSpec;
    export let pressed = false;
    export let extraClass = '';
</script>

<button
    class="inline-block pt-2 pb-1 pl-2 pr-3 border-b-2 rounded-md cursor-pointer outline-none focus:outline-none {extraClass}"
    class:pressed
    on:click>
    <div class="flex items-center select-none ">
        <SvgIcon size={svgSpec.size} d={svgSpec.d} animation={pressed ? svgSpec.animation : 'undefined'} />
        <div class="ml-2">{name}</div>
    </div>
</button>

<style>
    button {
        border-color: rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px #999;
        transition: all 0.45s;
    }

    button:not(.pressed):hover {
        filter: contrast(130%);
        filter: brightness(118%);
    }

    /* We shrink the box-shadow and move the button down in order to emulate a pressing down  */
    .pressed {
        filter: brightness(90%);
        box-shadow: 0 1px #666;
        transform: translateY(1px);
    }
</style>
