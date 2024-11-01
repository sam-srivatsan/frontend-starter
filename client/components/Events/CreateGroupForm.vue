<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const titleContent = ref("");
const descriptionContent = ref("");
const emit = defineEmits(["refreshGroups"]);

const createGroup = async (titleContent: string, descriptionContent: string) => {
  try {
    await fetchy("/api/group", "POST", {
      body: { title: titleContent, description: descriptionContent },
    });
  } catch (_) {
    return;
  }
  emit("refreshGroups");
  emptyForm();
};

const emptyForm = () => {
  titleContent.value = "";
  descriptionContent.value = "";
};
</script>

<template>
  <form @submit.prevent="createGroup(titleContent, descriptionContent)">
    <label for="title">Group Title:</label>
    <textarea id="title" v-model="titleContent" placeholder="Title your group!" required> </textarea>
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
