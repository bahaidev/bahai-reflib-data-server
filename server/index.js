import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';

/**
* @returns {ExpressApp}
*/
function createServer () {
  const app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  routes(app); // register the routes

  return app;
}

export default createServer;
