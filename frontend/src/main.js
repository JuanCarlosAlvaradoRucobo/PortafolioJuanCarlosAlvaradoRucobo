import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'cyberDark',
    themes: {
      cyberDark: {
        dark: true,
        colors: {
          background: '#030a12',
          surface: '#091824',
          primary: '#00f5ff',
          secondary: '#7b2fff',
          success: '#00ff9f',
          warning: '#ffd700',
          error: '#ff3366',
          info: '#00a8cc',
          'on-background': '#e0f4ff',
          'on-surface': '#e0f4ff',
        },
      },
    },
  },
  defaults: {
    VBtn: { variant: 'outlined', density: 'compact' },
    VChip: { size: 'small' },
  },
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.mount('#app')
