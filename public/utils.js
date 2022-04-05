const $ = (sel) => {
  return document.querySelector(sel);
};

const fetchJSON = async (url) => {
  const resp = await fetch(url);
  return await resp.json();
};

const stripHttp = (url) => {
  return url.replace(/https?:\/\//u, '');
};

export {$, fetchJSON, stripHttp};
