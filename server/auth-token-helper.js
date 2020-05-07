const qs = require('qs');
const axios = require('axios');
const https = require('https');

class AuthTokenHelper {
  constructor(options) {
    this.options = options;
    this.accessToken = null;
    this.client = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    })
  }

  async getAccessToken() {
    if (!this.accessToken) {
      try {
        const tokenRequestBody = {
          grant_type: 'reference_token',
          client_id: this.options.clientId,
          client_secret: this.options.clientSecret,
          token: this.options.token,
          scope: 'openid merchant.orders.get merchant.orders.create merchant.orders.cancel',
        };

        const { data } = await this.client.post(
          this.options.tokenUrl,
          qs.stringify(tokenRequestBody),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
          }
        );

        this.accessToken = data.access_token;
        this.tokenExpirer((data.expires_in - 300) * 1000);
      } catch (error) {
        throw error;
      }
    }
    return this.accessToken;
  }
  tokenExpirer(interval) {
    setTimeout(() => {
      this.accessToken = null;
    }, interval);
  }
};

module.exports = AuthTokenHelper;
