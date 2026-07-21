<template>
  <div class="project-card" :class="`status-${project.status}`" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <!-- Status Bar -->
    <div class="card-statusbar">
      <span class="status-indicator" :class="project.status">
        <span class="status-dot" />
        {{ statusLabel }}
      </span>
      <span class="card-type">{{ project.type }}</span>
    </div>

    <!-- Card Header -->
    <div class="card-header">
      <div class="card-icon">
        <v-icon :icon="typeIcon" size="22" />
      </div>
      <div class="card-title-block">
        <h3 class="card-title">{{ project.name }}</h3>
        <span class="card-version">{{ project.version }}</span>
      </div>
    </div>

    <!-- Description -->
    <p class="card-desc">{{ project.description }}</p>

    <!-- Tech Stack -->
    <div class="card-tech">
      <span v-for="t in project.tech" :key="t" class="tech-tag">{{ t }}</span>
    </div>

    <!-- Stats Row -->
    <div class="card-stats" v-if="project.status === 'live'">
      <div class="stat">
        <v-icon icon="mdi-check-circle" size="12" />
        Uptime: <strong>{{ project.uptime }}</strong>
      </div>
      <div class="stat">
        <v-icon icon="mdi-calendar" size="12" />
        {{ project.last_deploy }}
      </div>
    </div>
    <div class="card-stats" v-else>
      <div class="stat">
        <v-icon icon="mdi-calendar" size="12" />
        Último deploy: {{ project.last_deploy }}
      </div>
    </div>

    <!-- Actions -->
    <div class="card-actions">
      <a
        v-if="project.url"
        :href="project.url"
        target="_blank"
        class="card-btn primary"
        :id="`proj-visit-${project.id}`"
      >
        <v-icon icon="mdi-open-in-new" size="13" />
        Visitar
      </a>
      <a
        v-if="project.github"
        :href="project.github"
        target="_blank"
        class="card-btn secondary"
        :id="`proj-gh-${project.id}`"
      >
        <v-icon icon="mdi-github" size="13" />
        GitHub
      </a>
      <span v-if="!project.url && !project.github" class="no-link">
        <v-icon icon="mdi-link-off" size="11" /> Sin enlace público
      </span>
    </div>

    <!-- Glow overlay on hover -->
    <div class="card-glow" :class="{ active: hovered }" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ project: Object })
const hovered = ref(false)

const statusLabel = computed(() => {
  return { live: '● LIVE', maintenance: '◐ MANTENIMIENTO', inactive: '○ DADO DE BAJA' }[props.project.status]
})

const typeIcon = computed(() => {
  return {
    API: 'mdi-api',
    Service: 'mdi-server',
    Project: 'mdi-code-braces',
    Tool: 'mdi-wrench',
  }[props.project.type] || 'mdi-folder'
})
</script>

<style scoped>
.project-card {
  position: relative;
  background: var(--os-surface);
  border: 1px solid var(--os-border);
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s;
  overflow: hidden;
}

.project-card.status-live { border-color: rgba(0,255,159,0.2); }
.project-card.status-maintenance { border-color: rgba(255,215,0,0.15); }
.project-card.status-inactive { border-color: rgba(255,51,102,0.1); opacity: 0.75; }

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
}

.project-card.status-live:hover { border-color: var(--green); box-shadow: 0 0 20px rgba(0,255,159,0.1); }
.project-card.status-maintenance:hover { border-color: var(--yellow); }
.project-card.status-inactive:hover { border-color: var(--red); opacity: 1; }

/* Status Bar */
.card-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.status-indicator.live { color: var(--green); }
.status-indicator.maintenance { color: var(--yellow); }
.status-indicator.inactive { color: var(--red); }

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.status-indicator.live .status-dot {
  animation: pulse 2s infinite;
  box-shadow: 0 0 6px currentColor;
}

@keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }

.card-type {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--os-border);
  border-radius: 3px;
  padding: 1px 7px;
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.1em;
}

/* Header */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(0,245,255,0.1), rgba(123,47,255,0.1));
  border: 1px solid rgba(0,245,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cyan);
  flex-shrink: 0;
}

.status-inactive .card-icon { color: var(--text-muted); }

.card-title-block { display: flex; flex-direction: column; gap: 2px; }

.card-title {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.status-live .card-title { color: var(--cyan); }

.card-version {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

/* Description */
.card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
}

/* Tech */
.card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tech-tag {
  padding: 2px 7px;
  background: rgba(0,245,255,0.06);
  border: 1px solid rgba(0,245,255,0.12);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--cyan-dim);
}

/* Stats */
.card-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

.stat strong { color: var(--green); }

/* Actions */
.card-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.card-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.05em;
}

.card-btn.primary { border-color: var(--green); color: var(--green); }
.card-btn.primary:hover { background: var(--green); color: var(--os-bg); box-shadow: var(--glow-green); }

.card-btn.secondary { border-color: var(--os-border); color: var(--text-secondary); }
.card-btn.secondary:hover { border-color: var(--cyan-dim); color: var(--cyan); }

.no-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

/* Glow */
.card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: var(--radius-lg);
  opacity: 0;
  transition: opacity 0.3s;
}

.status-live .card-glow.active {
  opacity: 1;
  background: radial-gradient(ellipse at top right, rgba(0,255,159,0.04) 0%, transparent 60%);
}
</style>
