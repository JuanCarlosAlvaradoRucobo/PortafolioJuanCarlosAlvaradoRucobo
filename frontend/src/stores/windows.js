import { defineStore } from 'pinia'

let zCounter = 100

export const useWindowsStore = defineStore('windows', {
  state: () => ({
    windows: [],
    activeWindowId: null,
  }),
  actions: {
    open(appId, appName, appIcon) {
      const existing = this.windows.find(w => w.id === appId)
      if (existing) {
        existing.minimized = false
        this.bringToFront(appId)
        return
      }
      const offsets = this.windows.filter(w => !w.minimized).length
      this.windows.push({
        id: appId,
        name: appName,
        icon: appIcon,
        minimized: false,
        maximized: false,
        zIndex: ++zCounter,
        x: 80 + offsets * 24,
        y: 60 + offsets * 24,
        width: 860,
        height: 560,
      })
      this.activeWindowId = appId
    },
    close(appId) {
      this.windows = this.windows.filter(w => w.id !== appId)
      if (this.activeWindowId === appId) {
        this.activeWindowId = this.windows[this.windows.length - 1]?.id || null
      }
    },
    minimize(appId) {
      const w = this.windows.find(w => w.id === appId)
      if (w) w.minimized = true
      if (this.activeWindowId === appId) this.activeWindowId = null
    },
    toggleMinimize(appId) {
      const w = this.windows.find(w => w.id === appId)
      if (!w) return
      if (w.minimized) {
        w.minimized = false
        this.bringToFront(appId)
      } else {
        w.minimized = true
        if (this.activeWindowId === appId) this.activeWindowId = null
      }
    },
    toggleMaximize(appId) {
      const w = this.windows.find(w => w.id === appId)
      if (w) w.maximized = !w.maximized
    },
    bringToFront(appId) {
      const w = this.windows.find(w => w.id === appId)
      if (w) {
        w.zIndex = ++zCounter
        this.activeWindowId = appId
      }
    },
    updatePos(appId, x, y) {
      const w = this.windows.find(w => w.id === appId)
      if (w) { w.x = x; w.y = y }
    },
  },
  getters: {
    visibleWindows: (state) => state.windows.filter(w => !w.minimized),
    taskbarWindows: (state) => state.windows,
  },
})
