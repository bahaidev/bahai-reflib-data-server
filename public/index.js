import {render, html} from './vendor/uhtml/esm.js';

import setChooseWorkSectionParagraph from
  './views/set-choose-work-section-paragraph.js';

import workSectionAndParagraphForId from
  './templates/workSectionAndParagraphForId.js';
import fullInfoForUrl from
  './templates/fullInfoForUrl.js';
import infoForUrl from
  './templates/infoForUrl.js';
import infoForId from
  './templates/infoForId.js';
import idForUrl from
  './templates/idForUrl.js';
import urlForId from
  './templates/urlForId.js';
import gotoUrlForId from
  './templates/gotoUrlForId.js';

import * as apiUrls from './apiUrls.js';

setChooseWorkSectionParagraph();

render(document.body, html`
  <main>

    <h2>Go to paragraph OR Get info for
      <a href="https://bahai.org/library">Bahai.org/library</a> data
    </h2>

    <!--idForWorkSectionAndParagraph -->
    <fieldset>
      <legend>Visits page based on work, section, and paragraph</legend>
      <choose-work-section-paragraph redirect local-fetch>
      </choose-work-section-paragraph>
    </fieldset>

    <!--idForWorkSectionAndParagraph -->
    <fieldset>
      <legend>Get ID for work, section, and paragraph</legend>
      <choose-work-section-paragraph></choose-work-section-paragraph>
    </fieldset>

    ${workSectionAndParagraphForId}

    ${infoForUrl}

    ${fullInfoForUrl}

    ${infoForId}

    ${idForUrl}

    ${urlForId}

    ${gotoUrlForId}

    <h3>API URLs<small>*</small></h3>

    <ul>
      ${Object.entries(apiUrls).map(([apiName, apiURL]) => {
    return html`
      <li><b>${apiName}</b>: ${apiURL}</li>
    `;
  })}
      <li><b>Note</b>: you can also get a URL for ID by directly using
        https://bahai.org/r/%s</li>
    </ul>

    <p>* Substitute <code>%s</code> with your query.
    You may also append <code>&amp;language=&lt;lang></code> to confine
    to a given language (currently "fa" or "en")</p>

  </main>
`);
