<template>
  <div class="terminal" ref="terminalEl" @click="focusInput">
    <!-- Output History -->
    <div class="term-output" ref="outputEl">
      <!-- Boot Sequence -->
      <div class="term-boot">
        <pre class="boot-art">{{ bootArt }}</pre>
        <p class="boot-line">Sistema inicializado. Escribe <span class="cmd-hint">help</span> para ver los comandos.</p>
      </div>

      <div
        v-for="(entry, i) in history"
        :key="i"
        class="term-entry"
      >
        <div v-if="entry.type === 'input'" class="term-input-line">
          <span class="prompt">{{ prompt }}</span>
          <span class="cmd-text">{{ entry.text }}</span>
        </div>
        <div v-else-if="entry.type === 'output'" class="term-output-block">
          <div v-for="(line, j) in entry.lines" :key="j" v-html="line" class="term-line" />
        </div>
        <div v-else-if="entry.type === 'error'" class="term-error">
          <span>{{ entry.text }}</span>
        </div>
      </div>
    </div>

    <!-- Input Line -->
    <div class="term-input-row">
      <span class="prompt">{{ prompt }}</span>
      <input
        ref="inputEl"
        v-model="currentInput"
        type="text"
        class="term-input"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        @keydown="onKeydown"
        aria-label="Terminal input"
        id="terminal-input"
      />
      <span class="cursor-blink" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useProjectsStore } from '../../stores/projects.js'
import { useWindowsStore } from '../../stores/windows.js'

const projectsStore = useProjectsStore()
const windowsStore = useWindowsStore()

const terminalEl = ref(null)
const outputEl = ref(null)
const inputEl = ref(null)
const currentInput = ref('')
const history = ref([])
const cmdHistory = ref([])
const historyIdx = ref(-1)

const prompt = 'jc@carpetaos:~$'

const bootArt = `
   ██████╗ █████╗ ██████╗ ██████╗ ███████╗████████╗ █████╗ 
  ██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔══██╗
  ██║     ███████║██████╔╝██████╔╝█████╗     ██║   ███████║
  ██║     ██╔══██║██╔══██╗██╔═══╝ ██╔══╝     ██║   ██╔══██║
  ╚██████╗██║  ██║██║  ██║██║     ███████╗   ██║   ██║  ██║
   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝   ╚═╝   ╚═╝  ╚═╝
               OS v1.0 — Juan Carlos Alvarado`.trim()

