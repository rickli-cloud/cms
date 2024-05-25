# Astro plugin

![npm](https://img.shields.io/npm/v/%40lucarickli%2Fjamstack-cms-astro)
![size](https://img.shields.io/bundlejs/size/%40lucarickli%2Fjamstack-cms-astro)

Astro plugin to easily integrate jamstack-cms into your website.

## Install

```sh
npm i --save @lucarickli/jamstack-cms-astro
```

**File** `astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import { jamstackCmsPlugin } from "@lucarickli/jamstack-cms-astro";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    sitemap(),
    jamstackCmsPlugin({
      backend: {
        ...
      },
      collections: [
        ...
      ],
    }),
  ],
});
```

## Commands

### Dev

```sh
npm run dev
```

### Dev + debug

```sh
npm run dev:debug
```

### Build

```sh
npm run build
```

### Start

> This requires a build of the app!

```sh
npm run start
```

### Run checks

```sh
npm run check
```
