<script setup lang="ts">
import { marked } from "marked";

const version = __VERSION__;
const changelog = __CHANGELOG__;
const gitCommit = __GIT_COMMIT__;
const gitURL = __GITHUB_URL__;
const commitURL = `${gitURL}/commit/${gitCommit}`;
</script>

<template>
  <div style="grid-area: content">
    <div
      class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
    >
      Version
      <a :href="commitURL" target="_blank" class="font-semibold text-indigo-600">
        <span class="absolute inset-0" aria-hidden="true" />
        {{ version }}
        <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
    
    <div class="prose changelog mt-4" v-html="marked(changelog)" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.changelog) {
  input[type="checkbox"] {
    @apply checkbox checkbox-info disabled:opacity-100;
  }
  table {
    @apply table table-zebra;
  }
}
</style>
