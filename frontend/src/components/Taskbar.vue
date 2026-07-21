<template>
  <nav class="taskbar" role="navigation" aria-label="Taskbar">
    <!-- Start Button -->
    <button class="start-btn" @click="toggleStart" id="taskbar-start-btn">
      <v-icon icon="mdi-hexagon-multiple" size="18" class="start-icon" />
      <span class="start-label">JC OS</span>
    </button>

    <!-- Start Menu -->
    <Transition name="start-menu">
      <div v-if="startOpen" class="start-menu" @click.self="startOpen = false">
        <div class="start-menu-header">
          <div class="start-avatar">
            <v-icon icon="mdi-account-circle" size="40" />
          </div>
          <div>
            <div class="start-user">Juan Carlos</div>
            <div class="start-role">Ingeniero en Computación</div>
          </div>
        </div>
        <div class="start-menu-items">
          <button
            v-for="item in startMenuItems"
            :key="item.id"
            class="start-item"
            @click="launchFromStart(item)"
          >
            <v-icon :icon="item.icon" size="20" class="start-item-icon" />
            <span>{{ item.label }}</span>
            <v-icon icon="mdi-chevron-right" size="14" class="start-item-arrow" />
          </button>
        </div>
        <div class="start-menu-footer">
          <a href="mailto:rucoboalvarado@gmail.com" class="start-footer-btn" title="Correo">
            <v-icon icon="mdi-email" size="16" />
          </a>
          <a href="https://github.com/jcar2" target="_blank" class="start-footer-btn" title="GitHub">
            <v-icon icon="mdi-github" size="16" />
          </a>
          <a href="https://linkedin.com" target="_blank" class="start-footer-btn" title="LinkedIn">
            <v-icon icon="mdi-linkedin" size="16" />
          </a>
        </div>
      </div>
    </Transition>

    <!-- Open Windows -->
    <div class="taskbar-apps">
      <button
        v-for="win in windowStore.taskbarWindows"
        :key="win.id"
        class="taskbar-app"
        :class="{ 'is-active': !win.minimized && windowStore.activeWindowId === win.id }"
        @click="windowStore.toggleMinimize(win.id)"
        :id="`taskbar-app-${win.id}`"
      >
        <v-icon :icon="win.icon" size="14" />
        <span>{{ win.name }}</span>
      </button>
    </div>

    <!-- Tray: Clock + Net Status -->
    <div class="taskbar-tray">
      <div class="tray-item net-indicator">
        <span class="net-dot" />
        <span class="net-label">ONLINE</span>
      </div>
      <div class="tray-clock">
        <div class="clock-time">{{ currentTime }}</div>
        <div class="clock-date">{{ currentDate }}</div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowsStore } from '../stores/windows.js'

const windowStore = useWindowsStore()
const startOpen = ref(false)

// Clock
const currentTime = ref('')
const currentDate = ref('')
let timer = null

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  currentDate.value = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

onMounted(() => { updateClock(); timer = setInterval(updateClock, 1000) })
onUnmounted(() => clearInterval(timer))

function toggleStart() { startOpen.value = !startOpen.value }

const startMenuItems = [
  { id: 'terminal',     label: 'Terminal',             icon: 'mdi-console' },
  { id: 'projects',     label: 'Explorador de Proyectos', icon: 'mdi-folder-network' },
  { id: 'certificates', label: 'Certificados',          icon: 'mdi-certificate' },
  { id: 'aboutme',      label: 'About Me',              icon: 'mdi-account-circle' },
  { id: 'portfolio',    label: 'Portafolio Web',         icon: 'mdi-web' },
  { id: 'github',       label: 'GitHub Repos',           icon: 'mdi-github' },
]

const appNames = {
  terminal: 'Terminal',
  projects: 'Explorador de Proyectos',
  certificates: 'Certificados',
  aboutme: 'About Me',
  portfolio: 'Portafolio — JC',
  github: 'GitHub — jcar2',
}

const appIcons = {
  terminal: 'mdi-console',
  projects: 'mdi-folder-network',
  certificates: 'mdi-certificate',
  aboutme: 'mdi-account-circle',
  portfolio: 'mdi-web',
  github: 'mdi-github',
}

