const Router = require('koa-router')
const router = new Router();

router.get('/', (ctx, next) => {
  ctx.render('index');
});

//export default router;
module.exports = router;