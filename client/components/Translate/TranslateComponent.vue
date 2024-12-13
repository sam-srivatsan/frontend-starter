<template>
  <div>
    <select v-model="selectedLanguage" @change="translatePage">
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="de">German</option>
      <!-- Add more languages as needed -->
    </select>

    <div v-if="isLoading">Translating...</div>
    <div v-if="translatedText">
      <div v-html="translatedText"></div>
      <!-- Render the translated content -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const selectedLanguage = ref("es");
const translatedText = ref("");
const isLoading = ref(false);

const translatePage = async () => {
  isLoading.value = true;

  try {
    const pageText = document.body.innerText; // Get all visible text on the page
    const response = await fetchy("/api/translate", "POST", {
      body: {
        text: pageText,
        targetLanguage: selectedLanguage.value,
      },
    });

    translatedText.value = response.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    translatedText.value = "Could not translate text.";
  } finally {
    isLoading.value = false;
  }
};

// Automatically translate the page when the component is mounted
onBeforeMount(async () => {
  await translatePage();
});
</script>
