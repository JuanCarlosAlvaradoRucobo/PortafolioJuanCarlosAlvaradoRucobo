<template>
  <Teleport to="body">
    <div
      v-if="win && !win.minimized"
      class="os-window"
      :class="{ 'is-active': isActive, 'is-maximized': win.maximized }"
      :style="windowStyle"
      @mousedown="onWindowMousedown"
    >
      <!-- Title Bar -->
      <div
        class="os-titlebar"
        :class="{ 'is-active': isActive }"
        @mousedown.self="startDrag"
        @dblclick="toggleMaximize"
      >
        <div class="os-titlebar-left">
          <v-icon :icon="win.icon" size="14" class="title-icon" />
          <span class="title-text">{{ win.name }}</span>
        </div>
        <div class="os-titlebar-controls">
          <button class="ctrl-btn ctrl-min" title="Minimizar" @click.stop="minimize">
            <v-icon icon="mdi-minus" size="12" />
          </button>
          <button class="ctrl-btn ctrl-max" title="Maximizar" @click.stop="toggleMaximize">
            <v-icon :icon="win.maximized ? 'mdi-window-restore' : 'mdi-window-maximize'" size="12" />
          </button>
          <button class="ctrl-btn ctrl-close" title="Cerrar" @click.stop="close">
            <v-icon icon="mdi-close" size="12" />
          </button>
        </div>
      </div>

      <!-- Window Content -->
      <div class="os-window-body">
        <slot />
      </div>

      <!-- Resize Handle -->
      <div v-if="!win.maximized" class="os-resize-handle" @mousedown.stop="startResize" />
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useWindowsStore } from '../stores/windows.js'

const props = defineProps({ appId: String })
const store = useWindowsStore()

const win = computed(() => store.windows.find(w => w.id === props.appId))
const isActive = computed(() => store.activeWindowId === props.appId)

const windowStyle = computed(() => {
  if (!win.value) return {}
  if (win.value.maximized) {
    return { zIndex: win.value.zIndex, top: '0', left: '0', width: '100vw', height: `calc(100vh - 44px)` }
  }
  return {
    zIndex: win.value.zIndex,
    top: `${win.value.y}px`,
    left: `${win.value.x}px`,
    width: `${win.value.width}px`,
    height: `${win.value.height}px`,
  }
})

function onWindowMousedown() {
  store.bringToFront(props.appId)
}
function close() { store.close(props.appId) }
function minimize() { store.minimize(props.appId) }
function toggleMaximize() { store.toggleMaximize(props.appId) }

// ── Drag ────────────────────────────────────────────────────────────────────
const dragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const winStartX = ref(0)
const winStartY = ref(0)

function startDrag(e) {
  if (win.value?.maximized) return
  dragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  winStartX.value = win.value.x
  winStartY.value = win.value.y

  const onMove = (e2) => {
    if (!dragging.value) return
    store.updatePos(
      props.appId,
      winStartX.value + e2.clientX - dragStartX.value,
      winStartY.value + e2.clientY - dragStartY.value
    )
  }
  const onUp = () => {
    dragging.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

// ── Resize ───────────────────────────────────────────────────────────────────
function startResize(e) {
  e.preventDefault()
  const startW = win.value.width
  const startH = win.value.height
  const startX = e.clientX
  const startY = e.clientY

  const onMove = (e2) => {
    const w = store.windows.find(w => w.id === props.appId)
    if (w) {
      w.width = Math.max(400, startW + e2.clientX - startX)
      w.height = Math.max(300, startH + e2.clientY - startY)
    }
  }
  const onUp = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
.os-window {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: var(--os-surface);
  border: 1px solid var(--os-border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-window);
  transition: box-shadow 0.2s;
  min-width: 400px;
  min-height: 300px;
}

.os-window.is-active {
  border-color: var(--cyan-dim);
  box-shadow: 0 0 0 1px var(--cyan-dim), var(--shadow-window);
}

/* Title Bar */
.os-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--title-bar-height);
  padding: 0 6px 0 10px;
  background: linear-gradient(90deg, #091e35 0%, #041628 100%);
  border-bottom: 1px solid var(--os-border);
  cursor: move;
  flex-shrink: 0;
  user-select: none;
}

.os-titlebar.is-active {
  background: linear-gradient(90deg, #0a3050 0%, #061d38 50%, #0a2545 100%);
  border-bottom-color: var(--cyan-dim);
}

.os-titlebar-left {
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}

.title-icon { color: var(--cyan); opacity: 0.9; }

.title-text {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.os-titlebar.is-active .title-text {
  color: var(--cyan);
  text-shadow: var(--glow-cyan);
}

/* Control Buttons */
.os-titlebar-controls {
  display: flex;
  gap: 4px;
}

.ctrl-btn {
  width: 20px;
  height: 20px;
  border: 1px solid;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  transition: all 0.15s;
}

.ctrl-min { border-color: #00a8cc44; color: var(--cyan-dim); }
.ctrl-min:hover { background: var(--cyan); border-color: var(--cyan); color: var(--os-bg); }

.ctrl-max { border-color: #7b2fff44; color: var(--violet-dim); }
.ctrl-max:hover { background: var(--violet); border-color: var(--violet); color: #fff; }

.ctrl-close { border-color: #ff336644; color: var(--red-dim); }
.ctrl-close:hover { background: var(--red); border-color: var(--red); color: #fff; box-shadow: var(--glow-red); }

/* Window Body */
.os-window-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Resize handle */
.os-resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 14px;
  height: 14px;
  cursor: se-resize;
  background: linear-gradient(135deg, transparent 50%, var(--os-border) 50%);
  border-radius: 0 0 4px 0;
}

/* Maximized */
.os-window.is-maximized {
  border-radius: 0;
  border-left: none;
  border-right: none;
}
</style>
