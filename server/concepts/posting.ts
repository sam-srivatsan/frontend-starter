import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

// Define options and document structures for regular and image posts
export interface PostOptions {
  backgroundColor?: string;
}

export interface PostDoc extends BaseDoc {
  author: ObjectId;
  content: string;
  groupId: ObjectId;
  options?: PostOptions;
}

export interface ImagePostDoc extends BaseDoc {
  author: ObjectId;
  imageUrl: string; // URL of the image
  description?: string; // Optional description of the image
  groupId: ObjectId;
  options?: PostOptions;
}

/**
 * concept: Posting [Author] and Image Posting
 */
export default class PostingConcept {
  public readonly posts: DocCollection<PostDoc>;
  public readonly imagePosts: DocCollection<ImagePostDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string, imageCollectionName: string) {
    this.posts = new DocCollection<PostDoc>(collectionName);
    this.imagePosts = new DocCollection<ImagePostDoc>(imageCollectionName);
  }

  // Regular post methods
  async createPost(author: ObjectId, content: string, groupId: ObjectId, options?: PostOptions) {
    const _id = await this.posts.createOne({ author, content, groupId, options });
    return { msg: "Post successfully created!", post: await this.posts.readOne({ _id }) };
  }

  async getPosts() {
    return await this.posts.readMany({}, { sort: { _id: -1 } });
  }

  async getByAuthor(author: ObjectId) {
    return await this.posts.readMany({ author });
  }

  async getPostsByGroup(groupId: ObjectId) {
    const allPosts = await this.posts.readMany({}, { sort: { _id: -1 } });
    return allPosts.filter((post) => post.groupId.equals(groupId));
  }

  async updatePost(_id: ObjectId, content?: string, options?: PostOptions) {
    await this.posts.partialUpdateOne({ _id }, { content, options });
    return { msg: "Post successfully updated!" };
  }

  async deletePost(_id: ObjectId) {
    await this.posts.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    if (post.author.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, _id);
    }
  }

  // New methods for image posts
  async createImagePost(author: ObjectId, imageUrl: string, groupId: ObjectId, description?: string, options?: PostOptions) {
    const _id = await this.imagePosts.createOne({ author, imageUrl, description, groupId, options });
    return { msg: "Image post successfully created!", imagePost: await this.imagePosts.readOne({ _id }) };
  }

  async getImagePosts() {
    return await this.imagePosts.readMany({}, { sort: { _id: -1 } });
  }

  async getImagePostsByGroup(groupId: ObjectId) {
    const allPosts = await this.imagePosts.readMany({}, { sort: { _id: -1 } });
    return allPosts.filter((post) => post.groupId.equals(groupId));
  }

  async updateImagePost(_id: ObjectId, imageUrl?: string, description?: string, options?: PostOptions) {
    await this.imagePosts.partialUpdateOne({ _id }, { imageUrl, description, options });
    return { msg: "Image post successfully updated!" };
  }

  async deleteImagePost(_id: ObjectId) {
    await this.imagePosts.deleteOne({ _id });
    return { msg: "Image post deleted successfully!" };
  }

  async assertImagePostAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const post = await this.imagePosts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Image post ${_id} does not exist!`);
    }
    if (post.author.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, _id);
    }
  }
}

export class PostAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}
