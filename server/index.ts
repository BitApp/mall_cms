import nextI18NextMiddleware from "@winstrike/next-i18next-koa/middleware";
import Koa from "koa";
import mount from "koa-mount";
import Router from "koa-router";
import serve from "koa-static";
import nextApp from "next";
import nextI18Next from "../i18n";

const port = process.env.PORT || 3000;

const app = nextApp({
  dev: process.env.NODE_ENV !== "production",
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  // Access to locales for preloading them from client-side i18next
  server.use(mount("/locales", serve("./locales")));

  router.get("*", async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  // Use all of middlewares
  nextI18NextMiddleware(nextI18Next as any).forEach((middleware) => {
    server.use(middleware);
  });

  server.use(router.routes());
  server.listen(port, () => {
    console.info(`> Ready on http://localhost:${port}`);
  });
});
