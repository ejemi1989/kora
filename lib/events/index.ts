type EventName = "ORDER_CREATED" | "PAYMENT_SUCCEEDED" | "ORDER_SHIPPED";

type EventPayload = {
  ORDER_CREATED: { orderId: string; userId: string; total: number };
  PAYMENT_SUCCEEDED: { orderId: string; paymentId: string; stripeId: string };
  ORDER_SHIPPED: { orderId: string; trackingNumber: string };
};

type EventHandler<E extends EventName> = (payload: EventPayload[E]) => void | Promise<void>;

const handlers = new Map<EventName, Set<EventHandler<any>>>();

export function on<E extends EventName>(event: E, handler: EventHandler<E>) {
  if (!handlers.has(event)) handlers.set(event, new Set());
  handlers.get(event)!.add(handler);
  return () => handlers.get(event)!.delete(handler);
}

export function off<E extends EventName>(event: E, handler: EventHandler<E>) {
  handlers.get(event)?.delete(handler);
}

export async function emit<E extends EventName>(event: E, payload: EventPayload[E]) {
  const eventHandlers = handlers.get(event);
  if (!eventHandlers) return;
  await Promise.allSettled([...eventHandlers].map((h) => Promise.resolve(h(payload))));
}