function launchFromStart(item) {
  startOpen.value = false
  windowStore.open(item.id, appNames[item.id] || item.label, appIcons[item.id] || item.icon)
}
</script>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--taskbar-height);
  background: linear-gradient(180deg, #071525 0%, #040e1a 100%);
  border-top: 1px solid var(--os-border);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px;
  z-index: 9990;
  box-shadow: 0 -2px 20px rgba(0, 245, 255, 0.06);
}

/* Start Button */
.start-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  background: linear-gradient(135deg, #0a3d5c 0%, #061d38 100%);
  border: 1px solid var(--cyan-dim);
  border-radius: 3px;
  cursor: pointer;
  color: var(--cyan);
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}

.start-btn:hover {
  background: linear-gradient(135deg, #0f5278 0%, #082540 100%);
  box-shadow: var(--glow-cyan);
}

.start-icon { color: var(--cyan); }
.start-label { text-shadow: var(--glow-cyan); }

/* Start Menu */
.start-menu {
  position: absolute;
  bottom: calc(var(--taskbar-height) + 4px);
  left: 6px;
  width: 280px;
  background: linear-gradient(180deg, #071a2e 0%, #040e1a 100%);
  border: 1px solid var(--cyan-dim);
  border-radius: var(--radius-lg);
  box-shadow: 0 -4px 30px rgba(0, 245, 255, 0.15), var(--shadow-window);
  overflow: hidden;
  z-index: 9999;
}

.start-menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(90deg, #0a3050 0%, #061d38 100%);
  border-bottom: 1px solid var(--os-border);
  color: var(--cyan);
}

.start-avatar { color: var(--cyan); opacity: 0.9; }
.start-user { font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--cyan); }
.start-role { font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary); margin-top: 2px; }

.start-menu-items { padding: 6px 0; }

.start-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: all 0.12s;
}

.start-item:hover {
  background: rgba(0, 245, 255, 0.08);
  color: var(--cyan);
}

.start-item:hover .start-item-icon { color: var(--cyan); }

.start-item-icon { color: var(--text-secondary); flex-shrink: 0; }
.start-item-arrow { margin-left: auto; color: var(--text-muted); }

.start-menu-footer {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  padding: 8px 12px;
  border-top: 1px solid var(--os-border);
  background: rgba(0,0,0,0.3);
}

.start-footer-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--os-border);
  border-radius: 4px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.15s;
}
.start-footer-btn:hover { border-color: var(--cyan); color: var(--cyan); background: rgba(0,245,255,0.08); }

/* Taskbar Apps */
.taskbar-apps {
  display: flex;
  gap: 3px;
  flex: 1;
  overflow: hidden;
  padding: 0 4px;
}

.taskbar-app {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid transparent;
  border-radius: 3px;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.12s;
}

.taskbar-app:hover {
  background: rgba(0, 245, 255, 0.06);
  border-color: rgba(0, 245, 255, 0.2);
  color: var(--text-primary);
}

.taskbar-app.is-active {
  background: rgba(0, 245, 255, 0.1);
  border-color: var(--cyan-dim);
  color: var(--cyan);
  border-bottom-color: var(--cyan);
  box-shadow: inset 0 -2px 0 var(--cyan);
}

/* Tray */
.taskbar-tray {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  border-left: 1px solid var(--os-border);
  flex-shrink: 0;
}

.tray-item { display: flex; align-items: center; gap: 4px; }

.net-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: var(--glow-green);
  animation: netPulse 2s infinite;
}

.net-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--green);
  letter-spacing: 0.1em;
}

@keyframes netPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.tray-clock {
  text-align: right;
  line-height: 1.2;
}

.clock-time {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--cyan);
  text-shadow: var(--glow-cyan);
  letter-spacing: 0.05em;
}

.clock-date {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
}

/* Start menu transitions */
.start-menu-enter-active, .start-menu-leave-active { transition: all 0.18s ease; }
.start-menu-enter-from { opacity: 0; transform: translateY(8px); }
.start-menu-leave-to { opacity: 0; transform: translateY(8px); }
</style>
