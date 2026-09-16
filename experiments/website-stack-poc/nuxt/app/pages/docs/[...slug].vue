<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(`docs:${route.path}`, () => queryCollection('docs').path(route.path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Developer document not found' })
useSeoMeta({ title: () => page.value?.title ?? 'Developer Docs', description: () => page.value?.description ?? '' })
useHead({ link: [{ rel: 'canonical', href: `https://verdeln.example${route.path}` }] })
</script>

<template><main class="container article"><article class="article-body"><p class="eyebrow">Developer documentation</p><ContentRenderer v-if="page" :value="page" /></article><aside class="article-aside"><b>SDK</b><p>Editor<br/>Host bridge<br/>Extensions<br/>Artifacts</p><NuxtLink to="/search?q=editor">Search docs →</NuxtLink></aside></main></template>
