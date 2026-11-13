<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(`help-zh:${route.path}`, () => queryCollection('helpZh').path(route.path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: '未找到帮助文章' })
useSeoMeta({ title: () => page.value?.title ?? '帮助', description: () => page.value?.description ?? '' })
useHead({ htmlAttrs: { lang: 'zh-CN' }, link: [
  { rel: 'canonical', href: `https://verdeln.example${route.path}` },
  { rel: 'alternate', hreflang: 'en', href: 'https://verdeln.example/help/getting-started' },
  { rel: 'alternate', hreflang: 'zh-CN', href: 'https://verdeln.example/zh-cn/help/getting-started' }
] })
</script>

<template><main class="container article"><article class="article-body"><ContentRenderer v-if="page" :value="page" /></article><aside class="article-aside"><b>帮助</b><p>本地数据<br/>同步选择<br/>导出与恢复</p><NuxtLink to="/help/getting-started">English →</NuxtLink></aside></main></template>
