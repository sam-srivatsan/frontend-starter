<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <main class="column">
    <h1>Please login or register!</h1>
    <LoginForm />
    <RegisterForm />
  </main>
</template>

<style scoped>
main {
  background-color: var(--royal); /* Set your desired background color */
  min-height: 100vh; /* Ensures it takes the full viewport height */
  padding: 20px; /* Adds some padding for spacing */
}
</style>
