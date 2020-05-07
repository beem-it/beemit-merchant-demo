const app = require('./app');
const config = require('./config');

app.listen(config.PORT, () => {
  console.log('BeemIt Store Started on port 8081');
});
