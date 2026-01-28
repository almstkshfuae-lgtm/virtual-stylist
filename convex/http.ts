import { httpRouter } from "convex/server";
import { postMessage, getByAuthor, getByAuthorPathSuffix } from "./messages";

const http = httpRouter();

http.route({
  path: "/postMessage",
  method: "POST",
  handler: postMessage,
});

http.route({
  path: "/getMessagesByAuthor",
  method: "GET",
  handler: getByAuthor,
});

http.route({
  pathPrefix: "/getAuthorMessages/",
  method: "GET",
  handler: getByAuthorPathSuffix,
});

export default http;
