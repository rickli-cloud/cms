<script lang="ts">
  import { writable} from "svelte/store";

  import * as Card from "$lib/components/ui/card"
  import { Badge } from "$lib/components/ui/badge/index";

  // import MonacoEditor from "$lib/components/editor/MonacoEditor.svelte";
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte";
  import Markdown from "$lib/components/editor/Markdown.svelte";
  import Loading from "$lib/components/site/Loading.svelte";
  import Header from "$lib/components/site/Header.svelte";
  import { type CommitFileRef, commitFileRef, Ref } from "$lib/utils/ref";
  import { getCommitDetail } from "$lib/api/repo";
  import { Backend } from "$lib/store/config";

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
    <!-- <Card.Root class="md:col-span-10">
      <Card.Header>
        <Card.Title>{parsed.name}</Card.Title>
        <Card.Description>{parsed.path}</Card.Description>
      </Card.Header>
    </Card.Root> -->
    
    <Card.Root class="md:col-span-10">
      <Card.Header>
        <Card.Title>
          <a href={data.author?.html_url}>
            @{data.author?.login}
          </a>
        </Card.Title>
        <Card.Description>{data.commit.message}</Card.Description>
      </Card.Header>

      {#if data.files}
      {#await getFile(data.files)}
        <Loading />
      {:then file} 
      {#if file}
        <Card.Content>
          <Card.Title class="flex gap-2 items-center mb-3 px-1">
            <a 
              href={file.blob_url + "?ref=" + parsed.sha}
              class="link"
            >
              {parsed.path}
            </a>

            <Badge
              variant={file.status === "removed" ? "destructive" : file.status === "added" ? "positive" : "default"}
            >
              {file.status}
            </Badge>
  
            {#if file.additions}
              <Badge variant="positive">
                +{file.additions}
              </Badge>
            {/if}
  
            {#if file.deletions}
              <Badge variant="destructive">
                -{file.deletions}
              </Badge>
            {/if}
          </Card.Title>
          
          <div class="cms-typography">
            <Markdown Content={writable(`\`\`\`patch\n${file.patch}\n\`\`\``)} />
          </div>
        </Card.Content>
      {/if}
      {/await}
          <!-- <Markdown Content={genCommitData(data.files)} /> -->
          
          <!-- <div class="h-24">
            <MonacoEditor Content={writable(getFile(data.files)?.patch)} language="patch" readOnly />
          </div> -->

          <!-- <div>
            {JSON.stringify(data.files.find(i => i.filename === parsed.path))}
          </div> -->
          <!-- {#each data.files as file}
            <div>{(file.status)}</div>
          {/each} -->
      {/if}

      <!-- <Card.Footer>
        <p>Card Footer</p>
      </Card.Footer> -->
    </Card.Root>
  {/if}

    <!-- <div class="md:col-span-10 break-words overflow-x-hidden">{JSON.stringify({data,parsed})}</div> -->
  {:catch err}
    <ErrorComponent {err} />
  {/await}
</main>
