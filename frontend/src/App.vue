<template>
  <v-app theme="cyberDark">
    <Desktop />
    <Taskbar />
  </v-app>
</template>

<script setup>
import Desktop from './components/Desktop.vue'
import Taskbar from './components/Taskbar.vue'
import { useProjectsStore } from './stores/projects.js'
import { onMounted } from 'vue'

const projectsStore = useProjectsStore()
onMounted(() => projectsStore.fetchAll())
</script>

<style>
/* Prevent Vuetify from adding scrollbars to v-app */
.v-application__wrap {
  min-height: unset !important;
  height: 100vh;
  overflow: hidden;
}
</style>
