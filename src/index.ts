import { serve } from "https://deno.land/std@0.157.0/http/server.ts";
import { createYoga } from "graphql-yoga";
import { builder } from "./builder.ts";
import "./chat.ts";

const yoga = createYoga({
  graphqlEndpoint: "/graphql",
  schema: builder.toSchema(),
  graphiql: {
    defaultQuery:
      `subscription { channelMessages(channel: "test") { id message from channel } }

      # mutation {
      #   sendMessage(channel: "test", from: "test", message: "test") {
      #    id
      #  }
      #}
      `,
  },
});

serve(yoga, {
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}/graphql`);
  },
});
