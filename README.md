# computation-of-hours-worked

[![build](https://github.com/mubaidr/vite-vue3-chrome-extension-v3/actions/workflows/build.yml/badge.svg)](https://github.com/wyfer/computation-of-hours-worked)

工时计算（chrome、firefox 浏览器插件）

use [Vite](https://vitejs.dev/) for ([Chrome](https://developer.chrome.com/docs/extensions/reference/), [FireFox](https://addons.mozilla.org/en-US/developers/), etc.) starter template based on 

## Features

- Vue 3 - Composition API, `Script setup` and more!
- Vue 3 app in Content Script too (template added)
- Vue devtools support
- HMR for extension pages and content scripts, with Firefox support
- Sample `onInstall` & `onUpdate` pages
- [`Tailwind`](https://tailwindcss.com/) css And [`daisyUI`](https://daisyui.com/)
- Tailwindcss plugins for Typography, forms, prettier and daisy ui
- Vue Router setup incuding `unplugin-vue-router` for automatic route registration
- vscode recommended settings and extensions for chrome plugin development
- Effortless communications - powered by [`webext-bridge`](https://github.com/zikaari/webext-bridge)
- [Components auto importing](./src/components)
- [Icons](./src/components) - Access to icons from any iconset directly
  - By default [Material Design Icons](https://materialdesignicons.com/cdn/1.6.50-dev/) set is enabled
- [TypeScript](https://www.typescriptlang.org/) - type safe
- `Eslint` & `Prettier` configured for `vue`, `javascript`, `TypeScript`
- [CRXJS Vite Plugin](https://crxjs.dev/vite-plugin) Build a Chrome Extension with Vite
- Github build and release actions

_Please create an issue if you feel some feature is missing or could be improved._

## Pre-packed

### Vite Plugins

- [`unplugin-vue-router`](https://github.com/posva/unplugin-vue-router) - File system based route generator for Vite
- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Directly use `browser` and Vue Composition API without importing
- [`unplugin-vue-components`](https://github.com/antfu/vite-plugin-components) - components auto import
- [`unplugin-icons`](https://github.com/antfu/unplugin-icons) - icons as components
  - [Material Design Icons](https://icon-sets.iconify.design/mdi/) - Material Design Icons

### Vue Plugins

- [Pinia](https://pinia.vuejs.org/) - Intuitive, type safe, light and flexible Store for Vue
- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs

### Plugins

- [Marked](https://github.com/markedjs/marked) - A markdown parser and compiler. Used for CHANGELOG.md to show in Update page

### UI Frameworks

- [tailwindcss](https://tailwindcss.com) - A utility-first CSS framework
- [daisyUI](https://daisyui.com/) - The most popular component library for Tailwind CSS

Tailwind css `forms` and `typography` plugins are enabled for default styling of form controls.

### WebExtension Libraries

- [`webext-bridge`](https://github.com/zikaari/webext-bridge) - effortlessly communication between contexts

### Coding Style

- Use Composition API with [`<script setup>` SFC syntax](https://github.com/vuejs/rfcs/pull/227)
- Use Composition API with [`setup` SFC syntax](https://pinia.vuejs.org/cookbook/composables.html#Setup-Stores) in Pinia stores

## Usage

### Project Structure

- `src` - main source.
  - `content-script` - scripts and components to be injected as `content_script`
    - `iframe` content script iframe vue3 app which will be injected into page
  - `background` - scripts for background.
  - `popup` - popup vuejs application root
    - `pages` - popup pages
  - `options` - options vuejs application root
    - `pages` - options pages
  - `setup` - Page for Install and Update chrome extension events
    - `pages` - pages for install and update events
  - `offscreen` - Chrome extension offscreen pages, can be used for audio, screen recording
  - `pages` - application pages, common to all views (About, Contact, Authentication etc)
  - `components` - auto-imported Vue components that are shared in popup and options page.
  - `assets` - assets used in Vue components
- `dist` - built files
  - `chrome` - Chrome extension
  - `firefox` - Firefox extension

### Extra info

In [src/background/index.ts](./src/background/index.ts) you can find an example of chrome.runtime.onInstalled.addListener.

We add `?type` to the url to tell if it's update or install event. Then in [src/setup/pages/index.ts](./src/setup/pages/index.ts) we check for the `type` and show the appropriate page.

### Development

```bash
pnpm dev
```

Then **load extension in browser with the `dist/` folder**.

### Build

To build the extension, run

```bash
pnpm build
```

And then pack files under `dist/chrome` or `dist/firefox`, you can upload to appropriate extension store.

## Credits

This template is heavenly inspired by: https://github.com/antfu/vitesse-webext
