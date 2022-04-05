import {render, html} from '../vendor/uhtml/esm.js';
import {$, stripHttp, fetchJSON} from '../utils.js';

const urlForId = html`
    <fieldset>
      <legend>Get URL for ID</legend>
      <label>
        <input class="chooseURLForID" type="url" size="80" onchange=${
  async (e) => {
    const id = e.target.value;

    const url = await fetchJSON(
      `./urlForId?id=${encodeURIComponent(id)}`
    );

    if (!url) {
      render($('.urlForIdResult'), html`<b>Not found</b>`);
      return;
    }

    render($('.urlForIdResult'), html`
      <ul>
        <li><b>ID</b>: ${id}</li>
        <li><b>URL</b>:
          <a href="${url}">${stripHttp(url)}</a>
        </li>
      </ul>
      `);
  }} />
      </label>
      <div class="urlForIdResult"></div>
    </fieldset>
`;

export default urlForId;
