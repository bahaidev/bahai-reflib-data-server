import {render, html} from '../vendor/uhtml/esm.js';
import {$, stripHttp, fetchJSON} from '../utils.js';

const infoForId = html`
    <fieldset>
      <legend>Get info for ID</legend>
      <label>
        <input
          class="chooseIDForInfo" type="url" size="80" onchange=${
  async (e) => {
    const id = e.target.value;
    const info = await fetchJSON(
      `./infoForId?id=${encodeURIComponent(id)}`
    );

    if (!info) {
      render($('.infoForIdResult'), html`<b>Not found</b>`);
      return;
    }

    const {
      parentUrl,
      title,
      url
    } = info;

    render($('.infoForIdResult'), html`
      <ul>
        <li><b>ID</b>: ${id}</li>
        <li><b>Title</b>: ${title || '(None)'}</li>
        <li><b>URL</b>:
          <a href="${url}">${stripHttp(url)}</a>
        </li>
        <li><b>Parent URL</b>:
          <a href="${parentUrl}">${stripHttp(parentUrl)}</a>
        </li>
      </ul>
      `);
  }} />
      </label>
      <div class="infoForIdResult"></div>
    </fieldset>
`;

export default infoForId;
