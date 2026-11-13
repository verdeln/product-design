<script setup lang="ts">
const { data: templates } = await useAsyncData('templates', () => queryCollection('templates').all())
useSeoMeta({ title: 'Templates', description: 'Public Verdlen template listings for the website stack PoC.' })
useHead({ link: [{ rel: 'canonical', href: 'https://verdeln.example/templates' }] })
</script>

<template><main><header class="container catalog-head"><p class="eyebrow">Public catalog projection</p><h1>Templates for repeatable work.</h1><p class="lede">Listing metadata is public. Protected template graphs and acquisition rights remain product/Cloud concerns.</p></header><section class="container template-grid"><NuxtLink v-for="item in templates || []" :key="item.slug" class="template-card" :to="`/templates/${item.slug}`"><span class="eyebrow">{{ item.category }}</span><h2>{{ item.title }}</h2><p>{{ item.description }}</p><span v-for="cap in item.capabilities" :key="cap" class="tag">{{ cap }}</span></NuxtLink></section></main></template>
