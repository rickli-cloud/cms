<script lang="ts">
  import { writable } from "svelte/store";
  import Pencil from "svelte-radix/Pencil1.svelte"
  import Trash from "svelte-radix/Trash.svelte"
 
  import * as Avatar from "$lib/components/ui/avatar";
  // import * as Command from "$lib/components/ui/command/index";
  // import * as Card from "$lib/components/ui/card"
  // import * as Separator from "$lib/components/ui/separator/index";
  import { Badge } from "$lib/components/ui/badge/index";
  
  import Header from "$lib/components/site/Header.svelte";
  import Loading from "$lib/components/site/Loading.svelte";
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte";
  import CommitTimeline from "$lib/components/commitTimeline/CommitTimeline.svelte";
  import { getCommits, getContent } from "$lib/api/repo";
  import { Ref, type CollectionFileRef, collectionFileRef } from "$lib/utils/ref";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import { formatTime } from "$lib/utils/time";

  export let params: { ref: string };
  let parsed: CollectionFileRef

  async function init() {
    if (!params.ref) throw new Error("Expected ref.");

    try {
      parsed = collectionFileRef.parse(Ref.parse(params.ref));
    } catch (err) {
      console.error("Error while parsing collection file:", err);
      return undefined;
    }

    const file = await getContent(parsed.path);

    if (Array.isArray(file) || file.type !== "file") {
      console.error(new Error("Expected file got something else"))
      return undefined
    }

    const commits = await getCommits(file.path)

    console.log(commits)

    return {file, commits};
  }

  function genRef(sha: string): string {
    return new Ref({ ...parsed, sha }).toString()
  }

</script>

<Header />

<main class="container">
  {#await init()}
    <Loading />
  {:then data}
  {#if data}
    <section class="grid-full">
      <div class="flex gap-2">
        <h2 class="text-2xl font-bold tracking-tight">
          {data.file.name}
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
        {data.file.path}
      </p>
    </section>
    
    <!-- <Separator class="grid-full" /> -->

    <section class="grid-full">
      <CommitTimeline ref={parsed} commits={data.commits} />
      <!-- <ol class="timeline selectable mx-3 mt-4">
        {#each data.commits as commit,index}
        <a href="#/content/commit/{genRef(commit.sha)}">
            <li>
              <div class="header">
                <Avatar.Root class="h-5 w-5 rounded-full dot">
                  <Avatar.Image src={commit.author?.avatar_url} title={commit.author?.login} />
                  <Avatar.Fallback>?</Avatar.Fallback>
                </Avatar.Root>

                <a 
                  class="font-semibold hover:text-blue-600" 
                  href={commit.author?.html_url} 
                  target="_blank"
                >
                  @{commit.author?.login}
                </a>

                <p> 
                  {commit.commit.author?.date ? formatTime(commit.commit.author.date) : "No timestamp"}
                </p>
              </div>
              
              <p>
                {commit.commit.message}
              </p>

              {#if index === 0 || commit.commit.verification?.verified}
                <p>
                  {#if index === 0}
                  <Badge variant="default">Latest</Badge>
                  {/if}
                  
                  {#if commit.commit.verification?.verified}
                  <Badge variant="positive">Signed</Badge>
                  {/if}
                </p>
              {/if}
            </li>
          </a>
        {/each}
      </ol> -->
    </section>

    <!-- <Card.Root class="md:col-span-9">
      <Card.Header>
        <Card.Title>{data.file.name}</Card.Title>
        <Card.Description>{data.file.path}</Card.Description>
      </Card.Header>
    </Card.Root> -->

    <!-- <Command.Root class="rounded-lg border shadow-md">
      <Command.List>
        <Command.Group heading="Actions">
          <Command.Item>
            <a href="#/content/edit/{params.ref}" class="flex items-center w-full">
              <Pencil class="mr-2 h-4 w-4" />
              <span>Edit</span>
            </a>
          </Command.Item>
          
          <Command.Item class="!text-red-600" disabled>
            <Trash class="mr-2 h-4 w-4" />
            <span>Delete</span>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root> -->

    <!-- <Card.Root class="grid-content">
      <Card.Header>
        <Card.Title>Activity</Card.Title>
        <Card.Description>Recent changes displayed over time.</Card.Description>
      </Card.Header>

      <Card.Content class="grid gap-3">
        {#each data.commits as commit,index}
          <a
            class="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent w-full"
            href="#/content/commit/{genRef(commit.sha)}"
          >
            <!-- on:click={() => $SelectedCommit = index} --
            <div class="flex w-full flex-col gap-1">
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <a class="font-semibold hover:text-blue-600" href={commit.author?.html_url} target="_blank">
                    @{commit.author?.login}
                  </a>

                  <!-- {#if !item.read}
                    <span class="flex h-2 w-2 rounded-full bg-blue-600" />
                  {/if} --
                </div>

                <div class="ml-auto text-xs">
                  {new Date(commit.commit.author?.date || "").toLocaleString()}
                </div>
              </div>

              <div class="text-xs font-medium">{commit.commit.message}</div>
            </div>
            
            {#if commit.files}
            {#each commit.files as file, index}
              <div class="line-clamp-2 text-xs text-muted-foreground">
                {index}: {file.filename}
              </div>
            {/each}
            {/if}

            <div class="flex items-center gap-2">
              {#if index === 0}
                <Badge variant="default">Latest</Badge>
              {/if}
              
              <!-- {#if commit.force?}
                <Badge variant="destructive">Force</Badge>
              {/if} --
                
              {#if commit.commit.verification?.verified}
                <Badge variant="positive">Signed</Badge>
              {/if}
            </div>
            <!-- {#if item.labels.length}
              <div class="flex items-center gap-2">
                {#each item.labels as label}
                  <Badge variant={get_badge_variant_from_label(label)}>
                    {label}
                  </Badge>
                {/each}
              </div>
            {/if} --
          </a>
        {/each}
      </Card.Content>
    </Card.Root> -->

    <!-- <div class="break-words overflow-x-hidden grid-full">{JSON.stringify(data, null, 2)}</div> -->
  {:else}
    <div>404</div>
  {/if}
  {:catch err}
    <ErrorComponent {err} />
  {/await}
</main>
