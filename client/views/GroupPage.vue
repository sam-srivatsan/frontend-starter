<template>
  <div>
    <h1>Group: {{ groupName }}</h1>
    <PostList :posts="posts" @react="handleReact" @reply="handleReply" />
    <CreatePost @create="handleCreatePost" />
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useAppStore } from "../store";

export default {
  props: ["groupId"],
  setup(props) {
    const appStore = useAppStore();
    const posts = ref([]);

    const fetchPosts = async () => {
      posts.value = await appStore.fetchGroupPosts(props.groupId);
    };

    const handleReact = (postId, reaction) => {
      // React to a post
    };

    const handleReply = (postId, content) => {
      // Reply to a post
    };

    const handleCreatePost = async (content, options) => {
      await appStore.createPost(props.groupId, content, options);
      fetchPosts(); // Refresh posts
    };

    onMounted(fetchPosts);

    return { groupName: "Group " + props.groupId, posts, handleReact, handleReply, handleCreatePost };
  },
};
</script>
