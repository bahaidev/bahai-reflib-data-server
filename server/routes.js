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
 * @param {string} [basePath=""]
 * @returns {void}
 */
function routes (app, basePath = '') {
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

  const base = '/' + basePath.replace(/(?<nonslash>[^/])$/u, '$<nonslash>/');
  routeMappings.forEach(([route, router]) => {
    app.route(
      base + route
    ).get(router);
  });
}

export default routes;
