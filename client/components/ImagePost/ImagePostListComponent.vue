<script setup lang="ts">
import CreateImagePostForm from "./CreateImagePostForm.vue";
import ImagePostComponent from "@/components/ImagePost/ImagePostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

// Define props
const props = defineProps<{
  currentDate?: string; // Optional
  groupId: string; // Group ID passed from parent
}>();

const loaded = ref(false);
let imagePosts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getImagePosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let imagePostResults;
  try {
    imagePostResults = await fetchy(`/api/group/${props.groupId}/image-posts`, "GET");
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  imagePosts.value = imagePostResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getImagePosts();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create an image post:</h2>
    <CreateImagePostForm :groupId="groupId" @refreshImagePosts="getImagePosts" />
  </section>
  <section class="posts" v-if="loaded && imagePosts.length !== 0">
    <article v-for="imagePost in imagePosts" :key="imagePost._id">
      <ImagePostComponent v-if="editing !== imagePost._id" :imagePost="imagePost" @refreshImagePosts="getImagePosts" @editImagePost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No image posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
