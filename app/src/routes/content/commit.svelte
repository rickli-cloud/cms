<script lang="ts">
  import Pencil from "svelte-radix/Pencil1.svelte"
  import Trash from "svelte-radix/Trash.svelte"

  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import * as Avatar from "$lib/components/ui/avatar";
  import Header from "$lib/components/site/Header.svelte";
  import Loading from "$lib/components/site/Loading.svelte";
  import MonacoEditor from "$lib/components/editor/MonacoEditor.svelte"
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte";

  import { getCommitDetail } from "$lib/api/repo";
  import { commitFileRef, Ref, type CommitFileRef } from "$lib/utils/ref";
  import { writable } from "svelte/store";
  import { Badge } from "$lib/components/ui/badge";

  export let params: { ref: string };
  let parsed: CommitFileRef

  try {
    if (!params.ref) throw new Error("Expected ref.");
    parsed = commitFileRef.parse(Ref.parse(params.ref));
  } catch (err) {
    console.error("Error while parsing collection file:", err);
  }

  async function init() {
    if (!parsed) return;

    const commit = await getCommitDetail(parsed.sha)
    const file = commit.files?.find(i => i.filename === parsed.path)

    console.log({ parsed, commit, file })

    return {
      commit,
      file
    }
  }
</script>

<Header />

<main class="container">
  {#if parsed?.name && parsed.collection}
    <section class="grid-full">
      <div class="flex gap-2">
        <h2 class="text-2xl font-bold tracking-tight">
          {parsed.name}
        </h2>
        
        <ToggleGroup.Root type="multiple" class="ml-auto">
          <a 
          href="#/content/edit/{params.ref}"
          class="h-9 px-3 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground bg-transparent"
          >
          <Pencil class="h-4 w-4" />
        </a>
        
        <ToggleGroup.Item value="italic" aria-label="Toggle italic">
          <Trash class="h-4 w-4 text-red-600" />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
    
    <p class="text-muted-foreground">
      {parsed.path}
    </p>
  </section>
  {/if}

  {#await init()}
    <Loading />
  {:then data}
  {#if data}
    <section class="grid-full mt-3 mb-6">
      <div class="flex gap-2 items-center">
        <Avatar.Root class="h-6 w-6 rounded-sm">
          <Avatar.Image src={data.commit.author?.avatar_url} title={data.commit.author?.login} />
          <Avatar.Fallback>?</Avatar.Fallback>
        </Avatar.Root>

        <a 
            class="font-semibold hover:text-blue-600" 
            href={data.commit.author?.html_url} 
            target="_blank"
          >
            @{data.commit.author?.login}

          </a>

          <p class="text-sm text-muted-foreground">
            on {new Date(data.commit.commit.author?.date || data.commit.commit.committer?.date || "").toLocaleString()}
          </p>

          <Badge variant="positive">+ {data.file?.additions}</Badge>
          <Badge variant="destructive">- {data.file?.deletions}</Badge>
      </div>

      <blockquote class="mt-3 border-l-2 pl-6 italic">
        {data.commit.commit.message}
      </blockquote>
    </section>

    <section class="grid-full mb-6">
      <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        Patch
      </h3>

      <div class="overflow-y-scroll h-96 my-3">  
        <MonacoEditor Content={writable(data.file?.patch)} language="patch" readOnly  />
      </div>
    </section>

    <section class="grid-full mb-6">
      {#if data.commit.files}
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
          Changed files
        </h3>
        
        <ul class="list-disc mx-5 mt-2">
          {#each data.commit.files as file}
          <li 
            class:font-bold={file.filename === parsed?.path}
            class:text-green-600={file.status === "added" || file.status === "copied"}
            class:text-red-600={file.status === "removed"}
            class:text-yellow-400={file.status === "renamed"}
            >
            {file.filename}
          </li>
          {/each}
        </ul>
      {/if}
    </section>

    <div class="grid-full">
      {JSON.stringify(data, null, 4)}
    </div>
  {/if}
  {:catch err}
    <section class="grid-full">
      <ErrorComponent {err} />
    </section>
  {/await}
</main>

<!-- <script lang="ts">
  // import { writable} from "svelte/store";

  // import * as Card from "$lib/components/ui/card"
  // import { Badge } from "$lib/components/ui/badge/index";

  // import MonacoEditor from "$lib/components/editor/MonacoEditor.svelte";
  // import Markdown from "$lib/components/editor/Markdown.svelte";
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte";
  import Loading from "$lib/components/site/Loading.svelte";
  import Header from "$lib/components/site/Header.svelte";
  import { type CommitFileRef, commitFileRef, Ref } from "$lib/utils/ref";
  import { getCommitDetail } from "$lib/api/repo";
  // import { Backend } from "$lib/store/config";

  export let params: { ref: string };
  let parsed: CommitFileRef

  async function init() {
    if (!params.ref) throw new Error("Expected ref.");

    try {
      parsed = commitFileRef.parse(Ref.parse(params.ref));
    } catch (err) {
      console.error("Error while parsing collection file:", err);
      return undefined;
    }

    const commit = await getCommitDetail(parsed.sha)
    console.log({ commit })

    return commit
  }

  function getFile(files: NonNullable<Awaited<ReturnType<typeof init>>>["files"], filename = parsed.path) {
    return files?.find(i => i.filename === filename)
  }

  /* function genCommitData(files: NonNullable<Awaited<ReturnType<typeof init>>>["files"]): Writable<string> {
    if (!files) return writable("")
    return writable(
      files?.map((file) => `
### ${file.filename} 

> \+ ${file.additions} / - ${file.deletions} / ${file.changes}

\`\`\`patch
${file.patch}
\`\`\`
`.trim()).join("\n\n")
    )
  } */
</script>

<Header />

<main class="container">
  {#await init()}
    <Loading />
  {:then data}
  {#if data}
    <section class="grid-full">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {parsed.name}
      </h1>
    </section>

    {#if data.files}
      {#await getFile(data.files)}
        <Loading />
      {:then file}
      {#if file}
        <div class="grid-full">
          <table class="table mb-3">
            <tbody>
              <tr>
                <td>Additions</td>
                <td>{file.additions}</td>
              </tr>
              
              <tr>
                <td>Deletions</td>
                <td>{file.deletions}</td>
              </tr>
              
              <tr>
                <td>Total Changes</td>
                <td>{file.changes}</td>
              </tr>

              {#if file.previous_filename}
                <tr>
                  <td>Previous filename</td>
                  <td>{file.previous_filename}</td>
                </tr>
              {/if}
            </tbody>
          </table>

          {JSON.stringify(file, null, 2)}
        </div>
      {:else}
        <div>404</div>
      {/if}
      {/await}
    {/if}
  {/if}
  {:catch err}
    <ErrorComponent {err} />
  {/await}
</main>
 -->