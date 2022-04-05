import {render, html} from '../vendor/uhtml/esm.js';
import {$, stripHttp, fetchJSON} from '../utils.js';

const idForUrl = html`
    <fieldset>
      <legend>Get ID for URL</legend>
      <label>
        <input class="chooseURLForID" type="url" size="80" onchange=${
  async (e) => {
    const url = e.target.value;

    const id = await fetchJSON(
      `./idForUrl?url=${encodeURIComponent(url)}`
    );

    if (!id) {
      render($('.idForUrlResult'), html`<b>Not found</b>`);
      return;
    }

    render($('.idForUrlResult'), html`
      <ul>
        <li><b>ID</b>: ${id}</li>
        <li><b>URL</b>:
          <a href="${url}">${stripHttp(url)}</a>
        </li>
      </ul>
      `);
  }} />
      </label>
      <div class="idForUrlResult"></div>
    </fieldset>
`;

export default idForUrl;
