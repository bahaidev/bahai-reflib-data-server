import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';

/**
 * @param {object} cfg
 * @param {string} cfg.statik
 * @param {object} cfg.statikOptions
 * @param {string} cfg.urlRelativePath
 * @param {object} [cfg.app]
 * @returns {ExpressApp}
 */
function createServer ({
  statik, statikOptions, urlRelativePath, app = express()
} = {}) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  if (statik) {
    if (Array.isArray(statik)) {
      statik.forEach((rootDir) => {
        app.use(express.static(rootDir, statikOptions));
      });
    } else {
      app.use(express.static(statik, statikOptions));
    }
  }

  routes(app, urlRelativePath); // register the routes

  return app;
}

export default createServer;
