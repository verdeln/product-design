<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)
const { data: item } = await useAsyncData(`template:${slug}`, () => queryCollection('templates').where('slug', '=', slug).first())
if (!item.value) throw createError({ statusCode: 404, statusMessage: 'Template not found' })
useSeoMeta({ title: () => item.value?.title ?? 'Template', description: () => item.value?.description ?? '' })
useHead({ link: [{ rel: 'canonical', href: `https://verdeln.example/templates/${slug}` }] })
</script>

<template><main class="container article" v-if="item"><article class="article-body"><p class="eyebrow">{{ item.category }} · {{ item.status }}</p><h1>{{ item.title }}</h1><p class="lede">{{ item.description }}</p><h2>Required capabilities</h2><p><span v-for="cap in item.capabilities" :key="cap" class="tag">{{ cap }}</span></p><h2>PoC boundary</h2><p>This page is generated from public structured content. It does not expose an installable template graph, purchase grant or execution approval.</p></article><aside class="article-aside"><b>Listing</b><p>Public metadata only</p><NuxtLink to="/templates">← All templates</NuxtLink></aside></main></template>
