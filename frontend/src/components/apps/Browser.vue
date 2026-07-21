<template>
  <div class="browser-app">
    <!-- Browser Toolbar -->
    <div class="browser-toolbar">
      <div class="browser-controls">
        <button class="nav-btn" @click="goBack" title="Atrás"><v-icon icon="mdi-arrow-left" size="14"/></button>
        <button class="nav-btn" @click="reload" title="Recargar"><v-icon icon="mdi-refresh" size="14"/></button>
      </div>
      <div class="browser-url-bar">
        <v-icon icon="mdi-lock" size="12" class="url-lock" />
        <span class="url-text">{{ currentUrl }}</span>
      </div>
      <a :href="currentUrl" target="_blank" class="nav-btn open-btn" title="Abrir en nueva pestaña">
        <v-icon icon="mdi-open-in-new" size="14" />
      </a>
    </div>

    <!-- Quick Links Bar -->
    <div class="browser-bookmarks">
      <a
        v-for="bm in bookmarks"
        :key="bm.id"
        class="bookmark"
        :id="`bm-${bm.id}`"
        @click.prevent="navigate(bm.url)"
        :href="bm.url"
      >
        <v-icon :icon="bm.icon" size="12" />
        {{ bm.label }}
      </a>
    </div>

    <!-- iframe -->
    <div class="browser-frame-wrap">
      <div v-if="loading" class="browser-loading">
        <div class="loading-bar" />
        <v-icon icon="mdi-web" size="32" class="loading-icon" />
        <span>Cargando {{ currentUrl }}...</span>
      </div>
      <iframe
        ref="iframeEl"
        :src="currentUrl"
        class="browser-iframe"
        :class="{ hidden: loading }"
        @load="loading = false"
        @error="loading = false"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="Browser"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const iframeEl = ref(null)
const loading = ref(true)
const currentUrl = ref('https://mi-portafolio-kaw6p2b1o-jcar2.vercel.app/')

const bookmarks = [
  { id:'portfolio', label:'Portafolio',  icon:'mdi-web',    url:'https://mi-portafolio-kaw6p2b1o-jcar2.vercel.app/' },
  { id:'github',    label:'GitHub',      icon:'mdi-github', url:'https://github.com/jcar2' },
  { id:'linkedin',  label:'LinkedIn',    icon:'mdi-linkedin',url:'https://linkedin.com' },
]

function navigate(url) {
  loading.value = true
  currentUrl.value = url
}

function goBack() {
  if (iframeEl.value?.contentWindow) {
    try { iframeEl.value.contentWindow.history.back() } catch (e) {}
  }
}

function reload() {
  loading.value = true
  if (iframeEl.value) iframeEl.value.src = currentUrl.value
}
</script>

<style scoped>
.browser-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #020c14;
}

.browser-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--os-surface);
  border-bottom: 1px solid var(--os-border);
  flex-shrink: 0;
}

.browser-controls { display: flex; gap: 4px; }

.nav-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--os-border);
  border-radius: 3px;
  color: var(--text-secondary);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.12s;
}

.nav-btn:hover { border-color: var(--cyan-dim); color: var(--cyan); }

.open-btn { color: var(--cyan-dim); }

.browser-url-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  background: var(--os-bg);
  border: 1px solid var(--os-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
}

.url-lock { color: var(--green); }
.url-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.browser-bookmarks {
  display: flex;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid var(--os-border);
  flex-shrink: 0;
}

.bookmark {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 3px;
  color: var(--text-secondary);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.12s;
}

.bookmark:hover { background: rgba(0,245,255,0.07); color: var(--cyan); }

.browser-frame-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.browser-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--os-bg2);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 12px;
  z-index: 1;
}

.loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--cyan);
  box-shadow: var(--glow-cyan);
  animation: loadingBar 1.5s ease-in-out infinite;
}

@keyframes loadingBar {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

.loading-icon { color: var(--cyan); animation: loadingPulse 1.5s ease-in-out infinite; }
@keyframes loadingPulse { 0%,100%{ opacity:0.4; } 50%{ opacity:1; } }

.browser-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.browser-iframe.hidden { opacity: 0; }
</style>
