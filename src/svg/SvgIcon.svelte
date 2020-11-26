<script lang="ts">
    export let fill = 'none';
    export let d: string;
    export let size: string;
    export let animation = '';
    export let extraClass = '';
</script>

<svg
    class="relative inline-block stroke-current {size} {extraClass} {animation}"
    viewBox="0 0 24 24"
    {fill}
    xmlns="http://www.w3.org/2000/svg">
    {#if d}
        <path {d} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    {/if}
</svg>
