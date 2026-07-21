<template>
  <div class="projects-app">
    <!-- Header -->
    <div class="pa-header">
      <div class="pa-header-left">
        <v-icon icon="mdi-folder-network" size="20" class="header-icon" />
        <span class="header-title">Explorador de Proyectos</span>
      </div>
      <div class="pa-stats" v-if="store.stats">
        <div class="stat-chip live">
          <span class="stat-dot" />
          {{ store.stats.live }} Live
        </div>
        <div class="stat-chip maint">
          <span class="stat-dot" />
          {{ store.stats.maintenance }} Maint.
        </div>
        <div class="stat-chip baja">
          <span class="stat-dot" />
          {{ store.stats.inactive }} Baja
        </div>
      </div>
      <!-- Filter -->
      <div class="pa-filters">
        <button
          v-for="f in filters"
          :key="f.key"
          class="filter-btn"
          :class="{ 'is-active': activeFilter === f.key }"
          @click="activeFilter = f.key"
        >
          <v-icon :icon="f.icon" size="13" />
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="pa-loading">
      <v-progress-circular indeterminate color="primary" size="32" />
      <span>Conectando al sistema...</span>
    </div>

    <!-- Projects Grid -->
    <div v-else class="pa-grid-wrap">
      <!-- Section: Live -->
      <template v-if="activeFilter === 'all' || activeFilter === 'live'">
        <div class="section-header live">
          <span class="section-dot" />
          <span>SISTEMAS EN PRODUCCIÓN</span>
          <span class="section-count">{{ store.liveProjects.length }}</span>
        </div>
        <div class="pa-grid">
          <ProjectCard v-for="p in store.liveProjects" :key="p.id" :project="p" />
        </div>
      </template>

      <!-- Section: Maintenance -->
      <template v-if="activeFilter === 'all' || activeFilter === 'maintenance'">
        <div class="section-header maint">
          <span class="section-dot" />
          <span>EN MANTENIMIENTO</span>
          <span class="section-count">{{ store.maintenanceProjects.length }}</span>
        </div>
        <div class="pa-grid">
          <ProjectCard v-for="p in store.maintenanceProjects" :key="p.id" :project="p" />
        </div>
      </template>

      <!-- Section: Inactive -->
      <template v-if="activeFilter === 'all' || activeFilter === 'inactive'">
        <div class="section-header baja">
          <span class="section-dot" />
          <span>DADOS DE BAJA</span>
          <span class="section-count">{{ store.inactiveProjects.length }}</span>
        </div>
        <div class="pa-grid">
          <ProjectCard v-for="p in store.inactiveProjects" :key="p.id" :project="p" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '../../stores/projects.js'
import ProjectCard from '../ProjectCard.vue'

const store = useProjectsStore()
const activeFilter = ref('all')

const filters = [
  { key: 'all',         label: 'Todos',      icon: 'mdi-view-grid' },
  { key: 'live',        label: 'Live',        icon: 'mdi-circle' },
  { key: 'maintenance', label: 'Mantenimiento', icon: 'mdi-tools' },
  { key: 'inactive',    label: 'Baja',        icon: 'mdi-archive' },
]

onMounted(() => { if (!store.projects.length) store.fetchAll() })
</script>

<style scoped>
.projects-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--os-bg2);
}

.pa-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--os-border);
  background: var(--os-surface);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.pa-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon { color: var(--cyan); }
.header-title {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--cyan);
  letter-spacing: 0.08em;
}

.pa-stats {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
}

.stat-chip.live { border-color: var(--green); color: var(--green); background: rgba(0,255,159,0.07); }
.stat-chip.maint { border-color: var(--yellow); color: var(--yellow); background: rgba(255,215,0,0.07); }
.stat-chip.baja { border-color: var(--red); color: var(--red); background: rgba(255,51,102,0.07); }

.stat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.stat-chip.live .stat-dot { box-shadow: var(--glow-green); animation: netPulse 2s infinite; }

@keyframes netPulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }

.pa-filters {
  display: flex;
  gap: 4px;
  width: 100%;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border: 1px solid var(--os-border);
  border-radius: 3px;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.filter-btn:hover { border-color: var(--cyan-dim); color: var(--text-primary); }
.filter-btn.is-active { border-color: var(--cyan); color: var(--cyan); background: rgba(0,245,255,0.08); }

.pa-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.pa-grid-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  padding-bottom: 6px;
  border-bottom: 1px solid;
}

.section-header.live { color: var(--green); border-color: rgba(0,255,159,0.2); }
.section-header.maint { color: var(--yellow); border-color: rgba(255,215,0,0.2); }
.section-header.baja { color: var(--red); border-color: rgba(255,51,102,0.2); opacity: 0.7; }

.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.section-header.live .section-dot { box-shadow: var(--glow-green); }

.section-count {
  margin-left: auto;
  background: rgba(255,255,255,0.06);
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 10px;
}

.pa-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
</style>
