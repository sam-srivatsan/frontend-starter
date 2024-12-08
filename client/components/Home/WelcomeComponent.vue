<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const messages = ["Welcome!", "Bienvenido!", "Bienvenue!", "Willkommen!", "Benvenuto!", "欢迎!", "ようこそ!", "Добро пожаловать!"];

const currentMessage = ref("Welcome!"); // Default message
let currentIndex = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;

const startRotatingMessages = () => {
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % messages.length;
    currentMessage.value = messages[currentIndex];
  }, 2000); // Change message every 2 seconds
};

onMounted(() => {
  startRotatingMessages();
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId); // Cleanup to prevent memory leaks
  }
});
</script>

<template>
  <main>
    <section class="welcome-section">
      <p class="welcome-text">{{ currentMessage }}</p>
    </section>
  </main>
</template>

<style scoped>
.welcome-section {
  height: 100vh; /* Full viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.welcome-text {
  font-size: 2em;
  font-weight: bold;
  color: #333;
  text-align: center;
}
</style>
