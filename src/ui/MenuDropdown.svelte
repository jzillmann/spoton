<script lang="ts">
    import { scale, blur } from 'svelte/transition';
    import clickOutside from '../svelte/clickOutside';

    export let title: string;
    let open = false;

    let titleNode: HTMLElement;
    function toogleOpen() {
        open = !open;
    }
</script>

<div class="relative flex">
    <div bind:this={titleNode} on:click={toogleOpen} class="select-none cursor-pointer hover:underline">{title}</div>
    <svg
        stroke="green"
        class:open
        class="text-gray-700 opacity-75 fill-current stroke-current h-5 w-5 transition ease-in-out duration-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20">
        <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
    </svg>
    {#if open}
        <span use:clickOutside={{ onAction: toogleOpen, excludes: [titleNode] }} transition:scale={{ duration: 180 }}>
            <slot />
        </span>
    {/if}
</div>

<style>
    .open {
        transform: rotateX(-180deg);
        @apply opacity-100;
        stroke: wheat;
    }
</style>
