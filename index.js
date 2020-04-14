const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const koaBody = require("koa-body");
const resizeImage = require("./resize");
app.use(koaBody()).use(router.routes()).use(router.allowedMethods());

const parseNumberParam = (v) => {
  let parsed;
  if (Number.isInteger(v)) {
    return v;
  }
  if (typeof v === "string") {
    parsed = parseInt(v, 10);
  }
  if (Number.isNaN(parsed)) {
    return undefined;
  }
  return parsed;
};

router.get("*", async (ctx, next) => {
  const query = ctx.query;
  const imageUrl = query.url;
  if (imageUrl === undefined) {
    ctx.status = 404;
    await next();
    return;
  }
  const height = parseNumberParam(query.height);
  const width = parseNumberParam(query.width);
  try {
    ctx.body = await resizeImage(imageUrl, { height, width });
  } catch (e) {
    ctx.status = e.status;
  }
  await next();
});

app.listen(5000);
