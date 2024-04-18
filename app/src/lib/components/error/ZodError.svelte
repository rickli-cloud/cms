<script lang="ts">
  import type { ZodError } from "zod";

  import * as Table from "$lib/components/ui/table";

  import ZodErrorDetails from './ZodErrorDetails.svelte'

  export let err: ZodError
</script>
	
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Path</Table.Head>
      <Table.Head class="min-w-64">Message</Table.Head>
      <Table.Head>Code</Table.Head>
      <Table.Head>Expected type</Table.Head>
      <Table.Head>Received type</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each err.issues as issue}
      <ZodErrorDetails {issue} />
    {/each}
  </Table.Body>
</Table.Root>

