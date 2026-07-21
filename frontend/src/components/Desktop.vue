<template>
  <div class="desktop" @dblclick.self="onDesktopDblClick">
    <!-- Animated background grid -->
    <div class="desktop-grid" aria-hidden="true" />

    <!-- Desktop Icons -->
    <div class="desktop-icons">
      <button
        v-for="app in desktopApps"
        :key="app.id"
        class="desktop-icon"
        :class="{ 'is-active': selectedIcon === app.id }"
        @click="selectedIcon = app.id"
        @dblclick.stop="openApp(app)"
        :title="app.name"
        :id="`desktop-icon-${app.id}`"
      >
        <div class="icon-img">
          <v-icon :icon="app.icon" size="36" />
        </div>
        <span class="icon-label">{{ app.name }}</span>
      </button>
    </div>

    <!-- System Info Corner -->
    <div class="sys-info" aria-label="System information">
      <div class="sys-line">
        <span class="sys-label">SYS</span>
        <span class="sys-val glow-cyan">JCARLOS_OS v1.0</span>
      </div>
      <div class="sys-line">
        <span class="sys-label">USER</span>
        <span class="sys-val">juan.carlos.alvarado</span>
      </div>
      <div class="sys-line">
        <span class="sys-label">NET</span>
        <span class="sys-val glow-green">CONNECTED</span>
      </div>
    </div>

    <!-- App Windows (rendered here, teleported to body) -->
    <OsWindow v-for="win in windowStore.windows" :key="win.id" :appId="win.id">
      <component :is="appComponent(win.id)" />
    </OsWindow>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import OsWindow from './OsWindow.vue'
import { useWindowsStore } from '../stores/windows.js'

const windowStore = useWindowsStore()
const selectedIcon = ref(null)

const desktopApps = [
  { id: 'terminal',     name: 'Terminal',     icon: 'mdi-console' },
  { id: 'projects',     name: 'Proyectos',    icon: 'mdi-folder-network' },
  { id: 'certificates', name: 'Certificados', icon: 'mdi-certificate' },
  { id: 'aboutme',      name: 'About Me',     icon: 'mdi-account-circle' },
  { id: 'portfolio',    name: 'Portafolio',   icon: 'mdi-web' },
  { id: 'github',       name: 'GitHub',       icon: 'mdi-github' },
]

const appComponents = {
  terminal:     defineAsyncComponent(() => import('./apps/Terminal.vue')),
  projects:     defineAsyncComponent(() => import('./apps/Projects.vue')),
  certificates: defineAsyncComponent(() => import('./apps/Certificates.vue')),
  aboutme:      defineAsyncComponent(() => import('./apps/AboutMe.vue')),
  portfolio:    defineAsyncComponent(() => import('./apps/Browser.vue')),
  github:       defineAsyncComponent(() => import('./apps/Browser.vue')),
}

function appComponent(id) {
  return appComponents[id] || null
}

function openApp(app) {
  if (app.id === 'portfolio') {
    windowStore.open(app.id, 'Portafolio — JC', app.icon)
    // Pass URL via global event / store if needed
  } else if (app.id === 'github') {
    windowStore.open(app.id, 'GitHub — jcar2', app.icon)
  } else {
    const labels = {
      terminal: 'Terminal',
      projects: 'Explorador de Proyectos',
      certificates: 'Certificados',
      aboutme: 'About Me',
    }
    windowStore.open(app.id, labels[app.id] || app.name, app.icon)
  }
}

function onDesktopDblClick() {
  selectedIcon.value = null
}
</script>

<style scoped>
.desktop {
  position: relative;
  width: 100vw;
  height: calc(100vh - var(--taskbar-height));
  background:
    radial-gradient(ellipse 80% 60% at 20% 80%, rgba(0, 100, 200, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(123, 47, 255, 0.07) 0%, transparent 60%),
    var(--os-bg);
  overflow: hidden;
}

/* Animated grid lines */
.desktop-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 200, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridPulse 8s ease-in-out infinite alternate;
}

@keyframes gridPulse {
  0% { opacity: 0.6; }
  100% { opacity: 1; }
}

/* Desktop Icons */
.desktop-icons {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 78px;
  padding: 8px 4px;
  border: 1px solid transparent;
  border-radius: var(--radius);
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.desktop-icon:hover {
  background: rgba(0, 245, 255, 0.06);
  border-color: rgba(0, 245, 255, 0.2);
}

.desktop-icon.is-active {
  background: rgba(0, 245, 255, 0.12);
  border-color: var(--cyan);
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.15);
}

.icon-img {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0,245,255,0.08), rgba(123,47,255,0.08));
  border: 1px solid rgba(0, 245, 255, 0.15);
  border-radius: 8px;
  color: var(--cyan);
  transition: all 0.2s;
}

.desktop-icon:hover .icon-img {
  color: var(--cyan);
  box-shadow: var(--glow-cyan);
  border-color: var(--cyan);
}

.icon-label {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.2;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}

/* System Info */
.sys-info {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0.7;
}

.sys-line {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.sys-label {
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.sys-val { color: var(--text-secondary); }
.sys-val.glow-cyan { color: var(--cyan); text-shadow: var(--glow-cyan); }
.sys-val.glow-green { color: var(--green); text-shadow: var(--glow-green); }
</style>
