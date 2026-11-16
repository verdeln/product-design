<script setup lang="ts">
useSeoMeta({
  title: 'Local-first workspace for work that matters',
  description: 'Verdlen keeps personal work useful locally and adds collaboration deliberately.'
})
useHead({ link: [{ rel: 'canonical', href: 'https://verdeln.example/' }] })
</script>

<template>
  <main>
    <section class="container hero">
      <div>
        <p class="eyebrow">Local first · AI ready</p>
        <h1>Your work stays yours. Collaboration stays explicit.</h1>
        <p class="lede">Verdlen is a workspace for pages, structured collections and accountable AI workflows. Start on one device. Add cloud services when they create value.</p>
        <div class="hero-actions"><NuxtLink class="button primary" to="/help/getting-started">Read the local-first guide</NuxtLink><NuxtLink class="button" to="/templates">Browse templates</NuxtLink></div>
      </div>
      <div class="mock" aria-label="Synthetic Verdlen interface preview">
        <div class="mock-bar"><span class="dot"/><span class="dot"/><span class="dot"/></div>
        <div class="mock-body"><div class="mock-nav">Private<br/>Projects<br/>Teamspaces<br/>Library<br/>AI</div><div class="mock-content"><span class="eyebrow">Project brief</span><br/><b>Autumn launch</b><div class="mock-line accent"/><div class="mock-line"/><div class="mock-line short"/><div class="mock-line"/></div></div>
      </div>
    </section>
    <section class="container grid">
      <article class="card"><span class="eyebrow">01</span><h2>Local ownership</h2><p>Personal content remains useful without a cloud subscription. Sync is a separate product decision.</p></article>
      <article class="card"><span class="eyebrow">02</span><h2>Structured work</h2><p>Collections provide reusable views without turning presentation components into a second data authority.</p></article>
      <article class="card"><span class="eyebrow">03</span><h2>Accountable AI</h2><p>Tasks, runs, sources and effects remain distinguishable so automation can be reviewed and recovered.</p></article>
    </section>
  </main>
</template>
