<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import EventListComponent from "@/components/Event/EventListComponent.vue";
import { ref, onMounted } from "vue";
import { fetchy } from "@/utils/fetchy";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn } = storeToRefs(useUserStore());

const route = useRoute();
const posts = ref([]);
const groupId = route.params.groupId;
const groupTitle = ref<{ title: string } | null>(null);

// Fetch group details using the group_id and then filter through posts using the route getPostsByGroupId
// fetchGroupPosts()

// Fetch posts for the given group ID
const fetchGroupPosts = async () => {
  try {
    const response = await fetchy(`/api/group/:${groupId}/posts`, "GET");
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    const data = await response.json();
    posts.value = data;
  } catch (error) {
    console.error("Error fetching group posts:", error);
    posts.value = [];
  }
};

// Fetch group details
const fetchGroupTitle = async () => {
  try {
    const response = await fetchy(`/api/groups/:${groupId}`, "GET");
    if (!response.ok) {
      throw new Error(`Failed to fetch group title: ${response.statusText}`);
    }
    groupTitle.value = await response.json();
  } catch (error) {
    console.error("Error fetching group title:", error);
    groupTitle.value = null;
  }
};

// Fetch data on component mount
onMounted(() => {
  if (groupId) {
    fetchGroupPosts();
    fetchGroupTitle();
  }
});

</script>

<template>
  <header class="group-header">
    <h1>Group: {{ groupTitle || "Loading..." }}</h1>
  </header>
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
