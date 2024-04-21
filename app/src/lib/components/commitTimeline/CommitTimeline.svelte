<script lang="ts">
  import type { getCommits } from "$lib/api/repo";

  import * as Avatar from "$lib/components/ui/avatar";
  import { Badge } from "$lib/components/ui/badge/index";

  import { Ref, type CollectionFileRef } from "$lib/utils/ref";
  import { formatTime } from "$lib/utils/time";

  export let commits: Awaited<ReturnType<typeof getCommits>>
  export let ref: CollectionFileRef | Record<string, any>

  function genRef(sha: string): string {
    return new Ref({ ...ref, sha }).toString()
  }
</script>

<ol class="timeline selectable mx-3 mt-4">
  {#each commits as commit,index}
  <a href="#/content/commit/{genRef(commit.sha)}">
      <li>
        <div class="header">
          <!-- <div class="dot" /> -->
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
</ol>

<style lang="postcss">
  ol.timeline {
    @apply border-s border-muted;

    & li:last-child {
      @apply pb-1;
    }
    & li:first-child {
      @apply pt-3;
    }

    & li {
      & .header {
        @apply flex gap-3 items-center pt-3;

        & > .dot {
          @apply -ms-[10px] /* h-[9px] w-[9px] */ rounded-full bg-muted;
        }

        & > p {
          @apply text-sm text-muted-foreground;
        }
      }

      & > p {
        @apply ml-6 mt-1.5 /* last:pb-6 last:mt-2 */;
      }
    }
  }

  ol.timeline.selectable:hover {
    & > a {
      @apply rounded;
    }

    & > a:not(:hover) {
      @apply text-muted-foreground;

      & .header > p {
        @apply text-muted;
      }
      
      & > li > p > span {
        @apply opacity-50;
      }
    }
  }
</style>