<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["group"]);
const emit = defineEmits(["editGroup", "refreshGroups"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteGroup = async () => {
  try {
    await fetchy(`/api/group/${props.group._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshGroups");
};
</script>

<template>
  <p class="author">{{ props.group.author }}</p>
  <p>{{ props.group.content }}</p>
  <div class="base">
    <menu v-if="props.group.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editGroup', props.group._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteGroup">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.group.dateCreated !== props.group.dateUpdated">Edited on: {{ formatDate(props.group.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.group.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
