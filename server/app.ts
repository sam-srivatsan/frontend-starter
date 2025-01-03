import AuthenticatingConcept from "./concepts/authenticating";
import FriendingConcept from "./concepts/friending";
import PostingConcept from "./concepts/posting";
import SessioningConcept from "./concepts/sessioning";
import GroupingConcept from "./concepts/grouping";
import EventingConcept from "./concepts/eventing";
import TranslateConcept from "./concepts/translate";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts","image-posts");
export const Friending = new FriendingConcept("friends");
export const Grouping = new GroupingConcept("groups");
export const Eventing = new EventingConcept("events");
export const Translating = new TranslateConcept("translations");
