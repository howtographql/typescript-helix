import { Link } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { TypedPubSub } from "typed-graphql-subscriptions";

export type PubSubChannels = {
  newLink: [{ createdLink: Link }];
};

export const pubSub = new TypedPubSub<PubSubChannels>(new PubSub());
