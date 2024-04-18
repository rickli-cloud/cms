<script lang="ts">
  import { writable, get, type Writable } from "svelte/store";
  import type { IScrollEvent } from "monaco-editor";

  import * as Resizable from "$lib/components/ui/resizable/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  // import { Input } from "$lib/components/ui/input/index.js";
  // import { Label } from "$lib/components/ui/label/index.js";

  import FileText from "svelte-radix/FileText.svelte"

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

<Sheet.Root>
  <Header position="fixed" containerize={false} nav={false}>
    <div class="flex w-full items-center justify-end">
      <Sheet.Trigger asChild let:builder>
        <Button builders={[builder]} variant="ghost">
          <FileText class="h-5 w-5" />
        </Button>
      </Sheet.Trigger>
    </div>
  </Header>

  {#await init()}
    <Loading />
  {:then data}
    <Sheet.Content side="right" class="overflow-y-scroll">
      <Sheet.Header class="mb-3">
        <Sheet.Title>Metadata</Sheet.Title>
        <Sheet.Description>
          Make changes to metadata. This includes custom fields defined in your collection config.
        </Sheet.Description>
      </Sheet.Header>

      {#if data?.metadataSchema}
        <FrontmatterForm data={$Metadata} schema={data?.metadataSchema} />
      {/if}

      <!-- <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right">Username</Label>
          <Input id="username" value="@peduarte" class="col-span-3" />
        </div>
      </div> -->

      <Sheet.Footer class="mt-3">
        <Sheet.Close asChild let:builder>
          <Button builders={[builder]} type="submit">Save changes</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>

    <Resizable.PaneGroup direction="horizontal" class="pt-11">
      <Resizable.Pane>
        <Editor 
          {Content}
          on:scroll={(ev) => syncScroll(ev, previewNode)}
        />
      </Resizable.Pane>
      
      <Resizable.Handle />

      <Resizable.Pane>
        <div 
          class="h-full overflow-y-scroll overflow-x-hidden break-word py-1 pl-2 {customStyleClass}"
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
</Sheet.Root>