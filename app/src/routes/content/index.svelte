<script lang="ts">
  import { get, writable } from "svelte/store";
  
  import * as Card from "$lib/components/ui/card"

  import CollectionsTable from "$lib/components/collectionsTable/CollectionsTable.svelte";
  import Loading from "$lib/components/site/Loading.svelte";
  import Header from "$lib/components/site/Header.svelte";
  import { Collections } from "$lib/store/config";
  import { getContent, type InternalContentData, type ContentData } from "$lib/api/repo";

  const Data = writable<{ [x: string]: ContentData[] }>({})
  const TableData = writable<InternalContentData[]>([])
  
  Data.subscribe((data) => {
    TableData.set(new Array().concat(
      ...Object.entries(data).map(
        ([collection, items]) => items.map(i => ({ ...i, collection }))
      )
    ))

    console.log(get(TableData))
  })

  async function init() {
    const collections = get(Collections)
    console.log(collections)

    for (const collection of collections) {
      const update: {[x: string]: ContentData[]} = {}

      if (collection.type === "dir") {
        const files = await getContent(collection.path)  
        update[collection.name] = Array.isArray(files) ? files : [files]
      }
      
      if (collection.type === "file") {
        update[collection.name] = collection.files.map(i => ({ 
          ...i,
          type: "file",
          name: i.name || /[A-Za-z0-9.,-]+$/.exec(i.path)?.[0] || "unknown"
        }))
      }
      
      Data.update((data) => ({ ...data, ...update }))
    }

  }
</script>

<Header />

<main class="container">
  {#await init()}
   <Loading />
  {:then}
    <Card.Root class="md:grid-nav">
      <Card.Header>
        <Card.Title>Filters</Card.Title>
        <Card.Description>Filter or search for your content.</Card.Description>
      </Card.Header>
      <Card.Content>
        ...
      </Card.Content>
      <!-- <Card.Footer>
      </Card.Footer> -->
    </Card.Root>

    <Card.Root class="md:grid-content">
      <Card.Header>
        <Card.Title>Content</Card.Title>
        <Card.Description>Select one to show more information.</Card.Description>
      </Card.Header>
      <Card.Content>
        <CollectionsTable Data={TableData} />
      </Card.Content>
      <!-- <Card.Footer>
      </Card.Footer> -->
    </Card.Root>

  {/await}
</main>

