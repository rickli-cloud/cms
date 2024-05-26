<script lang="ts">
  import Router from "svelte-spa-router";
  import { ModeWatcher } from 'mode-watcher';
  
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte"
  import Loading from "$lib/components/site/Loading.svelte";
  
  import Index from "$routes/index.svelte";
  import NotFound from "$routes/404.svelte"
  import Content from "$routes/content/index.svelte";
  import History from "$routes/content/history.svelte";
  import Edit from "$routes/content/edit.svelte";
  import Commit from "$routes/content/commit.svelte";
  
  import { initConfig } from "$lib/store/config";
  import { initSession } from "$lib/store/session";
  import type { Config } from "$lib/config";
  
  const routes = {
    "/": Index,
    
    "/content": Content,
    "/content/history/:ref": History,
    "/content/edit/:ref": Edit,
    "/content/commit/:ref": Commit,

    "*": NotFound
  }

  export let backend: Config.Backend;
  export let collections: Config.Collections;
  // export let storage: Config.Storage;

  async function init() {
    // throw new TypeError("test")
    
    await initConfig({ backend, collections, /* storage */ })
    await initSession()
    
    // await new Promise(r => setTimeout(r, 9999999999))
  }
  
  // throw new TypeError("test")
  // import { ApplicationError } from "$lib/utils/error";
  // throw new ApplicationError("Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias eveniet quasi facilis eos eius voluptates quaerat, dolore tenetur esse ducimus voluptatem et quo aperiam dicta officiis nobis excepturi ex a.")
</script>

<ModeWatcher />

{#await init()}
  <Loading />
{:then}
  <Router {routes} />
{:catch err}
  <main class="container">
    <section class="grid-full">
      <ErrorComponent {err} />
    </section>
  </main>
{/await}

