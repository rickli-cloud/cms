<script lang="ts">
  export let position: "sticky" | "fixed" = "sticky"
  export let containerize = true
  export let nav = true
</script>

<header 
  class:sticky={position === "sticky"}
  class:fixed={position === "fixed"}
>
  <div 
    class:container={containerize}
    class:px-5={!containerize}
  >
    <a href="#/" class="font-bold">
      CMS
    </a>

    {#if nav}
      <nav class="site">
        <!-- <a  href="#/" class:!text-foreground={/^$|^#\/$/.test(document.location.hash)}>Dashboard</a> -->
        <a  href="#/content" class:!text-foreground={/^#\/content/i.test(document.location.hash)}>Content</a>
        <a  href="#/media" class:!text-foreground={/^#\/media/i.test(document.location.hash)}>Media</a>
      </nav>
    {/if}

    <slot />
  </div>
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
    @apply flex items-center gap-6 text-sm;

    & > a {
      @apply transition-colors text-foreground/60;
    }
    & > a:hover {
      @apply text-foreground/80;
    }
  }
</style>
