import { ObjectId } from "mongodb";
import { z } from "zod";
import { Authing, Eventing, Friending, Grouping, Posting, Sessioning, Translating } from "./app";
import { NotFoundError } from "./concepts/errors";
import { EventDoc } from "./concepts/eventing";
import { GroupOptions } from "./concepts/grouping";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import { Router, getExpressRouter } from "./framework/router";
import Responses from "./responses";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users/:id")
  async getUsernameFromId(str_id: string) {
    const id = new ObjectId(str_id);
    return await Authing.getUserById(id);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.get("/group/:groupId")
  async getGroupTitle(groupId: string) {
    const groupOid = new ObjectId(groupId);
    const title = await Grouping.getTitleById(groupOid);
    if (!title) throw new Error("Group title not found");
    return title;
  }

  @Router.get("/group/:groupId/posts")
  async getPostsByGroupId(groupId: string) {
    const groupOid = new ObjectId(groupId);
    const posts = await Posting.getPostsByGroup(groupOid);
    return posts;
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, groupId: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    console.log("groupid inside posts api", groupId);
    // Convert groupId to ObjectId if provided
    const groupOid = new ObjectId(groupId);

    // Call Posting.create with the user, content, options, and groupOid
    const created = await Posting.createPost(user, content, groupOid, options);

    // Format the response
    return {
      msg: created.msg,
      post: await Responses.post(created.post),
    };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.updatePost(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.deletePost(oid);
  }

  // Image Posts Routes
  @Router.get("/image-posts")
  async getImagePosts() {
    return await Posting.getImagePosts();
  }

  @Router.get("/group/:groupId/image-posts")
  async getImagePostsByGroupId(groupId: string) {
    console.log("entered getImagePostsbyGroupId in routes.ts")
    const groupOid = new ObjectId(groupId);
    return await Posting.getImagePostsByGroup(groupOid);
  }

  @Router.post("/image-posts")
  async createImagePost(session: SessionDoc, imageUrl: string, groupId: string, description?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const groupOid = new ObjectId(groupId);

    // Call Posting.createImagePost to handle image post creation
    const created = await Posting.createImagePost(user, imageUrl, groupOid, description, options);

    return created; // Return the raw creation result
  }

  @Router.patch("/image-posts/:id")
  async updateImagePost(session: SessionDoc, id: string, imageUrl?: string, description?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertImagePostAuthorIsUser(oid, user); // Ensure the user is the author
    return await Posting.updateImagePost(oid, imageUrl, description, options);
  }

  @Router.delete("/image-posts/:id")
  async deleteImagePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertImagePostAuthorIsUser(oid, user); // Ensure the user is the author
    return await Posting.deleteImagePost(oid);
  }

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  @Router.post("/group")
  async createGroup(session: SessionDoc, title: string, description?: string, options?: GroupOptions) {
    const creator = Sessioning.getUser(session); // Gets the user from session
    const result = await Grouping.create(creator, title, description, options); // Calls `create` with the necessary fields
    return result; // Returns the group creation result, including group ID and title
  }

  // Add another user to a group that you are already in
  @Router.put("/group/:userId")
  async addToGroup(session: SessionDoc, inviteeId: string, groupId: string) {
    const user = Sessioning.getUser(session);
    const groupOid = new ObjectId(groupId);
    const inviteeOid = new ObjectId(inviteeId);
    await Grouping.assertIsInGroup(user, groupOid);
    return await Grouping.inviteUser(groupOid, inviteeOid);
  }

  @Router.delete("/group/:groupId/members")
  async leaveGroup(session: SessionDoc, groupId: string) {
    const user = Sessioning.getUser(session);
    const groupOid = new ObjectId(groupId);

    // Ensure the user is a member of the group before attempting to leave
    await Grouping.assertIsInGroup(user, groupOid);

    // Delete any events created by the user within this group
    await Eventing.deleteEventsByCreatorAndGroup(user, groupOid);

    // Call the leaveGroup function from GroupingConcept to remove the user from the group
    const result = await Grouping.leaveGroup(groupOid, user);
    return result;
  }

  @Router.post("/events")
  async createEvent(session: SessionDoc, groupId: string, title: string, date: string, description?: string) {
    const user = Sessioning.getUser(session);
    const groupOid = new ObjectId(groupId);

    await Grouping.assertIsInGroup(user, groupOid); // Check if user is in group

    // Pass both creator (user) and groupId to the create function
    return await Eventing.create(user, groupOid, title, date, description);
  }

  @Router.patch("/events/:eventId")
  async editEvent(
    session: SessionDoc,
    eventId: string,
    title?: string,
    date?: string, // Keep date as string for input
    description?: string,
    attendees?: ObjectId[],
  ) {
    const user = Sessioning.getUser(session);
    const eventOid = new ObjectId(eventId);

    // Ensure the user has permission to edit the event
    const event = await Eventing.events.readOne({ _id: eventOid });
    if (!event) throw new NotFoundError(`Event ${eventId} does not exist!`);

    await Grouping.assertIsInGroup(user, event.creator);

    // Prepare updated fields
    const updateData: Partial<EventDoc> = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (attendees) updateData.attendees = attendees;

    // Convert date string to Date object if provided
    if (date) {
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        throw new Error("Invalid date format. Please use ISO 8601 format: 'YYYY-MM-DDTHH:mm:ssZ'.");
      }
      updateData.date = eventDate; // Assign as Date object
    }

    await Eventing.events.partialUpdateOne({ _id: eventOid }, updateData);
    return { msg: "Event updated successfully!" };
  }

  @Router.delete("/events/:eventId")
  async deleteEvent(session: SessionDoc, eventId: string) {
    const user = Sessioning.getUser(session);
    const eventOid = new ObjectId(eventId);

    const event = await Eventing.events.readOne({ _id: eventOid });
    if (!event) throw new NotFoundError(`Event ${eventId} does not exist!`);

    await Grouping.assertIsInGroup(user, event.creator);
    await Eventing.events.deleteOne({ _id: eventOid });
    return { msg: "Event deleted successfully!" };
  }

  @Router.get("/group/:groupId/events")
  async getEventsByGroupId(session: SessionDoc, groupId: string) {
    // Validate groupId format
    if (!groupId || !ObjectId.isValid(groupId)) {
      throw new NotFoundError(`Group ID ${groupId} is invalid.`);
    }

    const groupOid = new ObjectId(groupId); // Convert string to ObjectId
    const events = await Eventing.getEventsByGroup(groupOid); // Fetch events for the specified group ID
    console.log("events", events);
    return events; // Return the events found
  }

  // Getter for Groups
  @Router.get("/group")
  @Router.validate(z.object({ groupId: z.string().optional() }))
  async getGroups(groupId?: string) {
    let groups;
    if (groupId) {
      // Fetch a single group by ID
      const group = await Grouping.groups.readOne({ _id: new ObjectId(groupId) });
      if (!group) throw new NotFoundError("Group not found!");
      return Responses.group(group); // Format the single group response
    } else {
      // Fetch all groups
      groups = await Grouping.groups.readMany({});
      return Responses.groups(groups); // Format the response for multiple groups
    }
  }

  @Router.post("/translate")
  async translateText(session: SessionDoc, text: string, targetLanguage: string) {
    try {
      // Call Google Translate API (or any translation service)
      const translatedText = await Translating.translateText(text, targetLanguage);
      return { translatedText };
    } catch (error) {
      throw new Error("Could not translate text.");
    }
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
