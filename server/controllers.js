import {
  getFullInfoForUrl,
  getWorkSectionAndParagraphForId,
  getIdForWorkSectionAndParagraph,
  getInfoForUrl,
  getIdForUrl,
  getInfoForId,
  getUrlForId,
  getWorkNames,
  getSectionNamesForWork,
  getSectionInfoForWork,
  getUrlForWork,
  getSubsectionUrlForWork,
  getUrlForWorkAndSection,
  getParagraphsForWorkAndSection,
  getParagraphsForSectionId
} from 'bahai-reflib-data';

const fullInfoForUrl = async (req, res) => {
  const fullInfo = await getFullInfoForUrl(req.query.url);
  res.json(fullInfo || null);
};

const workSectionAndParagraphForId = async (req, res) => {
  const workSectionAndParagraph = await getWorkSectionAndParagraphForId(
    req.query.id, req.query.language
  );
  res.json(workSectionAndParagraph ?? null);
};

const idForWorkSectionAndParagraph = async (req, res) => {
  const {work, section, paragraph, language} = req.query;
  const id = await getIdForWorkSectionAndParagraph(
    work, section, paragraph, language
  );
  res.json(id ?? null);
};

const infoForUrl = async (req, res) => {
  const info = await getInfoForUrl(req.query.url, req.query.language);
  res.json(info ?? null);
};

const idForUrl = async (req, res) => {
  const id = await getIdForUrl(req.query.url, req.query.language);
  res.json(id ?? null);
};

const infoForId = async (req, res) => {
  const info = await getInfoForId(req.query.id, req.query.language);
  res.json(info ?? null);
};

const urlForId = async (req, res) => {
  const url = await getUrlForId(req.query.id, req.query.language);
  res.json(url ?? null);
};

const workNames = async (req, res) => {
  const namesOfWorks = await getWorkNames(
    req.query.language
  );
  res.json(namesOfWorks ?? []);
};

const sectionNamesForWork = async (req, res) => {
  const sectionNames = await getSectionNamesForWork(
    req.query.work, req.query.language
  );
  res.json(sectionNames || []);
};

const sectionInfoForWork = async (req, res) => {
  const sectionInfos = await getSectionInfoForWork(
    req.query.work, req.query.language
  );
  res.json(sectionInfos || []);
};

const sectionIdAndNameForWork = async (req, res) => {
  const sectionIDs = (await getSectionInfoForWork(
    req.query.work, req.query.language
  )).map(({id, title}) => {
    return [id, title];
  });
  res.json(sectionIDs || []);
};

const urlForWork = async (req, res) => {
  const url = await getUrlForWork(req.query.work, req.query.language);
  res.json(url || null);
};

const subsectionUrlForWork = async (req, res) => {
  const url = await getSubsectionUrlForWork(req.query.work, req.query.language);
  res.json(url || null);
};

const urlForWorkAndSection = async (req, res) => {
  const url = await getUrlForWorkAndSection(
    req.query.work, req.query.section, req.query.language
  );
  res.json(url || null);
};

const paragraphsForWorkAndSection = async (req, res) => {
  const paragraphs = await getParagraphsForWorkAndSection(
    req.query.work, req.query.section, req.query.language
  );
  res.json(paragraphs || []);
};

const paragraphsForSectionId = async (req, res) => {
  const paragraphs = await getParagraphsForSectionId(
    req.query.id, req.query.language
  );
  res.json(paragraphs || []);
};

export {
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
};
