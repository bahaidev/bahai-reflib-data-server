import {render, html} from '../vendor/uhtml/esm.js';
import {$, stripHttp, fetchJSON} from '../utils.js';

const fullInfoForUrl = html`
    <fieldset>
      <legend>Get full info for URL</legend>
      <label>
        <input class="chooseURL" type="url" size="80" onchange=${async (e) => {
    const url = e.target.value;

    const info = await fetchJSON(
      `./fullInfoForUrl?url=${encodeURIComponent(url)}`
    );

    if (!info) {
      render($('.fullInfoForUrlResult'), html`<b>Not found</b>`);
      return;
    }

    const {
      paragraph,
      // section,
      // work,
      // subSectionParentUrl,
      subSectionUrl,
      subSectionTitle,
      // subSectionId,
      // mainSectionParentUrl,
      // mainSectionUrl,
      mainSectionTitle,
      // mainSectionId,
      // workParentUrl,
      workUrl
      // workTitle
    } = info;

    /*
    <li><b>ID</b>: ${id}</li>
    <li><b>Title</b>: ${title || '(None)'}</li>
    <li><b>Parent URL</b>:
      <a href="${parentUrl}">${stripHttp(parentUrl)}</a>
    </li>
     */

    render($('.fullInfoForUrlResult'), html`
      <ul>
        <li><b>Template</b>:
          <input size="80" ref="${(el) => {
    // Use uhtml feature to avoid being interpreted as template problems
    el.value = `{{${(paragraph
      ? [
        mainSectionTitle, subSectionTitle, paragraph
      ]
      : [
        mainSectionTitle, subSectionTitle
      ]).join('|')}}}`;
  }}" />
        </li>
        <li><b>Work URL</b>:
          <a href="${workUrl}">${stripHttp(workUrl)}</a>
        </li>
        <li><b>Subsection URL</b>:
          <a href="${subSectionUrl}">${stripHttp(subSectionUrl)}</a>
        </li>
        ${paragraph
    ? html`<li><b>Paragraph</b>:
      <a href="${url}">${paragraph}</a>
    </li>`
    : ''
}
      </ul>
      `);
  }} />
      </label>
      <div class="fullInfoForUrlResult"></div>
    </fieldset>
`;

export default fullInfoForUrl;
