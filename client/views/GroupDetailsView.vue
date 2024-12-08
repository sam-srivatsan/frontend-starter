<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

// Import PostDoc type for type safety
import type { PostDoc } from "/Users/samvinu/Downloads/MIT/F24/6.104/frontend-starter/server/concepts/posting.ts";

// Access the user store using Pinia
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

// Set up reactive state
const route = useRoute();
const posts = ref<PostDoc[]>([]);
const groupId = route.params.groupId;

// Function to fetch all posts
const fetchAllPosts = async () => {
  try {
    const response = await fetchy("/posts", "GET");
    posts.value = response; // Populate reactive posts
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// Fetch posts when component is mounted
onMounted(() => {
  fetchAllPosts();
});
</script>

<template>
  <div>
    <h1>Welcome to Group: {{ groupId }}</h1>

    <!-- Conditional rendering for logged-in state -->
    <div v-if="isLoggedIn">
      <h3>All Posts:</h3>
      <ul v-if="posts.length > 0">
        <li v-for="post in posts" :key="post._id.toString()">{{ post.content }}</li>
      </ul>
      <p v-else>No posts found in this group.</p>
    </div>
    <div v-else>
      <p>Please log in to view posts.</p>
    </div>
  </div>
</template>
