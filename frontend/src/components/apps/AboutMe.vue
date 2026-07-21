<template>
  <div class="about-app">
    <!-- Profile Section -->
    <div class="about-profile">
      <div class="profile-avatar">
        <v-icon icon="mdi-account-circle" size="80" class="avatar-icon" />
        <div class="avatar-ring" />
        <div class="avatar-status">
          <span class="status-dot-green" />
          Online
        </div>
      </div>
      <div class="profile-info">
        <h1 class="profile-name">Juan Carlos Alvarado Rucobo</h1>
        <p class="profile-title">
          <v-icon icon="mdi-laptop" size="15" />
          Ingeniero en Computación
        </p>
        <p class="profile-sub">
          <v-icon icon="mdi-map-marker" size="13" />
          México · Disponible para proyectos
        </p>
        <div class="profile-social">
          <a href="mailto:rucoboalvarado@gmail.com" class="social-btn" id="about-email" title="Email">
            <v-icon icon="mdi-email" size="18" />
            <span>rucoboalvarado@gmail.com</span>
          </a>
          <a href="https://github.com/jcar2" target="_blank" class="social-btn" id="about-github" title="GitHub">
            <v-icon icon="mdi-github" size="18" />
            <span>github.com/jcar2</span>
          </a>
          <a href="https://linkedin.com" target="_blank" class="social-btn" id="about-linkedin" title="LinkedIn">
            <v-icon icon="mdi-linkedin" size="18" />
            <span>LinkedIn</span>
          </a>
          <a href="https://mi-portafolio-kaw6p2b1o-jcar2.vercel.app/" target="_blank" class="social-btn primary" id="about-portfolio" title="Portafolio">
            <v-icon icon="mdi-web" size="18" />
            <span>Ver Portafolio</span>
          </a>
        </div>
      </div>
    </div>

    <div class="about-body">
      <!-- About Text -->
      <div class="about-section">
        <h2 class="section-title">
          <v-icon icon="mdi-account-details" size="16" />
          Sobre mí
        </h2>
        <p class="about-text">
          Ingeniero en Computación con pasión por el desarrollo de sistemas, APIs RESTful, 
          redes y arquitectura de software. Me especializo en construir soluciones escalables 
          y eficientes usando tecnologías modernas. Esta carpeta de evidencias documenta 
          los proyectos, servicios y APIs que he desarrollado y mantengo actualmente.
        </p>
      </div>

      <!-- Skills -->
      <div class="about-section">
        <h2 class="section-title">
          <v-icon icon="mdi-code-tags" size="16" />
          Stack Tecnológico
        </h2>
        <div class="skills-grid">
          <div v-for="skill in skills" :key="skill.name" class="skill-item">
            <v-icon :icon="skill.icon" size="16" :style="{ color: skill.color }" />
            <span>{{ skill.name }}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="about-section">
        <h2 class="section-title">
          <v-icon icon="mdi-chart-bar" size="16" />
          Estadísticas del Sistema
        </h2>
        <div class="stats-row" v-if="projectsStore.stats">
          <div class="about-stat live">
            <span class="stat-num">{{ projectsStore.stats.live }}</span>
            <span class="stat-label">Proyectos en Vivo</span>
          </div>
          <div class="about-stat maint">
            <span class="stat-num">{{ projectsStore.stats.maintenance }}</span>
            <span class="stat-label">En Mantenimiento</span>
          </div>
          <div class="about-stat total">
            <span class="stat-num">{{ projectsStore.stats.total }}</span>
            <span class="stat-label">Total Proyectos</span>
          </div>
          <div class="about-stat certs">
            <span class="stat-num">{{ projectsStore.certificates.length }}</span>
            <span class="stat-label">Certificaciones</span>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="about-section">
        <h2 class="section-title">
          <v-icon icon="mdi-link" size="16" />
          Accesos Directos
        </h2>
        <div class="quick-links">
          <a href="https://mi-portafolio-kaw6p2b1o-jcar2.vercel.app/" target="_blank" class="quick-link" id="ql-portfolio">
            <v-icon icon="mdi-web" size="20" />
            <span>Portafolio Profesional</span>
            <v-icon icon="mdi-open-in-new" size="12" class="link-arrow" />
          </a>
          <a href="https://github.com/jcar2" target="_blank" class="quick-link" id="ql-github">
            <v-icon icon="mdi-github" size="20" />
            <span>GitHub — Repositorios</span>
            <v-icon icon="mdi-open-in-new" size="12" class="link-arrow" />
          </a>
          <a href="mailto:rucoboalvarado@gmail.com" class="quick-link" id="ql-email">
            <v-icon icon="mdi-email" size="20" />
            <span>rucoboalvarado@gmail.com</span>
            <v-icon icon="mdi-open-in-new" size="12" class="link-arrow" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProjectsStore } from '../../stores/projects.js'

