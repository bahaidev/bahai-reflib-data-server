import {
  fullInfoForUrl,
  workSectionAndParagraphForId,
  idForWorkSectionAndParagraph,
  infoForUrl,
  idForUrl,
  infoForId,
  urlForId,
  workNames,
  sectionNamesForWork,
  sectionInfoForWork,
  sectionIdAndNameForWork,
  urlForWork,
  subsectionUrlForWork,
  urlForWorkAndSection,
  paragraphsForWorkAndSection,
  paragraphsForSectionId
} from './controllers.js';

/**
 * @param {ExpressApp} app
 * @param {string} [basePath]
 * @returns {void}
 */
function routes (app, basePath = '') {
  const routeMappings = Object.entries({
    fullInfoForUrl,
    workSectionAndParagraphForId,
    idForWorkSectionAndParagraph,
    idForUrl,
    infoForUrl,
    urlForId,
    infoForId,
    workNames,
    sectionNamesForWork,
    sectionInfoForWork,
    sectionIdAndNameForWork,
    urlForWork,
    subsectionUrlForWork,
    urlForWorkAndSection,
    paragraphsForWorkAndSection,
    paragraphsForSectionId
  });

  const base = '/' + basePath.replace(/(?<nonslash>[^/])$/u, '$<nonslash>/');
  routeMappings.forEach(([route, router]) => {
    app.route(
      base + route
    ).get(router);
  });
}

export default routes;
