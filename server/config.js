require('dotenv').config();

module.exports = {
  MERCHANT_API_URL: process.env.BEEMIT_MERCHANT_API_URL,
  PORT: process.env.PORT || 8081,
  CLIENT_ID: process.env.BEEMIT_CLIENT_ID,
  CLIENT_SECRET: process.env.BEEMIT_CLIENT_SECRET,
  SCOPES: process.env.BEEMIT_SCOPES,
  TOKEN: process.env.BEEMIT_TOKEN,
  AUTH_URL: process.env.BEEMIT_AUTH_URL,
};
