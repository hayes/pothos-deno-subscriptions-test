import SchemaBuilder from "@pothos/core";

export const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string({}),
      },
      resolve: (_, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

builder.mutationType({});

builder.subscriptionType({});
