import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';

/**
 * @param {object} cfg
 * @param {string} cfg.statik
 * @param {object} cfg.statikOptions
 * @returns {ExpressApp}
 */
function createServer ({
  statik, statikOptions
} = {}) {
  const app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  if (statik) {
    app.use(express.static(statik, statikOptions));
  }

  routes(app); // register the routes

  return app;
}

export default createServer;
