// Virtual filesystem shared with main page
let virtualFiles = {};

self.addEventListener("message", event => {
    if (event.data.type === "updateFS") {
        virtualFiles = event.data.files;
        // console.log("FS updated", virtualFiles);
    }
});

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);
    const path = url.pathname.slice(1); // remove leading '/'

    // If the file exists in the virtual filesystem, serve it
    if (virtualFiles[path] !== undefined) {
        let type = "text/plain";

        if (path.endsWith(".html")) type = "text/html";
        if (path.endsWith(".css")) type = "text/css";
        if (path.endsWith(".js")) type = "application/javascript";
        if (path.endsWith(".ico")) type = "image/x-icon";
        if (path.endsWith(".png")) type = "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) type = "image/jpeg";

        event.respondWith(
            new Response(virtualFiles[path], {
                headers: { "Content-Type": type }
            })
        );
    }
});
