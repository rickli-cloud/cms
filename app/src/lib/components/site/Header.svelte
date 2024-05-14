<script lang="ts">
  import { Enter, Exit, HamburgerMenu } from "svelte-radix";

  import * as Avatar from "$lib/components/ui/avatar";
  import * as Sheet from "$lib/components/ui/sheet";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button";
  
  import { User, endSession, initUser } from "$lib/store/session";

  export let position: "sticky" | "fixed" = "sticky"
  export let disableContainer: boolean = false
  export let disableNav: boolean = false
  export let disableSheet: boolean = false
  export let disableProfile: boolean = false
</script>

<header 
  class="h-12 top-0 z-40 shadow-md w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  class:sticky={position === "sticky"}
  class:fixed={position === "fixed"}
>
  <Sheet.Root>
    <div 
      class="h-full flex items-center gap-8"
      class:container={!disableContainer}
      class:max-w-screen-2xl={!disableContainer}
      class:px-8={disableContainer}
    >
      <nav class="site">
        <a 
          href="#/"
          class="font-bold"
          class:!text-foreground={/^(#\/)?$/i.test(document.location.hash)}
        >
          CMS
        </a>

        {#if !disableNav}
          <slot name="nav">
            <a 
              href="#/content"
              class:!text-foreground={/^#\/content/i.test(document.location.hash)}
            >
              Content
            </a>
            <a 
              href="#/media"
              class:!text-foreground={/^#\/media/i.test(document.location.hash)}
            >
              Media
            </a>
          </slot>
        {/if}
      </nav>

      <slot />

      {#if !disableSheet}
        <Sheet.Trigger asChild let:builder>
          <Button builders={[builder]} variant="ghost" size="icon" class="ml-auto">
            <HamburgerMenu class="h-5 w-5" />
          </Button>
        </Sheet.Trigger>
      {/if}
    </div>
    
    <Sheet.Content 
      side="right" 
      class="overflow-y-scroll scrolltrack-hidden" 
      style="-ms-overflow-style: none !important; scrollbar-width: none !important;"
    >
      {#if !disableProfile}
        <div class="h-16 bg-muted -m-6 mb-0" />
        <!-- <Separator /> -->

        <div class="flex gap-3 -mt-12">
          <Avatar.Root class="h-24 w-24 rounded-full">
            <Avatar.Image src={$User?.avatar_url} alt="@{$User?.login}" title={$User?.login} />
            <Avatar.Fallback>?</Avatar.Fallback>
          </Avatar.Root>

          <div class="grid grid-rows-2 gap-1">
            <p class="text-lg font-semibold self-end">
              {$User?.name || $User?.login || "Anonymous"}
            </p>

            <div class="flex gap-2 items-center pb-4">
              {#if $User}                
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild let:builder>
                    <Button 
                      class="text-muted-foreground hover:text-current !p-0 gap-1 h-auto" 
                      variant="noStyle"
                      builders={[builder]}
                    >
                      <Exit class="h-4 w-4" />
                      Exit
                    </Button>
                  </AlertDialog.Trigger>

                  <AlertDialog.Content>
                    <AlertDialog.Header>
                      <AlertDialog.Title>
                        Are you absolutely sure?
                      </AlertDialog.Title>
                      <AlertDialog.Description>
                        This will end your session and will require another exchange with the identity provider for another session. 
                      </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                      <AlertDialog.Cancel>
                        Cancel
                      </AlertDialog.Cancel>

                      <AlertDialog.Action on:click={() => endSession()}>
                        Continue
                      </AlertDialog.Action>
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              {:else}
                <Button 
                  class="text-muted-foreground hover:text-current !p-0 gap-1 h-auto" 
                  variant="noStyle"
                  on:click={() => initUser().catch(console.error)}
                >
                  <Enter class="h-4 w-4" />
                  Login
                </Button>
              {/if}

              <!-- <button 
                class="text-muted-foreground hover:text-current inline-flex items-center gap-1.5 my-0.5"
              >
                <Exit class="h-4 w-4" />
                Exit
              </button> -->
            </div>
          </div>
        </div>
      {/if}
    </Sheet.Content>
  </Sheet.Root>
</header>


<style scoped lang="postcss">
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
