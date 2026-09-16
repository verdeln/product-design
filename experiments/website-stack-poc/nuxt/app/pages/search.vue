<script setup lang="ts">
const route = useRoute()
const { data: help } = await useAsyncData('search-help', () => queryCollectionSearchSections('help'))
const { data: docs } = await useAsyncData('search-docs', () => queryCollectionSearchSections('docs'))
const { data: helpZh } = await useAsyncData('search-help-zh', () => queryCollectionSearchSections('helpZh'))
const query = computed(() => String(route.query.q ?? '').trim().toLowerCase())
const all = computed(() => [...(help.value ?? []), ...(docs.value ?? []), ...(helpZh.value ?? [])])
const results = computed(() => {
  if (!query.value) return all.value.slice(0, 12)
  return all.value.filter((item) => `${item.title ?? ''} ${item.content ?? ''}`.toLowerCase().includes(query.value)).slice(0, 20)
})
useSeoMeta({ title: 'Search', robots: 'noindex,follow', description: 'Search the public Verdlen PoC content corpus.' })
</script>

<template><main><header class="container catalog-head"><p class="eyebrow">Content search</p><h1>Find public guidance.</h1><form action="/search" method="get"><input class="search-box" name="q" :value="String(route.query.q ?? '')" placeholder="Search local-first, editor, sync…" /></form></header><section class="container" style="padding-bottom:90px"><a v-for="item in results" :key="item.id" class="result" :href="item.id"><strong>{{ item.title }}</strong><p>{{ item.content?.slice(0, 180) }}</p></a><p v-if="results.length === 0" class="lede">No matching public content.</p></section></main></template>
