import {render, html} from '../vendor/uhtml/esm.js';
import {$, fetchJSON} from '../utils.js';

const workSectionAndParagraphForId = html`
<!-- workSectionAndParagraphForId -->
<fieldset>
  <legend>Get work, section, and paragraph for ID</legend>
  <label>
    <input class="chooseID" onchange=${async (e) => {
    const id = e.target.value;
    const href = `https://bahai.org/r/${id}`;

    const info = await fetchJSON(
      `./workSectionAndParagraphForId?id=${encodeURIComponent(id)}`
    );

    if (!info) {
      render($('.workSectionAndParagraphResult'), html`<b>Not found</b>`);
      return;
    }

    const {work, section, paragraph} = info;

    render($('.workSectionAndParagraphResult'), html`
      <ul>
        <li><b>Work</b>: ${work}</li>
        <li><b>Section</b>: ${section === '$main' ? '(Main)' : section}</li>
        <li><b>Paragraph</b>:
          ${paragraph ? html`<a href="${href}">${paragraph}</a>` : '(None)'}
        </li>
      </ul>
`);
  }} />
  </label>
  <div class="workSectionAndParagraphResult"></div>
</fieldset>
`;

export default workSectionAndParagraphForId;
