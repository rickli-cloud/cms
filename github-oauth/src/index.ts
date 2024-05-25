import { exchangeWebFlowCode } from "@octokit/oauth-methods";
// import helmet from "helmet";
import { STATUS_CODES, createServer } from "node:http";
import { URL, URLSearchParams } from "node:url";

import { AccessLog, Log } from "./log";
import { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, PORT } from "./config";
import { generateScript } from "./loginScript";
import { AddressInfo } from "node:net";
// import { promisify } from "node:util";

// const applyHelmetHeaders = helmet({
//   contentSecurityPolicy: {
//     directives: {
//       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//       "script-src": ["'self'", "'unsafe-inline'"],
//     },
//   },
// });
// const applyHelmetHeadersAsync = promisify(applyHelmetHeaders);

const errorMessage = (code: number) =>
  /*html*/ `<html><head><title>Error ${code}</title></head><body><h1 style="border-bottom: 1px solid currentColor; text-align: center; padding: 10px;">${code} ${STATUS_CODES[code]}</h1></body></html>`;

createServer(async (req, res) => {
  /**
   * TODO:
   * - add Content-Security-Policy to limit domains allowed to communicate with.
   */
  try {
    // await applyHelmetHeadersAsync(req, res); // Messes with window.opener | needs more investigation.

    res.setHeader("Content-Type", "text/html; charset=UTF-8");

    const searchParams = new URLSearchParams(
      new URL("http://localhost" + req.url).search
    );

    const socket = req.socket.address() as AddressInfo;
    AccessLog.info(
      `(${req.socket.remoteFamily}) ${req.socket.remoteAddress}:${req.socket.remotePort} => ${req.method}: (${socket?.family}) ${socket?.address}:${socket?.port}${req.url}`
    );

    if (!searchParams.has("code")) {
      AccessLog.debug(new Error("Request lacks oauth code."));
      res.writeHead(400, STATUS_CODES[400]).end(errorMessage(400));
      return;
    }
    if (!searchParams.has("state")) {
      AccessLog.debug(new Error("Request lacks oauth state."));
      res.writeHead(400, STATUS_CODES[400]).end(errorMessage(400));
      return;
    }

    const code = searchParams.get("code") as string;
    const state = searchParams.get("state") as string;

    const { data } = await exchangeWebFlowCode({
      clientType: "oauth-app",
      clientId: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      code,
    }).catch((err) => {
      AccessLog.error("Error while exchanging web flow code.", err);
      res.writeHead(400, STATUS_CODES[400]).end(errorMessage(400));
      throw err;
    });

    res
      .writeHead(200, STATUS_CODES[200], {})
      .end(generateScript(data.access_token, state));
  } catch (err) {
    Log.warn(err);

    if (!res.headersSent) {
      res.writeHead(500, STATUS_CODES[500]).end(errorMessage(500));
    }
    if (!res.writableEnded) {
      res.end(errorMessage(500));
    }
  }
}).listen(Number(PORT), undefined, undefined, () => {
  Log.info(`Listening on port ${PORT}`);
});
