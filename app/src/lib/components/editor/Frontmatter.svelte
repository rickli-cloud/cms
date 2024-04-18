<script lang="ts">
  import { z } from "zod";
  import type { Writable } from "svelte/store";

  import BasicFrontmatter from "./BasicFrontmatter.svelte";
  
  export let data: Record<string, Writable<unknown>>;
  export let schema: Record<keyof typeof data, z.ZodType> // Config.Collection.Union['frontmatter'];

  console.debug({ data })
</script>


{#if schema && data && Object.keys(data).length}
  <div class="mb-3">
    {JSON.stringify(data, null, 2)}
  </div>

  {#each Object.entries(schema) as [title, item],index}
    <BasicFrontmatter {title} {item} {index} data={data[title]} />
  {/each}
{/if}
