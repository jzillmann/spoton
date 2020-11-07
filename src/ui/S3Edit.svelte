<script lang="ts">
    import { ListBucketsCommand } from '@aws-sdk/client-s3';
    import { s3Client } from '../aws/clients';

    $: promise = $s3Client.send(new ListBucketsCommand({}));
</script>

<div class="text-lg font-bold">S3File</div>
{#await promise}
    <div>Waiting...</div>
{:then response}
    {#each response.Buckets as bucket}
        <div class="hover:bg-gray-200 cursor-pointer">{bucket.Name}</div>
    {/each}
{:catch error}
    <div>ERROR: {error}</div>
{/await}
