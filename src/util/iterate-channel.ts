const channels = new Map<string, BroadcastChannel>();

export function getChannel(name: string) {
  let channel = channels.get(name);

  if (!channel) {
    channel = new BroadcastChannel(name);

    channels.set(name, channel);
  }

  return channel;
}

export async function* iterateChannel<T = unknown>(
  channel: BroadcastChannel,
  options?: {
    autoClose?: boolean;
    maxQueueSize?: number;
  },
) {
  let next = createPromise<T>();
  const queue: Promise<T>[] = [next.promise];

  channel.addEventListener("message", handleEvent);

  try {
    while (true) {
      const data = await queue.shift();

      yield data;
    }
  } finally {
    channel.removeEventListener("message", handleEvent);

    if (options?.autoClose) {
      channel.close();
    }
  }

  function handleEvent(event: MessageEvent) {
    if (queue.length >= (options?.maxQueueSize ?? 100)) {
      console.warn(
        `Channel queue for ${channel.name} is full, dropping message`,
      );
      return;
    }

    const { resolve } = next;
    next = createPromise();
    queue.push(next.promise);

    resolve(event.data);
  }
}

function createPromise<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
