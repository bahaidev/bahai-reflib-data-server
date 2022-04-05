import {render, html} from '../vendor/uhtml/esm.js';
import {$, fetchJSON} from '../utils.js';

const urlForId = html`
    <fieldset>
      <legend>Go to URL for ID</legend>
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

    location.href = url;
  }} />
      </label>
      <div class="urlForIdResult"></div>
    </fieldset>
`;

export default urlForId;
