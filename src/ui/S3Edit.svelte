<script lang="ts">
    interface TextContent {
        text: string;
        lineCount: number;
        lastModified: Date;
        lastSynced: Date;
    }

    import { blur, slide } from 'svelte/transition';
    import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
    import { streamCollector } from '@aws-sdk/fetch-http-handler';
    import { s3Client } from '../aws/clients';
    import { inputs } from '../input/inputs';
    import humanizeDuration from 'humanize-duration';
    import { now, displayDate } from '../svelte/dates';

    const variables = $inputs.flatMap((input) => input.variables);
    const encoder = new TextDecoder('utf-8');

    $: console.log(variables);

    const bucket = variables.find((v) => v.key.includes('S3AssetsBucketName')).value;
    const file = 'config-files/overrides.properties';
    let textContent: string;

    let promise: Promise<TextContent>;
    let saveError: Error;
    function refresh() {
        promise = $s3Client
            .send(new GetObjectCommand({ Bucket: bucket, Key: file, ResponseCacheControl: 'no-cache' }))
            .then((response) => {
                const lastModified = new Date(response.$metadata.httpHeaders['last-modified']);
                const lastSynced = new Date();
                return streamCollector(response.Body).then((uint8Array) => [uint8Array, lastModified, lastSynced]);
            })
            .then(([uint8Array, lastModified, lastSynced]) => {
                const text = encoder.decode(uint8Array as Uint8Array);
                const lineCount = (text.match(/\n/g) || '').length;
                return { text, lineCount, lastModified, lastSynced } as TextContent;
            });
    }

    function save() {
        saveError = null;
        $s3Client
            .send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: file,
                    Body: textContent.replace('<br>', '').replace('<div>', ''),
                })
            )
            .then((_) => refresh())
            .catch((error) => (saveError = error));
    }

    refresh();
    $: {
        if (textContent) {
            console.log(textContent.replace('<br>', ''));
        }
    }
</script>

<div class="container mx-auto flex justify-center" in:blur>
    <div class="mt-10">
        <div class="flex text-4xl mb-3 text-center">
            <div class="font-mono">S3:</div>
            <div class="font-serif font-bold">{file}</div>
        </div>

        <div class="flex text-xl font-serif mb-3 text-center">
            <div class="mr-1">Bucket:</div>
            <a
                class="italic hover:underline"
                href="https://console.aws.amazon.com/s3/buckets/{bucket}"
                target="_blank">{bucket}</a>
        </div>
        {#if saveError}
            <div class="text-red-800 mb-4 max-w-lg" transition:slide>ERROR: {saveError}</div>
        {/if}
    </div>
</div>

{#await promise then content}
    <div class="flex" in:slide>
        <div class="container mx-auto flex mb-8 justify-center">
            <div class="flex mb-4 bg-gray-300 focus-within:border-orange-700 border-l-4 border-r-4 shadow-md rounded">
                <div class="p-2 bg-gray-500">
                    {#each Array(content.lineCount) as _, idx}
                        <div>{idx}</div>
                    {/each}
                </div>
                <div
                    bind:innerHTML={textContent}
                    on:keydown={(event) => {
                        if (event.key === 'Enter') {
                            document.execCommand('insertLineBreak');
                            event.preventDefault();
                        }
                    }}
                    on:paste={(event) => {
                        event.preventDefault();
                        var text = event.clipboardData.getData('text/plain');
                        document.execCommand('insertText', false, text);
                    }}
                    class="p-2 inline-block whitespace-pre-wrap outline-none"
                    role="textbox"
                    contenteditable>
                    {content.text}
                </div>
            </div>
        </div>
        <div class="fixed right-0 p-2 bg-gray-400 rounded shadow-md opacity-75">
            <div class="text-sm tracking-tighter">Last Modified: {displayDate(content.lastModified)}</div>
            <div class="text-sm tracking-tighter">
                Last Sync:
                {humanizeDuration(Math.max($now.getTime() - content.lastSynced.getTime(), 1000), {
                    largest: 1,
                    round: true,
                    units: ['d', 'h', 'm', 's'],
                })}
            </div>
            <div class="inline-block">
                {#if textContent === content.text || textContent
                        ?.replace('<br>', '')
                        .replace('<div>', '') === content.text}
                    <div class="flex p-2 mt-2 bg-teal-600 rounded-md cursor-pointer hover:shadow-md" on:click={refresh}>
                        <svg
                            class="fill-current stroke-current w-6 h-6 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            focusable="false"
                            style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 24 24">
                            <g fill="none">
                                <path
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </g>
                        </svg>
                        <div>Refresh</div>
                    </div>
                {:else}
                    <div class="flex p-2 mt-2 bg-green-600 rounded-md cursor-pointer hover:shadow-md" on:click={save}>
                        <svg
                            class="stroke-current w-6 h-6 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <div>Save</div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{:catch error}
    <div>Loading {file} from bucket {bucket}</div>
    <div>ERROR: {error}</div>
{/await}
