<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["imagePost"]);
const emit = defineEmits(["editImagePost", "refreshImagePosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteImagePost = async () => {
  try {
    await fetchy(`/api/image-posts/${props.imagePost._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshImagePosts");
};
</script>

<template>
  <p class="author">{{ props.imagePost.author }}</p>
  <img :src="props.imagePost.imageUrl" alt="Image post" class="image-post" />
  <p class="description">{{ props.imagePost.description }}</p>
  <div class="base">
    <menu v-if="props.imagePost.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editImagePost', props.imagePost._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteImagePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.imagePost.dateCreated !== props.imagePost.dateUpdated">Edited on: {{ formatDate(props.imagePost.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.imagePost.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

.image-post {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1em 0;
  border-radius: 8px;
}

.description {
  font-style: italic;
  margin: 0.5em 0;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
