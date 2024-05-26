<script lang="ts">
  import { ZodError } from "zod";
  import ExclamationTriangle from "svelte-radix/ExclamationTriangle.svelte";

  import * as Table from "$lib/components/ui/table";

  import ZodErrorComponent from './ZodError.svelte'
  import { ApplicationError } from "$lib/utils/error";

  export let err: unknown

  if (!(err instanceof ZodError)) console.error('Critical error:', err)

  const hostRegex = new RegExp(`^https?:\/\/${window.location.hostname}(:${window.location.port})?\/?`)
</script>

<slot>
  <div class="mb-6 grid gap-1.5">
    <div class="flex items-center gap-2">
      <ExclamationTriangle class="h-6 w-6 mt-0.5" />
      
      <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        {#if err instanceof ZodError}
            Configuration error
        {:else if err instanceof ApplicationError || err instanceof Error}
            {err.name || "Application error"}
        {:else}
            Critical application error
        {/if}
      </h3>
    </div>
    
    <p class="leading-7 mt-2">
      {#if err instanceof ZodError}
        See <a href="#/" class="text-blue-600">the docs</a> for reference.
      {:else if (err instanceof ApplicationError || err instanceof Error) && err.message}
        <span class="font-bold">Message:</span>
        {err.message}
        <br>
        <span class="font-bold">Cause:</span>
        {err.cause || "unknown"}
      {/if}
    </p>
  </div>
</slot>

{#if err instanceof ZodError} 
  <ZodErrorComponent {err} />
{:else if (err instanceof ApplicationError || err instanceof Error) && (err.stack && !(err instanceof ApplicationError && err.disableStack))}
  <p class="font-semibold text-lg mb-1.5">
    Stacktrace
  </p>  

  <Table.Root>
    <Table.Body>
      {#each err.stack.split(/\s/gm).map(i => i.split(/@/)) as stack}
      {#if stack[0] || stack[1]}
        <Table.Row>
          <Table.Cell>{stack[0] || "<anonymous>"}</Table.Cell>
          <Table.Cell>{stack[1]?.replace(hostRegex, "")}</Table.Cell>
        </Table.Row>
      {/if}
      {/each}
    </Table.Body>
  </Table.Root>
{:else}
  {JSON.stringify(err)}
{/if}