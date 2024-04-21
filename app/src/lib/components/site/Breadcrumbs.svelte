<script lang="ts">
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import Slash from "svelte-radix/Slash.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";


  export let routes: { name: string, href?: string }[]
</script>
 
<Breadcrumb.Root class="container mt-4">
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="#/">
        Home
      </Breadcrumb.Link>
    </Breadcrumb.Item>

    {#each routes as route}
      <Breadcrumb.Separator>
        <Slash />
      </Breadcrumb.Separator>
      
      <Breadcrumb.Item>

        {#if route.href}
          <Breadcrumb.Link href={route.href}>
            {route.name}
          </Breadcrumb.Link>
        {:else}
          <Breadcrumb.Page>
            {route.name}
          </Breadcrumb.Page>
        {/if}
      </Breadcrumb.Item>
    {/each}

    <!-- <Breadcrumb.Item>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="flex items-center gap-1">
          Components
          <ChevronDown tabindex="-1" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <DropdownMenu.Item>Documentation</DropdownMenu.Item>
          <DropdownMenu.Item>Themes</DropdownMenu.Item>
          <DropdownMenu.Item>GitHub</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Breadcrumb.Item> -->

    <!-- <Breadcrumb.Separator>
      <Slash tabindex="-1" />
    </Breadcrumb.Separator> -->

    <!-- <Breadcrumb.Item>
      <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
    </Breadcrumb.Item> -->

  </Breadcrumb.List>
</Breadcrumb.Root>