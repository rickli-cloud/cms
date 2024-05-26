<script lang="ts">
  import { get, writable } from "svelte/store";
  import { CountdownTimer, Pencil2, Plus, Trash } from "svelte-radix";
  
  // import * as Card from "$lib/components/ui/card"
  // import { Button } from "$lib/components/ui/button/index";
  
  import CollectionsTable from "$lib/components/collectionsTable/CollectionsTable.svelte";
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte";
  import Breadcrumbs from "$lib/components/site/Breadcrumbs.svelte";
  import Loading from "$lib/components/site/Loading.svelte";
  import Header from "$lib/components/site/Header.svelte";

  import { getContent, type InternalContentData, type ContentData } from "$lib/api/repo";
  import { Collections } from "$lib/store/config";
  import { Ref } from "$lib/utils/ref";

  const Data = writable<{ [x: string]: ContentData[] }>({})
  const TableData = writable<InternalContentData[]>([])
  const SelectedData = writable<Record<string, boolean>>()
  const SelectedRef = writable<string | undefined>();

  Data.subscribe((data) => {
    TableData.set(new Array().concat(
      ...Object.entries(data).map(
        ([collection, items]) => items.map(i => ({ ...i, collection, selected: false }))
      )
    ))

    console.log(data, get(TableData));
  });

  TableData.subscribe(tableData => console.log({tableData}));

  SelectedData.subscribe((selected) => {
    const keys = selected ? Object.keys(selected) : [];
    const data = keys.length ? get(TableData) : undefined;

    if (keys.length !== 1 || !data) SelectedRef.set(undefined);
    else {
      const { name, collection, path} = data[Number(keys[0])];
      SelectedRef.set(new Ref({ name, collection, path }).toString());
    }
  });

  /* function handleSelect(ev: CustomEvent<Record<string, boolean>>) {
    const data = get(TableData)
    
    for (const key of Object.keys(ev.detail)) {
      if (ev.detail[key]) console.log(key, data[Number(key)]?.name)
    }
  } */

  async function init() {
    const collections = get(Collections)
    console.log(collections)

    const promises: Promise<void>[] = []

    for (const collection of collections) {
      promises.push(new Promise(async (resolve, reject) => {
        try {
          const update: {[x: string]: ContentData[]} = {}
          
          if (collection.type === "dir") {
            const files = await getContent(collection.path)  
            update[collection.name] = Array.isArray(files) ? files : [files]
          }
          
          if (collection.type === "file") {
            update[collection.name] = collection.files.map(i => ({ 
              ...i,
              type: "file",
              name: i.name || /[A-Za-z0-9.,-:;]+$/.exec(i.path)?.[0] || "unknown"
            }))
          }
          
          Data.update((data) => ({ ...data, ...update }))

          resolve()
        } catch (e) {
          reject({ collection, cause: e})
        }
      }))
    }

    const results = await Promise.allSettled(promises)

    console.log(results)
    // TODO: alert if a collection could not be loaded
  }
</script>

<Header />

<Breadcrumbs routes={[{ name: "Content" }]} />

<main class="container">
  {#await init()}
   <Loading />
  {:then}
    <section class="grid-full md:!col-span-1 md:grid-nav-end list-group mb-3">
      <h3 >
        Filters
      </h3>

      <div>...</div>
    </section>
    
    <section class="grid-full md:!col-span-1 list-group mb-3">
      <h3>
        Actions
      </h3>

      <a 
        href={!$SelectedData || !Object.keys($SelectedData).length ? "#/content/create" : ""}
        aria-disabled={!!$SelectedData && !!Object.keys($SelectedData).length} 
        on:click={(ev) => !!$SelectedData && !!Object.keys($SelectedData).length ? ev.preventDefault() : void 0}
      >
        <Plus />
        Create
      </a>

      <a 
        href={$SelectedRef ? `#/content/edit/${$SelectedRef}` : ""}
        aria-disabled={!$SelectedRef} 
        on:click={(ev) => !$SelectedRef ? ev.preventDefault() : void 0}
      >
        <Pencil2 />
        Edit
      </a>

      <a 
        href={$SelectedRef ? `#/content/history/${$SelectedRef}` : ""}
        aria-disabled={!$SelectedRef} 
        on:click={(ev) => !$SelectedRef ? ev.preventDefault() : void 0}
      >
        <CountdownTimer />
        History
      </a>

      <button 
        on:click={() => void 0}
        disabled={!$SelectedData || !Object.keys($SelectedData).length}
        aria-disabled={!$SelectedData || !Object.keys($SelectedData).length}
        class="danger"
      >
        <Trash />
        Delete
      </button>
    </section>

    <section class="grid-full md:!col-span-9 md:row-span-12">
      <CollectionsTable Data={TableData} on:select={({detail}) => SelectedData.set(detail)} />
    </section>
  {:catch err}
    <section class="grid-full">
      <ErrorComponent {err} />
    </section>
  {/await}
</main>

