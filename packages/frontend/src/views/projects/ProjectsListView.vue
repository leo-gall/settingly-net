<template>
  <div>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-8 lg:my-24">
      <div class="flex flex-row justify-between mb-12">
        <h1 class="text-4xl font-semibold">Projects</h1>
        <CreateProjectButton />
      </div>

      <div
        v-if="!error && !isLoading && projects.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
      >
        <ProjectCard v-for="(project, index) in projects" :key="index" :project="project" />
      </div>
      <div
        v-else-if="!error && !isLoading && projects.length === 0"
        class="flex flex-col items-center justify-center w-full h-96 gap-2"
      >
        <p class="w-full text-center text-lg">You don't have any projects yet.</p>
        <p class="w-full text-center text-lg">
          To create a new project, click the "New Project" button in the top right corner.
        </p>
      </div>
      <div
        v-else-if="error && !isLoading"
        class="flex flex-col items-center justify-center w-full h-96 gap-2"
      >
        <p class="w-full text-center text-lg text-error">
          Oops! Something went wrong while loading your projects:
        </p>
        <p class="w-full text-center text-lg text-error">
          {{ error }}
        </p>
      </div>
      <div v-else class="flex flex-col items-center justify-center w-full h-96 gap-6">
        <p class="w-full text-center text-lg">Your projects are being loaded...</p>

        <SharedSpinner />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

import { useProjectsStore } from '@/stores/useProjectsStore';
import { storeToRefs } from 'pinia';
import ProjectCard from '@/components/projects/ProjectCard.vue';
import SharedSpinner from '@/components/shared/SharedSpinner.vue';
import CreateProjectButton from '@/components/projects/CreateProjectButton.vue';

const projectsStore = useProjectsStore();
const { error, isLoading, projects } = storeToRefs(projectsStore);

useHead({
  title: 'Projects - Settingly',
});
</script>
