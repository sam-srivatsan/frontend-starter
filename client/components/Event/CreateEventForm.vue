<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const titleContent = ref("");
const dateContent = ref("");
const descriptionContent = ref("");
const emit = defineEmits(["refreshEvent"]);

// Define props
const props = defineProps<{
  groupId: string; // Group ID passed from parent
}>();

const createEvent = async (titleContent: string, dateContent: string, descriptionContent: string, groupId: string) => {
  try {
    await fetchy("/api/events", "POST", {
      body: { title: titleContent, date: dateContent, description: descriptionContent, groupId },
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
  <form @submit.prevent="createEvent(titleContent, dateContent, descriptionContent, props.groupId)">
    <label for="title">Event Title:</label>
    <textarea id="title" v-model="titleContent" placeholder="Title your event!" required> </textarea>
    <label for="date">Event Date:</label>
    <textarea id="date" v-model="dateContent" placeholder="Add a date and time for your event!" required> </textarea>
    <label for="description">Event Description:</label>
    <textarea id="description" v-model="descriptionContent" placeholder="Add description!" optional> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Event</button>
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
