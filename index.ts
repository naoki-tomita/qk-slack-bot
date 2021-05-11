import { serve, ServerRequest } from "https://deno.land/std@0.95.0/http/server.ts";

const decoder = new TextDecoder();
async function parseBody(body: Deno.Reader, size: number): Promise<Event> {
  const tmpBody = new Uint8Array(size);
  await body.read(tmpBody);
  return JSON.parse(decoder.decode(tmpBody));
}

function respondForChallenge(request: ServerRequest, { challenge }: ChallengeEvent) {
  const headers = new Headers();
  headers.append("content-type", "application/json");
  return request.respond({
    status: 200,
    headers,
    body: JSON.stringify({ challenge }),
  });
}

function respondForMessage(request: ServerRequest, event: Event) {
  return request.respond({ status: 200 });
}

interface EventBase {
  type: string;
}

interface ChallengeEvent extends EventBase {
  type: "url_verification";
  challenge: string;
  token: string;
}

type Event = ChallengeEvent;

const requests = serve({ port: parseInt(Deno.env.get("PORT") ?? "8000") });
for await (const request of requests) {
  try {
    const event = await parseBody(request.body, request.contentLength ?? 0);
    console.log(event);
    if (event.type === "url_verification") {
      respondForChallenge(request, event);
    } else {
      respondForMessage(request, event);
    }
  } catch (e) {
    console.error(e);
    request.respond({ status: 500 });
  }
}
