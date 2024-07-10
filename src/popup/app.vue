<script setup lang="ts">
const version = __VERSION__;

const route = useRoute();
const showAbout = computed(() => route.path !== '/about');
</script>

<template>
  <RouterView />

  <footer aria-label="Site Footer" class="flex justify-between items-center px-6 pb-4">
    <div class="text-center flex flex-col gap-y-2">
      <RouterLink v-if="showAbout" class="underline" to="/about">
        关于
      </RouterLink>
    </div>
    <a href="https://github.com/wyfer/computation-of-hours-worked" class="text-indigo-600">Vesion: {{ version }}</a>
  </footer>
</template>

<style scoped></style>
