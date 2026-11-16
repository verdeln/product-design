<template>
  <UApp>
    <div class="site-frame">
      <header class="site-header">
        <NuxtLink to="/" class="brand" aria-label="Verdlen home"><span class="brand-mark">V</span><span>Verdlen</span></NuxtLink>
        <nav class="nav-links" aria-label="Primary">
          <NuxtLink to="/help/getting-started">Help</NuxtLink>
          <NuxtLink to="/docs/editor-sdk">Developers</NuxtLink>
          <NuxtLink to="/templates">Templates</NuxtLink>
          <NuxtLink to="/search">Search</NuxtLink>
        </nav>
        <UButton to="/help/getting-started" size="sm" color="neutral" variant="outline">Explore</UButton>
      </header>
      <NuxtPage />
      <footer class="site-footer">
        <span>Verdlen website stack PoC · synthetic content</span>
        <span><a href="/robots.txt">robots</a> · <a href="/sitemap.xml">sitemap</a></span>
      </footer>
    </div>
  </UApp>
</template>
