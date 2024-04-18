<script lang="ts">
  import { z } from "zod";

  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  import { get, type Writable } from "svelte/store";
  
  export let data: Writable<unknown>
  export let title: string;
  export let item: z.ZodType;
  export let index: number;

  export let options: {
    readonly?: boolean
    optional?: boolean
    default?: string | number | Date
  } = {}

  if (!get(data) && options.default) data?.set(options.default)
</script>

<!-- <div>
  {JSON.stringify(options)}
</div> -->

{#if item instanceof z.ZodString || item instanceof z.ZodNumber || item instanceof z.ZodDate}

  <Label for="frontmatter-{index}">{title}</Label>
  <Input 
    type={item._def.typeName === "ZodString" ? "text" : item._def.typeName === "ZodNumber" ? "number" : "date"} 
    id="frontmatter-{index}"
    readonly={options.readonly}
    required={!options.optional}
    bind:value={$data}
    class="mb-1.5"
  />
  {#if item._def.description}
    <p class="text-sm text-muted-foreground">{item._def.description}</p>
  {/if}

{:else if item instanceof z.ZodOptional }

  <svelte:self {data} {title} item={item._def.innerType} {index} options={{ ...options, optional: true }} />

{:else if item instanceof z.ZodReadonly}
  
  <svelte:self {data} {title} item={item._def.innerType} {index} options={{ ...options, readonly: true }} />

{:else if item instanceof z.ZodDefault}

  <svelte:self {data} {title} item={item._def.innerType} {index} options={{ ...options, default: item._def.defaultValue() }} />

{/if}
