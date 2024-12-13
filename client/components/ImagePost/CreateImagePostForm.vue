<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const imageUrl = ref("");
const description = ref("");
const emit = defineEmits(["refreshImagePosts"]);

// Define props
const props = defineProps<{
  currentDate?: string; // Optional
  groupId: string; // Group ID passed from parent
}>();

const createImagePost = async (imageUrl: string, description: string, groupId: string) => {
  console.log("inside createImagePost in frontend")
  try {
    await fetchy("/api/image-posts", "POST", {
      body: { imageUrl, description, groupId },
    });
  } catch (error) {
    console.error("Error creating image post:", error);
  }
  emit("refreshImagePosts");
  emptyForm();
};

const emptyForm = () => {
  imageUrl.value = "";
  description.value = "";
};
</script>

<template>
  <form @submit.prevent="createImagePost(imageUrl, description, props.groupId)">
    <label for="imageUrl">Image URL:</label>
    <input id="imageUrl" type="url" v-model="imageUrl" placeholder="Enter the image URL" required />

    <label for="description">Description:</label>
    <textarea id="description" v-model="description" placeholder="Add a description (optional)"></textarea>

    <button type="submit" class="pure-button-primary pure-button">Create Image Post</button>
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

textarea,
input {
  font-family: inherit;
  font-size: inherit;
  padding: 0.5em;
  border-radius: 4px;
}

textarea {
  height: 6em;
  resize: none;
}
</style>
