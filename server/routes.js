import {
  workSectionAndParagraphForId,
  idForWorkSectionAndParagraph,
  infoForUrl,
  idForUrl,
  infoForId,
  urlForId
} from './controllers.js';

/**
 * @param {ExpressApp} app
 * @returns {void}
 */
function routes (app) {
  const routeMappings = Object.entries({
    workSectionAndParagraphForId,
    idForWorkSectionAndParagraph,
    idForUrl,
    infoForUrl,
    urlForId,
    infoForId
  });

  routeMappings.forEach(([route, router]) => {
    app.route('/' + route).get(router);
  });
}

export default routes;
