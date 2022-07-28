<h1 align="center">
  create-sweet-app
</h1>

<p align="center">
  Interactive CLI to quickly set up an opinionated, full-stack, typesafe SvelteKit project. Inspired by the <a href="https://init.tips">T3 Stack</a>
</p>

<p align="center">
  Create the SWeeT app by running <code>npx create-sweet-app</code>
</p>

## What is the SWeeT Stack?

The SWeeT Stack is a tech stack consisting of SvelteKit, WindiCSS and tRPC. You can think of it a T3 alternative built on SvelteKit.

## Getting Started

To create your SWeeT app, run the following command depending on your package manager and answer the prompts:

### npm

`npx create-sweet-app@latest`

### yarn

`yarn create sweet-app`

### pnpm

`pnpm create sweet-app`

## Why not Tailwind?

Since Tailwind introduced JIT mode, it would seem as though WindiCSS is not much more useful in comparison to Tailwind. While JIT mode makes hot reloading fast in Tailwind, Windi is better suited for use with Vite because of its custom-tailored Vite adapter. Also, Windi is backed by the Open-Source community and has a few interesting features that Tailwind lacks.

For a more in-depth comparison between Windi and Tailwind, see <a href="https://github.com/windicss/windicss/discussions/176">this GitHub discussion</a>.
