<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import EventListComponent from "@/components/Event/EventListComponent.vue";
import { ref, onMounted } from "vue";
// import { fetchy } from "@/utils/fetchy";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn } = storeToRefs(useUserStore());

const route = useRoute();
const posts = ref([]);
const groupId = route.params.groupId;


// // Fetch posts for the current group
// const fetchAllPosts = async () => {
//   try {
//     const response = await fetchy(`/posts?groupId=${groupId}`, "GET");
//     posts.value = response;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//   }
// };

// onMounted(() => {
//   fetchAllPosts();
// });
</script>

<template>
  <div class="group-details-container">
    <div class="half-section">
      <PostListComponent v-if="isLoggedIn" />
    </div>
    <div class="half-section">
      <EventListComponent v-if="isLoggedIn" />
    </div>
  </div>
</template>

<style scoped>
.group-details-container {
  display: flex;
  height: 100%; /* Make it occupy the full height of the parent container */
  background-color: var(--cordovan);
}

.half-section {
  flex: 1; /* Each section takes up 50% of the container */
  border: 1px solid #ccc; /* Optional: add borders for better visibility */
  overflow-y: auto; /* Allow scrolling if content exceeds the section height */
}
</style>
