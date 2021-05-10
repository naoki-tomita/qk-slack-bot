FROM hayd/deno:debian as builder
WORKDIR /work
COPY index.ts .
RUN deno compile --allow-net --allow-env --unstable -o qk-bot index.ts

FROM debian:buster-slim
WORKDIR /app
COPY --from=builder /work/qk-bot .

CMD ["./qk-bot"]
