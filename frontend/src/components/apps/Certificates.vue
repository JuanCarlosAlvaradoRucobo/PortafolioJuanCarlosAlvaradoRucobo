<template>
  <div class="certs-app">
    <!-- Header -->
    <div class="certs-header">
      <v-icon icon="mdi-certificate" size="20" class="header-icon" />
      <span class="header-title">Certificaciones &amp; Credenciales</span>
      <span class="cert-count">{{ store.certificates.length }} certificados</span>
    </div>

    <!-- Category Filter -->
    <div class="cert-filters">
      <button
        v-for="cat in categories"
        :key="cat"
        class="cat-btn"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >{{ cat }}</button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="certs-loading">
      <v-progress-circular indeterminate color="primary" size="28" />
    </div>

    <!-- Certs Grid -->
    <div v-else class="certs-grid">
      <div
        v-for="cert in filteredCerts"
        :key="cert.id"
        class="cert-card"
        :id="`cert-card-${cert.id}`"
      >
        <div class="cert-icon">
          <v-icon :icon="categoryIcon(cert.category)" size="28" />
        </div>
        <div class="cert-info">
          <div class="cert-category-badge">{{ cert.category }}</div>
          <h3 class="cert-name">{{ cert.name }}</h3>
          <p class="cert-issuer">{{ cert.issuer }}</p>
          <div class="cert-meta">
            <span class="cert-date">
              <v-icon icon="mdi-calendar-check" size="12" />
              {{ cert.date }}
            </span>
            <span v-if="cert.credential_id" class="cert-id">
              ID: {{ cert.credential_id }}
            </span>
          </div>
        </div>
        <a
          v-if="cert.url"
          :href="cert.url"
          target="_blank"
          class="cert-verify-btn"
          :id="`cert-verify-${cert.id}`"
        >
          <v-icon icon="mdi-shield-check" size="14" />
          Verificar
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '../../stores/projects.js'

const store = useProjectsStore()
const activeCategory = ref('Todos')

const categories = computed(() => {
  const cats = [...new Set(store.certificates.map(c => c.category))]
  return ['Todos', ...cats]
})

const filteredCerts = computed(() => {
  if (activeCategory.value === 'Todos') return store.certificates
  return store.certificates.filter(c => c.category === activeCategory.value)
})

function categoryIcon(cat) {
  return {
    Cloud: 'mdi-cloud',
    'Data Science': 'mdi-chart-scatter-plot',
    Cybersecurity: 'mdi-shield-lock',
    Frontend: 'mdi-language-javascript',
    DevOps: 'mdi-docker',
    Backend: 'mdi-server-network',
  }[cat] || 'mdi-certificate'
}

onMounted(() => { if (!store.certificates.length) store.fetchAll() })
</script>

<style scoped>
.certs-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--os-bg2);
}

.certs-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--os-border);
  background: var(--os-surface);
  flex-shrink: 0;
}

.header-icon { color: var(--violet); }

.header-title {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--violet);
  letter-spacing: 0.08em;
}

.cert-count {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
}

.cert-filters {
  display: flex;
  gap: 6px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--os-border);
  flex-wrap: wrap;
  flex-shrink: 0;
  background: rgba(0,0,0,0.2);
}

.cat-btn {
  padding: 4px 12px;
  border: 1px solid var(--os-border);
  border-radius: 20px;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.cat-btn:hover { border-color: var(--violet-dim); color: var(--text-primary); }
.cat-btn.active { border-color: var(--violet); color: var(--violet); background: rgba(123,47,255,0.1); }

.certs-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.certs-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  align-content: start;
}

.cert-card {
  background: var(--os-surface);
  border: 1px solid var(--os-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s;
  position: relative;
}

.cert-card:hover {
  border-color: var(--violet-dim);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(123,47,255,0.1);
}

.cert-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(123,47,255,0.15), rgba(0,245,255,0.05));
  border: 1px solid rgba(123,47,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--violet);
}

.cert-category-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--violet);
  text-transform: uppercase;
}

.cert-name {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.cert-issuer {
  font-size: 12px;
  color: var(--text-secondary);
}

.cert-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cert-date, .cert-id {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

.cert-verify-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--violet-dim);
  border-radius: 4px;
  color: var(--violet);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s;
  align-self: flex-start;
}

.cert-verify-btn:hover {
  background: var(--violet);
  color: #fff;
  box-shadow: var(--glow-violet);
}
</style>
