<script lang="ts">
  // import * as Card from "$lib/components/ui/card"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as Card from "$lib/components/ui/card"
  import Header from "$lib/components/site/Header.svelte"
  import Loading from "$lib/components/site/Loading.svelte";
  import ErrorComponent from "$lib/components/error/ErrorComponent.svelte";
  import CommitTimeline from "$lib/components/commitTimeline/CommitTimeline.svelte";
  // import ActivityGrid from "$lib/components/activityGrid/ActivityGrid.svelte";

  import { getCommits, getContributors } from "$lib/api/repo";

  async function init() {
    const [ contributors, commits ] = await Promise.all([
      await getContributors(),
      await getCommits()
    ])

    return {
      contributors,
      commits
    }
  }
</script>

<Header />

<main class="container">
  {#await init()}
    <Loading />
  {:then data}   
    <!-- <Card.Root class="md:col-span-8 overflow-hidden">
      <Card.Header>
        <Card.Title>Activity</Card.Title>
        <Card.Description>Recent changes displayed over time.</Card.Description>
      </Card.Header>

      <Card.Content>
        <ActivityGrid />
      </Card.Content>
    </Card.Root> -->

    {#if data.contributors}
      <section class="grid-full md:!grid-nav">
        {#each data.contributors as contributor}
          <div class="flex items-center space-x-2 first:mt-5 mt-3">
            <Avatar.Root class="rounded-sm">
              <Avatar.Image src={contributor.avatar_url} alt={contributor.login} />
              <Avatar.Fallback>{new RegExp("^[a-zA-Z0-9]{2}").exec(contributor.login || "")?.[0].toUpperCase()}</Avatar.Fallback>
            </Avatar.Root>

            <div>
              <a class="text-sm font-medium leading-none hover:text-blue-600" href={contributor.html_url}>@{contributor.login}</a>
              <p class="text-sm text-muted-foreground">Contributions: {contributor.contributions}</p>
            </div>
          </div>
        {/each}
      </section>

      <!-- <Card.Root class="grid-full md:!grid-nav">
        <Card.Header>
          <Card.Title>Contributors</Card.Title>
          <Card.Description>Anyone that published a change will show up here.</Card.Description>
        </Card.Header>

        <Card.Content class="grid gap-6">
          {#each data.contributors as contributor}
            <div class="flex items-center justify-between space-x-4">
              <div class="flex items-center space-x-4">
                <Avatar.Root>
                  <Avatar.Image src={contributor.avatar_url} alt={contributor.login} />
                  <Avatar.Fallback>{new RegExp("^[a-zA-Z0-9]{2}").exec(contributor.login || "")?.[0].toUpperCase()}</Avatar.Fallback>
                </Avatar.Root>
                <div>
                  <a class="text-sm font-medium leading-none hover:text-blue-600" href={contributor.html_url}>@{contributor.login}</a>
                  <p class="text-sm text-muted-foreground">Contributions: {contributor.contributions}</p>
                </div>
              </div>
            </div>
          {/each}
        </Card.Content>
      </Card.Root> -->
    {/if}

    {#if data.commits}
      <section class="grid-full md:!grid-content md:!row-span-12">
        <CommitTimeline ref={{}} commits={data.commits} />
      </section>
    {/if}

    <div></div>

  {:catch err}
    <section class="grid-full">
      <ErrorComponent {err} />
    </section>
  {/await}
</main>
