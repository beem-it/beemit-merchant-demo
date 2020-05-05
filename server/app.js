const Koa = require('koa');
const router = require('./routes');
const views = require('koa-views');
const path = require('path');
const serve = require('koa-static');
const app = new Koa();

app.use(serve(path.join(__dirname, '../public')));
app.use(views(path.join(__dirname, '../public'), { extension: 'html'}));
app
  .use(router.routes())
  .use(router.allowedMethods());

//export default app;
module.exports = app