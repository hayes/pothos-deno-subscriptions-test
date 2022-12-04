# Deno Pothos Subscriptions example

run with `deno run --unstable --allow-net src/index.ts`

BroadcastChannel is an unstable API, but is supported in Deno Deploy

# Queries

Currently GraphiQL does not keep subscriptions running when switching tabs in
the UI.

To test this example, you will need to open up GraphiQL in multiple tabs:

## Subscription

```graphql
subscription {
    channelMessages(channel: "test") {
        id
        message
        from
        channel
    }
}
```

## Sending message

```graphql
mutation {
    sendMessage(channel: "test", from: "test", message: "test") {
        id
    }
}
```
