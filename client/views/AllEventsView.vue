<script setup lang="ts">
import EventListComponent from "@/components/Event/EventsListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">{{ currentUsername }}'s Groups!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <EventListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