const COMMANDS = {
  help() {
    return [
      '<span class="c-cyan">Comandos disponibles:</span>',
      '',
      '  <span class="c-green">help</span>           — Muestra esta ayuda',
      '  <span class="c-green">projects</span>       — Lista todos los proyectos y sus estados',
      '  <span class="c-green">live</span>           — Proyectos activos en producción',
      '  <span class="c-green">status</span>         — Resumen estadístico del sistema',
      '  <span class="c-green">whoami</span>         — Información del desarrollador',
      '  <span class="c-green">links</span>          — Redes sociales y contacto',
      '  <span class="c-green">open &lt;app&gt;</span>     — Abre una aplicación',
      '  <span class="c-green">certs</span>          — Lista certificaciones',
      '  <span class="c-green">date</span>           — Fecha y hora del sistema',
      '  <span class="c-green">clear</span>          — Limpia la terminal',
      '  <span class="c-green">matrix</span>         — 🐉',
      '',
      '  Apps disponibles: terminal, projects, certificates, aboutme, portfolio, github',
    ]
  },
  projects() {
    const proj = projectsStore.projects
    if (!proj.length) return ['<span class="c-yellow">Cargando proyectos...</span>']
    const lines = ['<span class="c-cyan">── REGISTRO DE PROYECTOS ──────────────────────────</span>', '']
    proj.forEach(p => {
      const statusColor = p.status === 'live' ? 'c-green' : p.status === 'maintenance' ? 'c-yellow' : 'c-red'
      const statusLabel = p.status === 'live' ? '● LIVE' : p.status === 'maintenance' ? '◐ MAINT' : '○ BAJA'
      const uptime = p.uptime ? ` | uptime: ${p.uptime}` : ''
      lines.push(`  <span class="${statusColor}">${statusLabel}</span>  <span class="c-cyan">${p.name}</span>  <span class="c-dim">[${p.type}] ${p.version}${uptime}</span>`)
    })
    return lines
  },
  live() {
    const proj = projectsStore.liveProjects
    const lines = [`<span class="c-green">── SISTEMAS EN VIVO (${proj.length}) ──────────────────────</span>`, '']
    proj.forEach(p => {
      lines.push(`  <span class="c-green">●</span> <span class="c-cyan">${p.name}</span>  <span class="c-dim">${p.version} | uptime: ${p.uptime}</span>`)
      if (p.url) lines.push(`    <span class="c-dim">↳ ${p.url}</span>`)
    })
    return lines
  },
  status() {
    const s = projectsStore.stats
    if (!s) return ['<span class="c-yellow">Cargando estadísticas...</span>']
    return [
      '<span class="c-cyan">── ESTADO DEL SISTEMA ──────────────────────────────</span>',
      '',
      `  Total de proyectos  : <span class="c-cyan">${s.total}</span>`,
      `  En producción       : <span class="c-green">${s.live} ●</span>`,
      `  En mantenimiento    : <span class="c-yellow">${s.maintenance} ◐</span>`,
      `  Dados de baja       : <span class="c-red">${s.inactive} ○</span>`,
      '',
      `  <span class="c-dim">Sistema: JCARLOS_OS v1.0 | Backend: FastAPI | Frontend: Vue 3 + Vuetify</span>`,
    ]
  },
  whoami() {
    return [
      '<span class="c-cyan">── IDENTIFICACIÓN DEL USUARIO ──────────────────────</span>',
      '',
      '  Nombre   : <span class="c-green">Juan Carlos Alvarado Rucobo</span>',
      '  Rol      : <span class="c-cyan">Ingeniero en Computación</span>',
      '  Email    : <span class="c-dim">rucoboalvarado@gmail.com</span>',
      '  GitHub   : <span class="c-dim">github.com/jcar2</span>',
      '  Web      : <span class="c-dim">mi-portafolio-kaw6p2b1o-jcar2.vercel.app</span>',
      '',
      '  Especialidades: APIs REST · Redes · Python · Vue.js · Docker · Linux',
    ]
  },
  links() {
    return [
      '<span class="c-cyan">── ENLACES Y CONTACTO ──────────────────────────────</span>',
      '',
      '  📧 Email     : <span class="c-green">rucoboalvarado@gmail.com</span>',
      '  🐙 GitHub    : <span class="c-cyan">github.com/jcar2</span>',
      '  💼 LinkedIn  : <span class="c-cyan">linkedin.com/in/jcar2</span>',
      '  🌐 Portfolio : <span class="c-cyan">mi-portafolio-kaw6p2b1o-jcar2.vercel.app</span>',
    ]
  },
  certs() {
    const certs = projectsStore.certificates
    if (!certs.length) return ['<span class="c-yellow">Cargando certificaciones...</span>']
    const lines = ['<span class="c-cyan">── CERTIFICACIONES ─────────────────────────────────</span>', '']
    certs.forEach(c => {
      lines.push(`  <span class="c-green">✓</span> <span class="c-cyan">${c.name}</span>  <span class="c-dim">${c.issuer} | ${c.date}</span>`)
    })
    return lines
  },
  date() {
    const now = new Date()
    return [
      `  <span class="c-cyan">${now.toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>`,
      `  <span class="c-green">${now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}</span>`,
    ]
  },
  matrix() {
    return [
      '<span class="c-green">Wake up, Neo...</span>',
      '<span class="c-green">The Matrix has you...</span>',
      '<span class="c-green">Follow the white rabbit.</span>',
      '',
      '<span class="c-dim">( Knock, knock... )</span>',
    ]
  },
}

