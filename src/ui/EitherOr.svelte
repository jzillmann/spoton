<script lang="ts">
    export let either = true;
</script>

<div class="root">
    <div class="flip relative" class:or={!either}>
        <div class="front relative z-10">
            <slot name="either" />
        </div>
        <div class="back absolute">
            <slot name="or" />
        </div>
    </div>
</div>

<style>
    .root {
        perspective: 1000px;
    }
    .flip {
        transition: 0.6s;
        transform-style: preserve-3d;
    }

    .or.flip {
        transform: rotateX(-180deg);
    }

    /* hide back of pane during swap */
    .front,
    .back {
        backface-visibility: hidden;
    }

    .back {
        transform: rotateX(180deg);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
