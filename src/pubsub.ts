import { PubSub } from "graphql-subscriptions";
import { TypedPubSub } from "typed-graphql-subscriptions";

export type PubSubChannels = {};

export const pubSub = new TypedPubSub<PubSubChannels>(new PubSub());
