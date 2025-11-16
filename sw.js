let virtualFiles = {};

self.addEventListener("message", event => {
    if (event.data.type === "updateFS") {
        virtualFiles = event.data.files;
    }
});

// Intercept fetches inside iframe
self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);
    const path = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;

    if (virtualFiles[path] !== undefined) {
        let type = "text/plain";

        if (path.endsWith(".html")) type = "text/html";
        if (path.endsWith(".css")) type = "text/css";
        if (path.endsWith(".js")) type = "application/javascript";
        if (path.endsWith(".ico")) type = "image/x-icon";

        event.respondWith(new Response(virtualFiles[path], {
            headers: { "Content-Type": type }
        }));
    }
});
