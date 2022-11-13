const app = require('./app');
const connection = require('./db');

const port = process.env.PORT || 3000;

connection.on('open', () => {
  app.listen(port, () => {
    console.log(`Starting listening on port ${port}`);
  });
});

connection.on('error', (error) => {
  console.log(error);
});
