<script lang="ts">
  import { ZodError } from "zod";
  import ExclamationTriangle from "svelte-radix/ExclamationTriangle.svelte";

  import * as Alert from "$lib/components/ui/alert/index.js";
  import * as Card from "$lib/components/ui/card"
  import * as Table from "$lib/components/ui/table";
  import ZodErrorComponent from './ZodError.svelte'
  import { CustomError } from "$lib/utils/error";

  export let err: unknown

  if (!(err instanceof ZodError)) console.error('Critical error:', err)

  const hostRegex = new RegExp(`^https?:\/\/${window.location.hostname}(:${window.location.port})?\/?`)
</script>

<Card.Root class="grid-full">
  <Card.Header>
    <slot name="header">
      {#if err instanceof ZodError}
        <Card.Title>
          Configuration error!
        </Card.Title>
        
        <Card.Description>
          See <a href="#/" class="text-blue-600">the docs</a> for reference.
        </Card.Description>
      {:else if (err instanceof CustomError || err instanceof Error)}
        <Card.Title>
          {(err instanceof CustomError ? err.title : undefined) || "Critical application error!"}
        </Card.Title>

        <Card.Description>
          {err.message}
        </Card.Description>
      {:else}        
        <Card.Title>Critical unknown error</Card.Title>
      {/if}
    </slot>
  </Card.Header>

  <Card.Content>
    {#if !(err instanceof ZodError) && (err instanceof CustomError || err instanceof Error)}
      <Alert.Root variant="destructive">
        <ExclamationTriangle class="h-4 w-4" />
        
        <Alert.Title>{err.name || "Error"}</Alert.Title>
        <Alert.Description>{"Cause: " + (err.cause || "unknown")}</Alert.Description>
      </Alert.Root>
    {/if}

    {#if err instanceof ZodError} 
      <ZodErrorComponent {err} />
    {:else if (err instanceof CustomError || err instanceof Error) && (err.stack && !(err instanceof CustomError && err.disableStack))}
      <br>
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
    {/if}
  </Card.Content>
</Card.Root>