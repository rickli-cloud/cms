<script lang="ts">
  import { writable } from "svelte/store";
  import Pencil from "svelte-radix/Pencil1.svelte"
  import Trash from "svelte-radix/Trash.svelte"
 
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Card from "$lib/components/ui/card"
  import { Badge } from "$lib/components/ui/badge/index";
  
  import Header from "$lib/components/site/Header.svelte";
  import Loading from "$lib/components/site/Loading.svelte";
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte";
  import { getCommits, getContent } from "$lib/api/repo";
  import { Ref, type CollectionFileRef, collectionFileRef } from "$lib/utils/ref";

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
    <Card.Root class="md:col-span-9">
      <Card.Header>
        <Card.Title>{data.file.name}</Card.Title>
        <Card.Description>{data.file.path}</Card.Description>
      </Card.Header>

      <!-- <Card.Content>
        ...
      </Card.Content> -->

      <!-- <Card.Footer>
        <p>Card Footer</p>
      </Card.Footer> -->
    </Card.Root>

    <Command.Root class="rounded-lg border shadow-md">
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

          <!-- <Command.Item>
            <Rocket class="mr-2 h-4 w-4" />
            <span>Launch</span>
          </Command.Item> -->
        </Command.Group>

        <!-- <Command.Separator />
        <Command.Group heading="Settings">
          <Command.Item>
            <Person class="mr-2 h-4 w-4" />
            <span>Profile</span>
            <Command.Shortcut>⌘P</Command.Shortcut>
          </Command.Item>
          <Command.Item>
            <EnvelopeClosed class="mr-2 h-4 w-4" />
            <span>Mail</span>
            <Command.Shortcut>⌘B</Command.Shortcut>
          </Command.Item>
          <Command.Item>
            <Gear class="mr-2 h-4 w-4" />
            <span>Settings</span>
            <Command.Shortcut>⌘S</Command.Shortcut>
          </Command.Item>
        </Command.Group> -->
      </Command.List>
    </Command.Root>

    <Card.Root class="md:col-span-8">
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
            <!-- on:click={() => $SelectedCommit = index} -->
            <div class="flex w-full flex-col gap-1">
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <a class="font-semibold hover:text-blue-600" href={commit.author?.html_url} target="_blank">
                    @{commit.author?.login}
                  </a>

                  <!-- {#if !item.read}
                    <span class="flex h-2 w-2 rounded-full bg-blue-600" />
                  {/if} -->
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
              {/if} -->
                
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
            {/if} -->
          </a>
        {/each}
      </Card.Content>
      <!-- <Card.Footer>
        <p>Card Footer</p>
      </Card.Footer> -->
    </Card.Root>

    <div class="break-words overflow-x-hidden md:col-span-10">{JSON.stringify(data, null, 2)}</div>
  {:else}
    <div>404</div>
  {/if}
  {:catch err}
    <ErrorComponent {err} />
  {/await}
</main>
