# Jamstack CMS

![workflow](https://img.shields.io/github/actions/workflow/status/rickli-cloud/jamstack-cms/app-check.yml)
![npm](https://img.shields.io/npm/v/%40lucarickli%2Fjamstack-cms)
![size](https://img.shields.io/bundlejs/size/%40lucarickli%2Fjamstack-cms)

## Install

```sh
npm install --save @lucarickli/jamstack-cms
```

> The main export can only be imported inside the browser! Use the export `@lucarickli/jamstack-cms/utils` for nodejs instead.

### Example

```ts
import Cms from "@lucarickli/jamstack-cms"

const cms = new Cms({
  target: document.getElementById("app"),
  props: {
    backend: {
      auth: (auth) => auth.prompt(auth.urlParameter()),
      git: {
        repo: "...",
        owner: "...",
      },
    },
    collections: [
      ...
    ]
  }
})
```

> For a working example see `index.html` or [@rickli-cloud/rickli-cloud/app/astro.config.mjs](https://github.com/rickli-cloud/rickli-cloud/blob/main/app/astro.config.mjs).

## Stack

- Svelte (**not** sveltekit!)
- Vite
- Tailwind + PostCss
- Shadcn
- Monaco Editor
- Json schema
- Zod (converted to json schema)
- Octokit

<!-- Svelte + vite single page application (SPA) -->

## Commands

### Development

```sh
npm run dev
```

### Check

```sh
npm run check
```

### Build

```sh
npm run build
```

#### Preview build

```sh
npm run preview
```
