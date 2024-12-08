<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const posts = ref([]);
const groupId = route.params.groupId;

const fetchPosts = async () => {
  const appStore = useUserStore();
  // posts.value = await appStore.fetchGroupPosts(groupId as string);
};

// onMounted(() => {
//   fetchPosts();
// });
</script>

<template>
  <div>
    <h1>Welcome to Group: {{ groupId }}</h1>
    <div v-if="posts.length > 0">
      <h3>Posts:</h3>
      <!-- <ul>
        <li v-for="post in posts" :key="post.id">{{ post.content }}</li>
      </ul> -->
    </div>
    <div v-else>
      <p>No posts found in this group.</p>
    </div>
  </div>
</template>