const projectsStore = useProjectsStore()

const skills = [
  { name: 'Python',      icon: 'mdi-language-python',     color: '#3776ab' },
  { name: 'FastAPI',     icon: 'mdi-api',                 color: '#009688' },
  { name: 'Vue.js 3',   icon: 'mdi-vuejs',               color: '#42b883' },
  { name: 'JavaScript', icon: 'mdi-language-javascript',  color: '#f7df1e' },
  { name: 'C / C++',    icon: 'mdi-language-c',           color: '#a8b9cc' },
  { name: 'Docker',      icon: 'mdi-docker',              color: '#2496ed' },
  { name: 'Linux',       icon: 'mdi-linux',               color: '#fcc624' },
  { name: 'PostgreSQL',  icon: 'mdi-database',            color: '#336791' },
  { name: 'Redis',       icon: 'mdi-database-sync',       color: '#dc382d' },
  { name: 'Git',         icon: 'mdi-git',                 color: '#f05032' },
  { name: 'Redes TCP/IP', icon: 'mdi-network',            color: '#00c8ff' },
  { name: 'REST APIs',   icon: 'mdi-web-sync',            color: '#7b2fff' },
]

onMounted(() => { if (!projectsStore.projects.length) projectsStore.fetchAll() })
</script>

<style scoped>
.about-app {
  height: 100%;
  overflow-y: auto;
  background: var(--os-bg2);
}

/* Profile */
.about-profile {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 24px 24px 0;
  background: linear-gradient(180deg, rgba(0,100,200,0.06) 0%, transparent 100%);
  border-bottom: 1px solid var(--os-border);
  padding-bottom: 20px;
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-icon { color: var(--cyan); opacity: 0.9; }

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid var(--cyan);
  box-shadow: var(--glow-cyan);
  animation: ringRotate 8s linear infinite;
  background: conic-gradient(var(--cyan) 0deg, transparent 180deg, var(--violet) 360deg);
  opacity: 0.3;
}

@keyframes ringRotate { to { transform: rotate(360deg); } }

.avatar-status {
  position: absolute;
  bottom: 4px;
  right: -4px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--os-surface);
  border: 1px solid var(--os-border);
  border-radius: 10px;
  padding: 2px 8px;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--green);
}

.status-dot-green {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: var(--glow-green);
}

.profile-info { flex: 1; }

.profile-name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 900;
  color: var(--cyan);
  text-shadow: var(--glow-cyan);
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.profile-title, .profile-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.profile-social {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border: 1px solid var(--os-border);
  border-radius: 4px;
  color: var(--text-secondary);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 11px;
  transition: all 0.15s;
}

.social-btn:hover {
  border-color: var(--cyan-dim);
  color: var(--cyan);
  background: rgba(0,245,255,0.06);
}

.social-btn.primary {
  border-color: var(--cyan);
  color: var(--cyan);
  background: rgba(0,245,255,0.06);
}

.social-btn.primary:hover {
  background: var(--cyan);
  color: var(--os-bg);
  box-shadow: var(--glow-cyan);
}

/* Body */
.about-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.about-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--violet);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(123,47,255,0.2);
}

.about-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Skills */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 6px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--os-surface);
  border: 1px solid var(--os-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
  transition: border-color 0.15s;
}

.skill-item:hover { border-color: var(--os-border-glow); }

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.about-stat {
  background: var(--os-surface);
  border: 1px solid var(--os-border);
  border-radius: var(--radius-lg);
  padding: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.15s;
}

.about-stat:hover { transform: translateY(-2px); }

.about-stat.live { border-color: rgba(0,255,159,0.2); }
.about-stat.maint { border-color: rgba(255,215,0,0.2); }
.about-stat.total { border-color: rgba(0,245,255,0.2); }
.about-stat.certs { border-color: rgba(123,47,255,0.2); }

.stat-num {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
}

.about-stat.live .stat-num { color: var(--green); text-shadow: var(--glow-green); }
.about-stat.maint .stat-num { color: var(--yellow); }
.about-stat.total .stat-num { color: var(--cyan); text-shadow: var(--glow-cyan); }
.about-stat.certs .stat-num { color: var(--violet); text-shadow: var(--glow-violet); }

.stat-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

/* Quick Links */
.quick-links { display: flex; flex-direction: column; gap: 6px; }

.quick-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--os-surface);
  border: 1px solid var(--os-border);
  border-radius: var(--radius);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.15s;
}

.quick-link:hover {
  border-color: var(--cyan-dim);
  color: var(--cyan);
  background: rgba(0,245,255,0.05);
  transform: translateX(4px);
}

.link-arrow { margin-left: auto; color: var(--text-muted); }
</style>
