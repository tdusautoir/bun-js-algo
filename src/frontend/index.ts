/// <reference lib="dom" />

const ws = new WebSocket(`ws://${location.host}`);
ws.onopen = () => {
    setInterval(() => ws.send("ping"), 5000);
    ws.send("Hello from the client!");
}

ws.onmessage = (e: MessageEvent) => {
    if (e.data === "reload") {
        location.reload();
    }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d");