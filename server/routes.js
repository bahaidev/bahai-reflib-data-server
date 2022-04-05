import {
  workSectionAndParagraphForId,
  idForWorkSectionAndParagraph,
  infoForUrl,
  idForUrl,
  infoForId,
  urlForId,
  workNames,
  sectionNamesForWork,
  urlForWork,
  subsectionUrlForWork,
  urlForWorkAndSection,
  paragraphsForWorkAndSection
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
    infoForId,
    workNames,
    sectionNamesForWork,
    urlForWork,
    subsectionUrlForWork,
    urlForWorkAndSection,
    paragraphsForWorkAndSection
  });

  routeMappings.forEach(([route, router]) => {
    app.route('/' + route).get(router);
  });
}

export default routes;
