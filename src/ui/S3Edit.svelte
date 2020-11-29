<script lang="ts">
    interface TextContent {
        text: string;
        lastModified: Date;
        lastSynced: Date;
    }

    import { onMount } from 'svelte';
    import { blur, slide } from 'svelte/transition';
    import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
    import { streamCollector } from '@aws-sdk/fetch-http-handler';
    import { s3Client } from '../aws/clients';
    import { inputRegistry } from '../input/inputs';
    import humanizeDuration from 'humanize-duration';
    import { now, displayDate } from '../svelte/dates';
    import { CodeJar } from 'codejar';
    import { withLineNumbers } from 'codejar/linenumbers';
    import Button from './Button.svelte';
    import EitherOr from './EitherOr.svelte';
    import { refreshSpec, saveSpec } from '../svg/SvgSpec';

    const bucket = inputRegistry.variableValue('AssetsBucket');
    const file = 'config-files/overrides.properties';
    const encoder = new TextDecoder('utf-8');

    let editorNode: HTMLElement;
    let editor: CodeJar;
    let fetchedContent: TextContent;
    let changedContent = false;

    onMount(() => {
        editor = CodeJar(
            editorNode,
            withLineNumbers(() => {}, {
                class: 'opacity-25',
                color: '#edf2f7',
            })
        );
        editor.onUpdate((text) => {
            changedContent = text !== fetchedContent.text;
        });
        return () => {
            editor.destroy();
        };
    });

    let error: Error;
    let processRequest = false;
    let message: string;

    function refresh() {
        doRefresh(true);
    }
    function doRefresh(message: boolean) {
        processRequest = true;
        error = null;
        $s3Client
            .send(new GetObjectCommand({ Bucket: bucket, Key: file, ResponseCacheControl: 'no-cache' }))
            .then((response) => {
                const lastModified = new Date(response.$metadata.httpHeaders['last-modified']);
                const lastSynced = new Date();
                return streamCollector(response.Body).then((uint8Array) => [uint8Array, lastModified, lastSynced]);
            })
            .then(([uint8Array, lastModified, lastSynced]) => {
                const text = encoder.decode(uint8Array as Uint8Array);
                fetchedContent = { text, lastModified, lastSynced } as TextContent;
                changedContent = text !== fetchedContent.text;
                editor.updateCode(text);
                if (message) {
                    if (changedContent) {
                        setMessage('Change detected');
                    } else {
                        setMessage('No change detected');
                    }
                }
            })
            .catch((error) => (error = error))
            .finally(() => (processRequest = false));
    }

    function save() {
        processRequest = true;
        error = null;
        $s3Client
            .send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: file,
                    Body: editor.toString(),
                })
            )
            .then((_) => {
                setMessage('Saved successfully');
                doRefresh(false);
            })
            .catch((error) => (error = error))
            .finally(() => (processRequest = false));
    }

    function setMessage(content: string) {
        message = content;
        setTimeout(() => (message = undefined), 2000);
    }

    doRefresh(false);
</script>

<div class="container mx-auto flex justify-center" in:blur>
    <div class="mt-10">
        <div class="flex text-4xl mb-3 text-center">
            <div class="font-serif mr-1">S3:</div>
            <div class="font-mono font-bold">{file}</div>
        </div>

        <div class="flex text-xl mb-3 text-center">
            <div class="font-serif mr-1">Bucket:</div>
            <a
                class="font-mono font-semibold hover:underline"
                href="https://console.aws.amazon.com/s3/buckets/{bucket}"
                target="_blank">{bucket}</a>
        </div>
        {#if error}
            <div class="text-red-800 mb-4 max-w-lg" transition:slide>ERROR: {error}</div>
        {/if}
    </div>
</div>

<div class="container mx-auto flex mb-8 justify-center resize-none">
    <!-- Editor -->
    <div
        bind:this={editorNode}
        class="p-2 bg-gray-300 border-l-4 border-r-4 focus-within:border-orange-700 shadow-md rounded" />

    <!-- Side controls -->
    {#if fetchedContent}
        <div class="fixed right-0 p-2 bg-gray-400 rounded shadow-md opacity-75" in:blur>
            <div class="text-sm tracking-tighter">Last Modified: {displayDate(fetchedContent.lastModified)}</div>
            <div class="text-sm tracking-tighter">
                Last Sync:
                {humanizeDuration(Math.max($now.getTime() - fetchedContent.lastSynced.getTime(), 1000), {
                    largest: 1,
                    round: true,
                    units: ['d', 'h', 'm', 's'],
                })}
            </div>
            <div class="inline-block mt-2">
                <EitherOr either={!changedContent}>
                    <span slot="either">
                        <Button
                            name="Refresh"
                            svgSpec={{ ...refreshSpec, size: 'w-5' }}
                            pressed={processRequest}
                            on:click={refresh}
                            extraClass="bg-teal-600" />
                    </span>
                    <span slot="or">
                        <Button
                            name="Save"
                            svgSpec={{ ...saveSpec, size: 'w-5' }}
                            pressed={processRequest}
                            on:click={save}
                            extraClass="bg-green-600" />
                    </span>
                </EitherOr>
            </div>
            {#if message}
                <div class="mt-2 border-t-2 pt-1 border-gray-500 border-opacity-25 text-sm tracking-tighter" transition:slide>
                    {message}
                </div>
            {/if}
        </div>
    {/if}
</div>
