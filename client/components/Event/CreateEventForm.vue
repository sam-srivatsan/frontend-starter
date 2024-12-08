<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const titleContent = ref("");
const dateContent = ref("");
const descriptionContent = ref("");
const emit = defineEmits(["refreshEvent"]);

const createEvent = async (titleContent: string, dateContent: string, descriptionContent: string) => {
  try {
    await fetchy("/api/event", "POST", {
      body: { title: titleContent, date: dateContent, description: descriptionContent },
    });
  } catch (_) {
    return;
  }
  emit("refreshEvent");
  emptyForm();
};

const emptyForm = () => {
  titleContent.value = "";
  descriptionContent.value = "";
};
</script>

<template>
  <form @submit.prevent="createEvent(titleContent, dateContent, descriptionContent)">
    <label for="title">Group Title:</label>
    <textarea id="title" v-model="titleContent" placeholder="Title your event!" required> </textarea>
    <label for="date">Group Date:</label>
    <textarea id="date" v-model="dateContent" placeholder="Add a date and time for your event!" required> </textarea>
    <label for="description">Group Description:</label>
    <textarea id="description" v-model="descriptionContent" placeholder="Add description!" optional> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Add Title</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 1em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
