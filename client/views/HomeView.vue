<script setup lang="ts">
import WelcomeComponent from "@/components/Home/WelcomeComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <WelcomeComponent />
  </main>
</template>

<style scoped>
main {
  background-color: var(--royal); /* Set your desired background color */
  min-height: 100vh; /* Ensures it takes the full viewport height */
  padding: 20px; /* Adds some padding for spacing */
}

h1 {
  text-align: center;
}
</style>
