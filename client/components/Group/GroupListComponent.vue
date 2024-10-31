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
let groups = ref<Array<Record<string, string>>>([]);
let editing = ref("");
// let searchAuthor = ref("");

async function getGroups(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let groupResults;
  try {
    groupResults = await fetchy("/api/group", "GET", { query });
  } catch (_) {
    return;
  }
  // searchAuthor.value = author ? author : "";
  groups.value = groupResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getGroups();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a group:</h2>
    <CreateGroupForm @refreshGroups="getGroups" />
  </section>
  <div class="row">
    <!-- <h2 v-if="!searchAuthor">Groups:</h2>
    <h2 v-else>Groups by {{ searchAuthor }}:</h2>
    <SearchGroupForm @getGroupsByAuthor="getGroups" /> -->
  </div>
  <section class="groups" v-if="loaded && groups.length !== 0">
    <article v-for="group in groups" :key="group._id">
      <GroupComponent v-if="editing !== group._id" :group="group" @refreshGroups="getGroups" @editGroup="updateEditing" />
      <EditGroupForm v-else :group="group" @refreshGroups="getGroups" @editGroup="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No groups found</p>
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

.groups {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
