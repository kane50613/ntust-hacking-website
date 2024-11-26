import { PGlite } from "@electric-sql/pglite";
import { createServer } from "node:net";
import { fromNodeSocket } from "pg-gateway/node";

const sql = new PGlite("./pg-data");

const server = createServer(async (socket) => {
  await fromNodeSocket(socket, {
    serverVersion: "17 (Magic PGLite Proxy)",
    auth: {
      method: "trust",
    },
    async onStartup() {
      await sql.waitReady;
    },
    async onMessage(data, { isAuthenticated }) {
      if (!isAuthenticated) {
        return;
      }

      return await sql.execProtocolRaw(data);
    },
  });
});

server.listen(1231, () => {
  console.log("Server listening on port 1231");
});
