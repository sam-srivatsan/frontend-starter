<script setup lang="ts">
import EventListComponent from "@/components/Event/EventListComponent.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import ScrapbookListComponent from "@/components/Scrapbook/ScrapbookListComponent.vue";
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
const activeTab = ref("Posts");
const tabs = ["Posts", "Events", "Scrapbook"];

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
  <main class="group-stats">
    <h2 class="section-title">Group: {{ groupTitle }}</h2>

    <!-- Tabs Section -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab" :class="['tab', { active: activeTab === tab }]" @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>

    <!-- Dynamic Content -->
    <div v-if="activeTab === 'Posts'" class="tab-content">
      <PostListComponent :groupId="groupId" v-if="isLoggedIn" />
    </div>

    <div v-if="activeTab === 'Events'" class="tab-content">
      <EventListComponent :groupId="groupId" v-if="isLoggedIn" />
    </div>

    <div v-if="activeTab === 'Scrapbook'" class="tab-content">
      <ScrapbookListComponent :groupId="groupId" v-if="isLoggedIn" />
    </div>
  </main>
</template>

<style scoped>
.group-stats {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--cordovan);
  padding: 20px;
}

.section-title {
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: flex-start;
  background-color: var(--light-gray);
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  transition: background-color 0.3s;
}

.tab:hover {
  background-color: var(--light-cordovan);
}

.tab.active {
  background-color: var(--cordovan);
  color: white;
  font-weight: bold;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>
