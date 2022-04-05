import {render, html} from '../vendor/uhtml/esm.js';
import {$, stripHttp, fetchJSON} from '../utils.js';

const infoForUrl = html`
    <fieldset>
      <legend>Get info for URL</legend>
      <label>
        <input class="chooseURL" type="url" size="80" onchange=${async (e) => {
    const url = e.target.value;

    const info = await fetchJSON(
      `./infoForUrl?url=${encodeURIComponent(url)}`
    );

    if (!info) {
      render($('.infoForUrlResult'), html`<b>Not found</b>`);
      return;
    }

    const {
      parentUrl,
      title,
      id
    } = info;

    render($('.infoForUrlResult'), html`
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
      <div class="infoForUrlResult"></div>
    </fieldset>
`;

export default infoForUrl;
