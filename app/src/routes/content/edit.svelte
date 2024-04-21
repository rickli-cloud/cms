<script lang="ts">
  import { writable, get, type Writable } from "svelte/store";
  import type { IScrollEvent } from "monaco-editor";

  import * as Resizable from "$lib/components/ui/resizable/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  // import { Input } from "$lib/components/ui/input/index.js";
  // import { Label } from "$lib/components/ui/label/index.js";

  import HamburgerMenu from "svelte-radix/HamburgerMenu.svelte"

  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte";
  import FrontmatterForm from "$lib/components/editor/Frontmatter.svelte";
  import Markdown from "$lib/components/editor/Markdown.svelte";
  import Loading from "$lib/components/site/Loading.svelte";
  import Editor from "$lib/components/editor/MonacoEditor.svelte";
  import Header from "$lib/components/site/Header.svelte";
  import { Ref, type CollectionFileRef, collectionFileRef } from "$lib/utils/ref";
  import Frontmatter from "$lib/utils/frontmatter";
  import { Base64 } from "$lib/utils/base64";
  import { getContent } from "$lib/api/repo";
  import { Collections } from "$lib/store/config";

  export let params: { ref: string };
  let customStyleClass: string =  "cms-typography"
  
  function syncScroll(ev: CustomEvent<IScrollEvent>, node: HTMLElement) {
    node.scrollTo(
      node.scrollLeft, 
      (node.scrollHeight / 100) * (ev.detail.scrollTop / (ev.detail.scrollHeight / 100))
    )
  }

  const Content = writable<string>("");
  const Metadata = writable<Record<string, Writable<unknown>>>();
  Metadata.subscribe(console.debug)

  let previewNode: HTMLElement

  async function init() {
    if (!params.ref) throw new Error("Expected ref.");

    let parsed: CollectionFileRef
    try {
      parsed = collectionFileRef.parse(Ref.parse<CollectionFileRef>(params.ref));
    } catch (err) {
      console.error("Error while parsing collection file:", err);
      return undefined;
    }

    const collection = get(Collections).find(({ name }) => name === parsed.collection)
    if (!collection) return undefined

    const file = await getContent(parsed.path);
    console.debug({ file })

    if (Array.isArray(file) || file?.type !== "file") {
      console.error(new Error("Expected file got something else"))
      return undefined
    }

    const content = file.content && Base64.decode(file.content)

    if (content)  {
      if (Frontmatter.regex.test(content)) {
        const frontmatter = Frontmatter.parse<{ [x: string]: string }>(content)
        Content.set(content?.replace(Frontmatter.regex, ""))

        if (collection.frontmatter) {
          Metadata.set(Object.fromEntries(Object.entries(collection.frontmatter).map(([k]) => ([k, writable(frontmatter[k]) || ""]))))
        }

        // Metadata.set(Object.fromEntries(Object.entries(collection.frontmatter).map(([k,v]) => ([k, writable(v)]))))
      } else {
        Content.set(content)
      }
    }

    return {
      metadataSchema: collection.frontmatter
    };
  }

</script>

<Header position="fixed" disableContainer disableNav />

{#await init()}
  <!-- <Sheet.Content>
    <Loading />
  </Sheet.Content> -->
  <Loading />
{:then data}
  <!-- <Sheet.Content side="right" class="overflow-y-scroll">
    <Sheet.Header class="mb-3">
      <Sheet.Title>Metadata</Sheet.Title>
      <Sheet.Description>
        Make changes to metadata. This includes custom fields defined in your collection config.
      </Sheet.Description>
    </Sheet.Header>

    <form action="">
      {#if data?.metadataSchema}
        <FrontmatterForm data={$Metadata} schema={data?.metadataSchema} />
      {/if}
    </form>

    <Sheet.Footer class="mt-3">
      <Sheet.Close asChild let:builder>
        <Button builders={[builder]} type="submit">Save changes</Button>
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content> -->

  <Resizable.PaneGroup direction="horizontal" class="pt-14">
    <Resizable.Pane>
      <Editor 
        {Content}
        on:scroll={(ev) => syncScroll(ev, previewNode)}
      />
    </Resizable.Pane>
    
    <Resizable.Handle />

    <Resizable.Pane>
      <div 
        class="h-full overflow-y-scroll overflow-x-hidden break-word py-1 px-3 {customStyleClass}"
        class:minimal-prose={!customStyleClass}
        bind:this={previewNode}
      >
        <Markdown {Content} />
        <div class="h-full" />
      </div>
    </Resizable.Pane>
  </Resizable.PaneGroup>
{:catch err}
  <main class="container">
    <ErrorComponent {err} />
  </main>
{/await}