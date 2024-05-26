<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import ErrorComponent from '$lib/components/error/ErrorComponent.svelte';

  export let err: any;

  console.error(err)
</script>

<ModeWatcher />

<main class="container">
  <section class="grid-full">
    <ErrorComponent {err} />
  </section>
</main>
