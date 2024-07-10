<script setup lang="ts"></script>

<template>
  <div class="m-4">
    <button type="button" class="text-sm font-semibold leading-6 text-gray-900" @click="$router.back">
      Go Back
    </button>
    <div class="mt-6 flex items-center justify-end gap-x-6 border-t border-gray-900/10 mb-4" />

    <Changelog />
  </div>
</template>

<style scoped></style>
