import { builder } from "./builder.ts";
import { getChannel, iterateChannel } from "./util/iterate-channel.ts";

export interface IChannel {
  id: string;
  message: string;
  from: string;
  channel: string;
}

export const Message = builder.objectRef<IChannel>("Message").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    message: t.exposeString("message"),
    from: t.exposeString("from"),
    channel: t.exposeString("channel"),
  }),
});

builder.mutationFields((t) => ({
  sendMessage: t.field({
    type: Message,
    args: {
      message: t.arg.string({ required: true }),
      from: t.arg.string({ required: true }),
      channel: t.arg.string({ required: true }),
    },
    resolve: (_, { message, from, channel }) => {
      const msg = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        from,
        channel,
      };

      const chan = getChannel(channel);
      chan.dispatchEvent(new MessageEvent("message", { data: msg }));
      chan.postMessage(msg);

      return msg;
    },
  }),
}));

builder.subscriptionField("channelMessages", (t) =>
  t.field({
    type: Message,
    args: {
      channel: t.arg.string({ required: true }),
    },
    subscribe: async function* (_, { channel }) {
      for await (
        const msg of iterateChannel<IChannel>(getChannel(channel), {})
      ) {
        if (msg) {
          yield msg;
        }
      }
    },
    resolve: (message) => message,
  }));
