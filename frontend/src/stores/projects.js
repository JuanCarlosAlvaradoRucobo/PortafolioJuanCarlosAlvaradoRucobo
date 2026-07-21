import { defineStore } from 'pinia'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    certificates: [],
    stats: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const [proj, certs, stats] = await Promise.all([
          axios.get(`${API}/projects`),
          axios.get(`${API}/certificates`),
          axios.get(`${API}/stats`),
        ])
        this.projects = proj.data
        this.certificates = certs.data
        this.stats = stats.data
      } catch (e) {
        this.error = e.message
        // Fallback to static data if API is unreachable
        this.projects = FALLBACK_PROJECTS
        this.certificates = FALLBACK_CERTS
        this.stats = {
          total: FALLBACK_PROJECTS.length,
          live: FALLBACK_PROJECTS.filter(p => p.status === 'live').length,
          maintenance: FALLBACK_PROJECTS.filter(p => p.status === 'maintenance').length,
          inactive: FALLBACK_PROJECTS.filter(p => p.status === 'inactive').length,
        }
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    liveProjects: (s) => s.projects.filter(p => p.status === 'live'),
    maintenanceProjects: (s) => s.projects.filter(p => p.status === 'maintenance'),
    inactiveProjects: (s) => s.projects.filter(p => p.status === 'inactive'),
  },
})

// ── Static fallback data (same as backend JSON) ──────────────────────────────
const FALLBACK_PROJECTS = [
  { id:1, name:'NeuralAPI Gateway', description:'Gateway de microservicios con balanceo de carga dinámico y monitoreo en tiempo real.', type:'API', status:'live', tech:['Python','FastAPI','Redis','Docker'], url:'https://api.neuralgateway.dev', github:'https://github.com/jcar2/neural-api-gateway', last_deploy:'2026-07-10', version:'v2.4.1', uptime:'99.97%' },
  { id:2, name:'DataSynth Pipeline', description:'Pipeline de ETL para procesamiento y sincronización de datos entre bases de datos heterogéneas.', type:'Service', status:'live', tech:['Python','Kafka','PostgreSQL','Airflow'], url:'https://datasynth.io', github:'https://github.com/jcar2/datasynth-pipeline', last_deploy:'2026-07-08', version:'v1.8.0', uptime:'99.85%' },
  { id:3, name:'CyberAuth SSO', description:'Sistema de Single Sign-On con autenticación multifactor y tokens JWT.', type:'Service', status:'live', tech:['Node.js','OAuth2','JWT','MongoDB'], url:'https://auth.cybercore.mx', github:'https://github.com/jcar2/cyberauth-sso', last_deploy:'2026-07-01', version:'v3.1.2', uptime:'100%' },
  { id:4, name:'QuantumDash', description:'Dashboard de analytics con visualizaciones en tiempo real y reportes exportables.', type:'Project', status:'live', tech:['Vue 3','D3.js','WebSocket','FastAPI'], url:'https://quantumdash.vercel.app', github:'https://github.com/jcar2/quantum-dashboard', last_deploy:'2026-06-28', version:'v1.2.0', uptime:'98.5%' },
  { id:5, name:'ScanNet Vulnerability', description:'Herramienta de escaneo de vulnerabilidades en redes corporativas.', type:'Tool', status:'maintenance', tech:['Python','Nmap','SQLite','Flask'], url:null, github:'https://github.com/jcar2/scannet', last_deploy:'2026-05-15', version:'v2.0.0-beta', uptime:null },
  { id:6, name:'LogMatrix Collector', description:'Colector centralizado de logs con alertas inteligentes por ML.', type:'Service', status:'maintenance', tech:['Go','Elasticsearch','Kibana','Python'], url:null, github:'https://github.com/jcar2/logmatrix', last_deploy:'2026-04-20', version:'v0.9.3', uptime:null },
  { id:7, name:'RetroChat v1', description:'Sistema de chat P2P sin servidor centralizado. Proyecto universitario de redes.', type:'Project', status:'inactive', tech:['C','Sockets','POSIX'], url:null, github:'https://github.com/jcar2/retrochat', last_deploy:'2024-12-01', version:'v1.0.0', uptime:null },
  { id:8, name:'MonolithApp Legacy', description:'Aplicación monolítica de gestión universitaria. Migrada a microservicios en 2025.', type:'Project', status:'inactive', tech:['PHP','MySQL','jQuery','Apache'], url:null, github:null, last_deploy:'2025-01-10', version:'v4.2.0', uptime:null },
]

const FALLBACK_CERTS = [
  { id:1, name:'AWS Cloud Practitioner', issuer:'Amazon Web Services', date:'2025-09-15', category:'Cloud', url:'https://aws.amazon.com/verification' },
  { id:2, name:'Python for Data Science', issuer:'IBM — Coursera', date:'2025-06-20', category:'Data Science', url:'https://coursera.org/verify' },
  { id:3, name:'Network Security Fundamentals', issuer:'Cisco Networking Academy', date:'2025-03-10', category:'Cybersecurity', url:'https://netacad.com/verify' },
  { id:4, name:'Vue.js Advanced Developer', issuer:'Vue School', date:'2024-11-05', category:'Frontend', url:'https://vueschool.io/certificates' },
  { id:5, name:'Docker & Kubernetes Essentials', issuer:'Linux Foundation', date:'2024-08-18', category:'DevOps', url:'https://training.linuxfoundation.org' },
  { id:6, name:'FastAPI & Modern Python APIs', issuer:'TestDriven.io', date:'2024-05-30', category:'Backend', url:'https://testdriven.io' },
]
