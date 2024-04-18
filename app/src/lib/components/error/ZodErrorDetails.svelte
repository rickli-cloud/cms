<script lang="ts">
  import type { ZodError } from "zod";

  import * as Table from "$lib/components/ui/table";

  export let issue: ZodError["issues"][0]
</script>

<Table.Row>
  <Table.Cell>{issue.path?.join('.')}</Table.Cell>
  <Table.Cell>{issue.message}</Table.Cell>
  <Table.Cell>{issue.code}</Table.Cell>

  {#if issue.code === "invalid_type" || issue.code === "invalid_literal"}
    <Table.Cell>{issue.expected}</Table.Cell>
    <Table.Cell>{issue.received}</Table.Cell>
  {:else if issue.code === "too_small"}
    <Table.Cell>{issue.type}</Table.Cell>
    <Table.Cell></Table.Cell>
  {:else}
    <Table.Cell></Table.Cell>
    <Table.Cell></Table.Cell>
  {/if}
</Table.Row>

{#if issue.code === "invalid_union"}
{#each issue.unionErrors as unionErr}
{#each unionErr.issues as unionIssue}
  <svelte:self issue={unionIssue} />
{/each}
{/each}
{/if}

{#if issue.code === "invalid_return_type"}
{#each issue.returnTypeError.issues as returnIssue}
  <svelte:self issue={returnIssue} />
{/each}
{/if}