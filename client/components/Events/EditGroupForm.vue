<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["group"]);
const content = ref(props.group.content);
const emit = defineEmits(["editGroup", "refreshGroups"]);

const editGroup = async (content: string) => {
  try {
    await fetchy(`/api/group/${props.group._id}`, "PATCH", { body: { content: content } });
  } catch (e) {
    return;
  }
  emit("editGroup");
  emit("refreshGroups");
};
</script>

<template>
  <form @submit.prevent="editGroup(content)">
    <p class="author">{{ props.group.author }}</p>
    <textarea id="content" v-model="content" placeholder="Create a group!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editGroup')">Cancel</button></li>
      </menu>
      <p v-if="props.group.dateCreated !== props.group.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.group.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.group.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

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

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
