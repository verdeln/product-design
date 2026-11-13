<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(`help:${route.path}`, () => queryCollection('help').path(route.path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Help article not found' })
useSeoMeta({ title: () => page.value?.title ?? 'Help', description: () => page.value?.description ?? '' })
useHead({ link: [
  { rel: 'canonical', href: `https://verdeln.example${route.path}` },
  { rel: 'alternate', hreflang: 'en', href: 'https://verdeln.example/help/getting-started' },
  { rel: 'alternate', hreflang: 'zh-CN', href: 'https://verdeln.example/zh-cn/help/getting-started' }
] })
</script>

<template><main class="container article"><article class="article-body"><ContentRenderer v-if="page" :value="page" /></article><aside class="article-aside"><b>Help</b><p>Local storage<br/>Sync choices<br/>Export & recovery</p><NuxtLink to="/zh-cn/help/getting-started">简体中文 →</NuxtLink></aside></main></template>
