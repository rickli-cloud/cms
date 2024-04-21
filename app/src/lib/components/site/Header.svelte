<script lang="ts">
  import { HamburgerMenu } from "svelte-radix";

  import * as Avatar from "$lib/components/ui/avatar";
  import * as Sheet from "$lib/components/ui/sheet";
  import {Button} from "$lib/components/ui/button/index";
  
  import { User } from "$lib/store/session";
  import Separator from "../ui/separator/separator.svelte";

  export let position: "sticky" | "fixed" = "sticky"

  export let disableContainer: boolean = false
  export let disableNav: boolean = false
  export let disableSheet: boolean = false
  export let disableProfile: boolean = false
</script>

<header 
  class:sticky={position === "sticky"}
  class:fixed={position === "fixed"}
>
  <Sheet.Root>
    <div 
      class:container={!disableContainer}
      class:px-8={disableContainer}
    >
      <a href="#/" class="font-bold">
        CMS
      </a>

      {#if !disableNav}
        <nav class="site">
          <!-- <a  href="#/" class:!text-foreground={/^$|^#\/$/.test(document.location.hash)}>Dashboard</a> -->
          <a  href="#/content" class:!text-foreground={/^#\/content/i.test(document.location.hash)}>Content</a>
          <a  href="#/media" class:!text-foreground={/^#\/media/i.test(document.location.hash)}>Media</a>
        </nav>
      {/if}

      <slot />

      {#if !disableSheet}

        <Sheet.Trigger asChild let:builder>
          <Button builders={[builder]} variant="ghost" size="icon" class="ml-auto">
            <HamburgerMenu class="h-5 w-5" />
          </Button>
        </Sheet.Trigger>
      {/if}

    </div>
    
    <Sheet.Content side="right" class="overflow-y-scroll scrolltrack-hidden" style="-ms-overflow-style: none !important; scrollbar-width: none !important;">
      {#if !disableProfile}
        <div class="h-16 bg-muted -m-6 mb-0" />
        <!-- <Separator /> -->

        <div class="flex gap-3 -mt-12">
          <Avatar.Root class="h-24 w-24 rounded-full">
            <Avatar.Image src={$User?.avatar_url} alt="@{$User?.login}" title={$User?.login} />
            <Avatar.Fallback>?</Avatar.Fallback>
          </Avatar.Root>

          <div class="grid grid-rows-2 [&>*]:my-1">
            <p class="text-lg font-semibold self-end">
              {$User?.name || "" + $User?.login}
            </p>
          </div>
        </div>

        <!-- <div class="flex gap-2.5 items-center">
          <Avatar.Root class="h-8 w-8 rounded-sm">
            <Avatar.Image src={$User?.avatar_url} alt="@{$User?.login}" title={$User?.login} />
            <Avatar.Fallback>?</Avatar.Fallback>
          </Avatar.Root>

          <p class="text-lg font-semibold">@{$User?.login}</p>
        </div> -->
      {/if}

      <!-- <Sheet.Header class="mb-3">
        <Sheet.Title>Profile</Sheet.Title>
        <Sheet.Description>
          Make changes to metadata. This includes custom fields defined in your collection config.
        </Sheet.Description>
      </Sheet.Header> -->
    
    </Sheet.Content>

  </Sheet.Root>
</header>


<style scoped lang="postcss">
  header {
    @apply border-b h-11 top-0 z-40 shadow-md w-full;
    background-color: hsl(var(--background) / var(--tw-bg-opacity));

    & > div {
      @apply h-full flex items-center gap-8;
    }
  }

  nav.site {
    @apply flex flex-nowrap items-center gap-6 text-sm;

    & > a {
      @apply transition-colors text-foreground/60;
    }
    & > a:hover {
      @apply text-foreground/80;
    }
  }
</style>