function processCommand(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return

  // Add to history
  cmdHistory.value.unshift(trimmed)
  historyIdx.value = -1
  history.value.push({ type: 'input', text: trimmed })

  const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/)

  if (cmd === 'clear') {
    history.value = []
    return
  }

  if (cmd === 'open') {
    const appId = args[0]
    const apps = { terminal:'Terminal', projects:'Explorador de Proyectos', certificates:'Certificados', aboutme:'About Me', portfolio:'Portafolio', github:'GitHub' }
    const icons = { terminal:'mdi-console', projects:'mdi-folder-network', certificates:'mdi-certificate', aboutme:'mdi-account-circle', portfolio:'mdi-web', github:'mdi-github' }
    if (apps[appId]) {
      windowsStore.open(appId, apps[appId], icons[appId])
      history.value.push({ type: 'output', lines: [`<span class="c-green">✓ Abriendo ${apps[appId]}...</span>`] })
    } else {
      history.value.push({ type: 'error', text: `App desconocida: "${appId}". Usa: ${Object.keys(apps).join(', ')}` })
    }
    return
  }

  if (COMMANDS[cmd]) {
    const result = COMMANDS[cmd](args)
    history.value.push({ type: 'output', lines: result })
  } else {
    history.value.push({ type: 'error', text: `Comando no reconocido: "${trimmed}". Escribe help para ver los comandos.` })
  }

  scrollToBottom()
}

function onKeydown(e) {
  if (e.key === 'Enter') {
    processCommand(currentInput.value)
    currentInput.value = ''
    nextTick(scrollToBottom)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIdx.value < cmdHistory.value.length - 1) {
      historyIdx.value++
      currentInput.value = cmdHistory.value[historyIdx.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIdx.value > 0) {
      historyIdx.value--
      currentInput.value = cmdHistory.value[historyIdx.value]
    } else {
      historyIdx.value = -1
      currentInput.value = ''
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    // Basic autocomplete
    const cmds = Object.keys(COMMANDS).concat(['clear', 'open'])
    const match = cmds.find(c => c.startsWith(currentInput.value.toLowerCase()))
    if (match) currentInput.value = match
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (outputEl.value) outputEl.value.scrollTop = outputEl.value.scrollHeight
  })
}

function focusInput() { inputEl.value?.focus() }

onMounted(() => {
  focusInput()
  if (!projectsStore.projects.length) projectsStore.fetchAll()
})
</script>

<style scoped>
.terminal {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #020c14;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  cursor: text;
}

.term-output {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.term-boot { margin-bottom: 16px; }
.boot-art {
  color: #00cc88;
  font-size: 10px;
  line-height: 1.3;
  white-space: pre;
  text-shadow: 0 0 10px rgba(0, 255, 155, 0.5);
}

.boot-line {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 8px;
}

.cmd-hint {
  color: var(--cyan);
  font-weight: 600;
}

.term-entry { margin-bottom: 4px; }

.term-input-line {
  display: flex;
  gap: 8px;
}

.prompt { color: var(--violet); font-weight: 600; white-space: nowrap; }
.cmd-text { color: var(--cyan); }

.term-output-block { padding-left: 0; margin: 2px 0 8px; }

:deep(.term-line) { color: var(--text-secondary); padding: 1px 0; }
:deep(.c-cyan) { color: var(--cyan); }
:deep(.c-green) { color: var(--green); }
:deep(.c-yellow) { color: var(--yellow); }
:deep(.c-red) { color: var(--red); }
:deep(.c-dim) { color: var(--text-muted); }

.term-error { color: var(--red); padding: 2px 0 8px; }

/* Input Row */
.term-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #0a2030;
  background: #020c14;
  flex-shrink: 0;
}

.term-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--cyan);
  font-family: var(--font-mono);
  font-size: 13px;
  caret-color: var(--cyan);
}

.cursor-blink {
  width: 8px;
  height: 14px;
  background: var(--cyan);
  animation: blink 1s step-end infinite;
  opacity: 0.8;
}

@keyframes blink {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0; }
}
</style>
