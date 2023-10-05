import { join } from "node:path";
import { WatchEventType, watch, FSWatcher } from "node:fs";
import type { ServerWebSocket, Server } from "bun";

let port: number = parseInt(process.argv[2]);
if (isNaN(port)) port = 3000;

const baseDir = join(import.meta.dir, "..", "..", "www");
let wsClients: Set<ServerWebSocket> = new Set();
const watcher: FSWatcher = watch(
    baseDir,
    { recursive: true },
    (event: WatchEventType, data: string | Error | undefined) => {
        console.log("File changed: " + data);
        wsClients.forEach((ws: ServerWebSocket) => {
            ws.send("reload");
        });
    }
)

const server = Bun.serve({
    port,
    async fetch(req: Request, server: Server) {
        if (server.upgrade(req)) return;

        const url = new URL(req.url);
        const filename = url.pathname === '/' ? '/index.html' : url.pathname;
        const filePath = join(baseDir, filename);
        const file = Bun.file(filePath);
        const exist = await file.exists();

        if (!exist) {
            return new Response("Not found", {
                status: 404,
            });
        }

        return new Response(file);
    },
    websocket: {
        open(ws: ServerWebSocket) {
            wsClients.add(ws);
        },
        close(ws: ServerWebSocket) {
            wsClients.delete(ws);
        },
        message(ws: ServerWebSocket, message: string) {
            console.log("Message received: " + ws.remoteAddress + ": " + message);
        }
    }
})

console.log(`Server started on ${server.hostname}:${server.port}`);