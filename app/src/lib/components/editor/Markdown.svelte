<script lang="ts">
  import MarkdownIt from 'markdown-it'
  import hljs from 'highlight.js'
  import type { Writable } from "svelte/store";
  // import { HtmlRenderer, Parser } from "commonmark";

  export let Content: Writable<string>

  // const parser = new Parser()
  // const htmlRenderer = new HtmlRenderer()

  const markdownIt = new MarkdownIt({
    "html": true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }

      return '';
    }
  })
</script>

<!-- {@html htmlRenderer.render(parser.parse($Content))} -->

{@html markdownIt.render($Content, {})}
