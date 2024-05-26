<script lang="ts">
  import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
  import { addPagination, addSelectedRows } from "svelte-headless-table/plugins";
  import { get, type Writable } from "svelte/store";

  import * as Table from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button";

  // import DataTableActions from "./TableActions.svelte";
  import type { InternalContentData } from "$lib/api/repo";
  import { formatBytes } from "$lib/utils/bytes";
  // import { Ref, type CollectionFileRef } from "$lib/utils/ref";
  import CellCheckbox from "./CellCheckbox.svelte";
  import { createEventDispatcher } from "svelte";
 
  export let Data: Writable<InternalContentData[]>
 
  const table = createTable(Data, {
    page: addPagination(),
    select: addSelectedRows(),
  });

  const dispatch = createEventDispatcher<{ select: Record<string, boolean> }>()
 
  const columns = table.createColumns([
    table.column({
      header: (_, { pluginStates }) => {
        const { allPageRowsSelected } = pluginStates.select;
        return createRender(CellCheckbox, {
          checked: allPageRowsSelected
        });
      },
      accessor: "selected",
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select;
        const { isSelected } = getRowState(row);
 
        return createRender(CellCheckbox, {
          checked: isSelected
        });
      },
    }),
    table.column({
      accessor: "collection",
      header: "Collection",
    }),
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "type",
      header: "Type",
    }),
    table.column({
      accessor: "size",
      header: "Size",
      cell: ({ value }) => value ? formatBytes(value) : "unknown"
    }),
    /*
    table.column({
      accessor: "amount",
      header: "Amount",
      cell: ({ value }) => {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
        return formatted;
      },
    }), */
    /* table.column({
      accessor: ({ name, collection, path }) => new Ref({ name, collection, path } as CollectionFileRef).toString(),
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, { ref: value });
      },
    }),  */
  ]);
 
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows } = table.createViewModel(columns);
  const { hasNextPage, hasPreviousPage, pageIndex, pageCount, pageSize } = pluginStates.page;
  const { selectedDataIds } = pluginStates.select;

  selectedDataIds.subscribe((selectedDataIds) => dispatch("select", selectedDataIds))
</script>

<Table.Root {...$tableAttrs}>
  <Table.Header>
    {#each $headerRows as headerRow}
      <Subscribe rowAttrs={headerRow.attrs()}>
        <Table.Row>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
              <Table.Head {...attrs}>
                {#if cell.id === "amount"}
                  <div class="text-right">
                    <Render of={cell.render()} />
                  </div>
                {:else}
                  <Render of={cell.render()} />
                {/if}
              </Table.Head>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Header>
  
  <Table.Body {...$tableBodyAttrs}>
    {#each $pageRows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <Table.Row 
          {...rowAttrs} 
          data-state={$selectedDataIds[row.id] && "selected"}
          class="cursor-pointer"
          on:click={(ev) => {
            const state = row.state?.pluginStates.select.getRowState(row);
            state?.isSelected.set(!get(state?.isSelected));
          }}
        >
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <Table.Cell {...attrs} >
                {#if cell.id === "amount"}
                  <div class="text-right font-medium">
                    <Render of={cell.render()} />
                  </div>
                {:else if cell.id === "status"}
                  <div class="capitalize">
                    <Render of={cell.render()} />
                  </div>
                {:else}
                  <Render of={cell.render()} />
                {/if}
              </Table.Cell>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Body>
</Table.Root>

<div class="flex items-center gap-x-4 py-4">
  <div class="flex-1 text-sm text-muted-foreground">
    {Object.keys($selectedDataIds).length} of{" "}
    {$rows.length} row(s) selected.
  </div>

  <p class="text-sm text-muted-foreground">
    {$Data.length} items | Page {$pageIndex + 1} of {$pageCount}
  </p>

  <div class="ml-auto flex items-center gap-x-4">
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
    >
  </div>
</div>
