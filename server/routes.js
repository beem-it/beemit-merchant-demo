const Router = require('koa-router')
const axios = require('axios');
const config = require('./config');
const AuthTokenHelper = require('./auth-token-helper');

const router = new Router();

const authTokenHelper = new AuthTokenHelper({
  tokenUrl: `${config.AUTH_URL}/connect/token`,
  clientId: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  scope: config.SCOPES,
  token: config.TOKEN,
});

const client = async () => {
  const bearerToken = `Bearer ${await authTokenHelper.getAccessToken()}`;
  return axios.create({
    baseURL: config.MERCHANT_API_URL,
    headers: {
      authorization: bearerToken
    }
  });
}

router.get('/', (ctx) => {
  ctx.render('index');
});

router.post('/orders', async (ctx) =>  {
  try {
    const authenticatedClient = await client();
    const response = await authenticatedClient.post('/v1/orders', ctx.request.body);
    ctx.status = 200;
    ctx.body = response.data;
  } catch(error) {
    ctx.status = 500;
    ctx.body = {error: 'Internal Server Error'};
  }
});

router.get('/orders/:order_id', async (ctx) =>  {
  try {
    const authenticatedClient = await client();
    const response = await authenticatedClient.get(`/v1/orders/${ctx.params.order_id}`);
    ctx.status = 200;
    ctx.body = response.data;
  } catch(error) {
    ctx.status = 500;
    ctx.body = {error: 'Internal Server Error'};
  }
});

//export default router;
module.exports = router;
