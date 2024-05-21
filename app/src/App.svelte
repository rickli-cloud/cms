<script lang="ts">
  import Router from "svelte-spa-router";
  import { ModeWatcher } from 'mode-watcher';

  import type { Config } from "$lib/config";
  import { initConfig } from "$lib/store/config";
  import { initSession } from "$lib/store/session";
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte"
  import Loading from "$lib/components/site/Loading.svelte";
  
  import Index from "$routes/index.svelte";
  import NotFound from "$routes/404.svelte"
  import Content from "$routes/content/index.svelte";
  import History from "$routes/content/history.svelte";
  import Edit from "$routes/content/edit.svelte";
  import Commit from "$routes/content/commit.svelte";
  
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
</script>


<ModeWatcher />

{#await init()}
  <Loading />
{:then}
  <Router {routes} />
{:catch err}
  <main class="container">
    <ErrorComponent {err} />
  </main>
{/await}

