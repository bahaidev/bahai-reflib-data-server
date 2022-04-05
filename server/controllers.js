import {
  getWorkSectionAndParagraphForId,
  getIdForWorkSectionAndParagraph,
  getInfoForUrl,
  getIdForUrl,
  getInfoForId,
  getUrlForId
} from 'bahai-reflib-data';

const workSectionAndParagraphForId = async (req, res) => {
  const workSectionAndParagraph = await getWorkSectionAndParagraphForId(
    req.query.id
  );
  res.json(workSectionAndParagraph ?? null);
};

const idForWorkSectionAndParagraph = async (req, res) => {
  const {work, section, paragraph} = req.query;
  const id = await getIdForWorkSectionAndParagraph(work, section, paragraph);
  res.json(id ?? null);
};

const infoForUrl = async (req, res) => {
  const info = await getInfoForUrl(req.query.url);
  res.json(info ?? null);
};

const idForUrl = async (req, res) => {
  const id = await getIdForUrl(req.query.url);
  res.json(id ?? null);
};

const infoForId = async (req, res) => {
  const info = await getInfoForId(req.query.id);
  res.json(info ?? null);
};

const urlForId = async (req, res) => {
  const url = await getUrlForId(req.query.id);
  res.json(url ?? null);
};

export {
  workSectionAndParagraphForId,
  idForWorkSectionAndParagraph,
  infoForUrl,
  idForUrl,
  infoForId,
  urlForId
};
