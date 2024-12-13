<script setup lang="ts">
import EventListComponent from "@/components/Event/EventListComponent.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref, toRefs, watch } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());

// Define props
const props = defineProps<{
  currentDate?: string; // Optional: If date is relevant for this component
  groupId: string; // Group ID passed from parent
}>();

// Define emits
const emit = defineEmits(["group-loaded"]); // Example emit for notifying parent when group data is loaded

const { groupId } = toRefs(props); // Make props reactive
const groupTitle = ref("");
const posts = ref([]);
const loaded = ref(false);

// Fetch posts for the given group ID
const fetchGroupPosts = async () => {
  try {
    const response = await fetchy(`/api/group/${groupId.value}/posts`, "GET");
    // console.log("group post fetch response", response);
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
    const title = await fetchy(`/api/group/${groupId.value}`, "GET");
    groupTitle.value = title || "Untitled Group";
  } catch (error) {
    console.error("Error fetching group title:", error);
    groupTitle.value = "Error loading title";
  } finally {
    loaded.value = true;
    emit("group-loaded", { groupId: groupId.value, groupTitle: groupTitle.value });
  }
};

// Watch for changes in props.groupId and reload data
watch(groupId, async () => {
  loaded.value = false; // Reset loading state
  await fetchGroupTitle();
  await fetchGroupPosts();
});

// Fetch data on component mount
onMounted(async () => {
  if (!groupId.value) {
    console.error("No groupId provided");
    return;
  }

  await fetchGroupTitle();
  // await fetchGroupPosts();
});
</script>

<template>
  <header class="group-header">
    <h1 v-if="loaded">Group: {{ groupTitle }}</h1>
    <h1 v-else>Loading...</h1>
  </header>
  <div class="group-details-container">
    <div class="half-section">
      <PostListComponent :groupId="groupId" v-if="isLoggedIn" />
    </div>
    <div class="half-section">
      <EventListComponent :groupId="groupId" v-if="isLoggedIn" />
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
