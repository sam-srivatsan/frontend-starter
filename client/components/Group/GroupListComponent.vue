<script setup lang="ts">
import CreateGroupForm from "@/components/Group/CreateGroupForm.vue";
import EditGroupForm from "@/components/Group/EditGroupForm.vue";
import GroupComponent from "@/components/Group/GroupComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let groups = ref<Array<Record<string, any>>>([]);
let editing = ref("");

async function getGroups(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let groupResults;

  try {
    groupResults = await fetchy("/api/group", "GET", { query });
    // console.log("Fetched Groups:", groupResults);

    if (groupResults.length > 0) {
      groups.value = groupResults.sort((a: { createdAt: string | number | Date }, b: { createdAt: string | number | Date }) => {
        const aTime = new Date(a.createdAt).getTime() || 0;
        const bTime = new Date(b.createdAt).getTime() || 0;
        return bTime - aTime;
      });
    } else {
      groups.value = [];
    }
  } catch (_) {
    console.error("Error fetching groups:", _);
  }

  loaded.value = true;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getGroups();
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a group:</h2>
    <CreateGroupForm @refreshGroups="getGroups" />
  </section>
  <div class="row"></div>
  <div id="google_translate_element"></div>
  <section class="groups" v-if="loaded && groups.length !== 0">
    <!-- Wrap each group with router-link -->
    <router-link v-for="group in groups" :key="group._id" :to="`/group/${group._id}`" class="group-link">
      <article>
        <GroupComponent v-if="editing !== group._id" :group="group" @refreshGroups="getGroups" @editGroup="updateEditing" />
        <EditGroupForm v-else :group="group" @refreshGroups="getGroups" @editGroup="updateEditing" />
      </article>
    </router-link>
  </section>
  <p v-else-if="loaded">No groups found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
.group-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

article {
  background-color: var(--base-bg);
  border-radius: 8px;
  padding: 1em;
  transition: transform 0.2s ease;
}

article:hover {
  transform: scale(1.05);
}
</style>
