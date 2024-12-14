<script setup lang="ts">
import { ref, watch, onMounted, defineProps, defineEmits, toRefs } from "vue";
import { fetchy } from "@/utils/fetchy"; // Assuming this utility handles API calls

// Define props
const props = defineProps<{
  groupId: string; // Group ID passed from parent
}>();

// Define emits
const emit = defineEmits(["group-loaded"]);

const { groupId } = toRefs(props); // Make props reactive
const groupTitle = ref("");
const groupMembers = ref<string[]>([]); // Update to an array of strings
const loaded = ref(false);

// Fetch group details (group title)
const fetchGroupTitle = async () => {
  try {
    const response = await fetchy(`/api/group/${groupId.value}`, "GET");
    groupTitle.value = response || "Untitled Group"; // Set title from response or default value
  } catch (error) {
    console.error("Error fetching group title:", error);
    groupTitle.value = "Error loading title";
  } finally {
    loaded.value = true;
    emit("group-loaded", { groupId: groupId.value, groupTitle: groupTitle.value });
  }
};

const fetchGroupMembers = async () => {
  try {
    const response = await fetchy(`/api/group/${groupId.value}/members`, "GET");
    groupMembers.value = response; // Expect an array of strings (e.g., usernames)
    console.log("group members fetch response", groupMembers.value);
  } catch (error) {
    console.error("Error fetching group members:", error);
    groupMembers.value = [];
  }
};

// Watch for changes in groupId and reload data
watch(groupId, async () => {
  loaded.value = false; // Reset loading state
  await fetchGroupTitle();
  await fetchGroupMembers();
});

// Fetch data on component mount
onMounted(async () => {
  if (!groupId.value) {
    console.error("No groupId provided");
    return;
  }
  await fetchGroupTitle();
  await fetchGroupMembers();
});
</script>

<template>
  <div class="group-settings">
    <h2 class="section-title">Group: {{ groupTitle }}</h2>

    <!-- Group Settings Content -->
    <div class="settings-content">
      <p>Settings for the group will go here.</p>
      <!-- Your settings content goes here -->
    </div>

    <!-- List of group members -->
    <div v-if="groupMembers.length > 0">
      <h3>Group Members</h3>
      <ul>
        <li v-for="(member, index) in groupMembers" :key="index">
          {{ member }} <!-- Display the username (or ID) from the string array -->
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No members in this group yet.</p>
    </div>
  </div>
</template>

<style scoped>
.group-settings {
  padding: 20px;
}

.section-title {
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}

.settings-content {
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin: 5px 0;
}
</style>
