import '../components/fetch-select.js';
import '../components/form-control-steps.js';
import {html, render} from '../vendor/uhtml/esm.js';

/**
 * @returns {string}
 */
function sectionsForWorkURL () {
  return './sectionIdAndNameForWork?work=' + encodeURIComponent(this.work);
}

/**
* @typedef {(url) => Promise<JSON>} JsonFetcher
*/

/**
 * @param {JsonFetcher} customFetch
 * @returns {(string) => Promise<{json: () => Promise<JSON>}>}
 */
function wrapJSONFetch (customFetch) {
  return (url) => ({
    async json () {
      return await customFetch(url);
    }
  });
}

/**
 * @param {HTMLElement} slot
 * @param {string} message
 * @param {string} hideSelector
 * @returns {void}
 */
function displayError (slot, message, hideSelector = 'fetch-select') {
  const errorDisplay = slot.querySelector('.errorDisplay');

  // Hide current select; subsequent should already be hidden
  slot.querySelector(hideSelector).style.display = 'none';
  // But ensure our slot is showing
  slot.style.display = 'initial';

  render(errorDisplay, html`
    <b>${message} Try to refresh upon a good connection.</b>
  `);
}

/**
 * @param {Event} e
 * @param {Element} e.target
 * @returns {void}
 */
function badLoadWorks ({target}) {
  displayError(target.parentNode, 'Works did not load.');
}

/**
 * @param {{
 *   workNamesFetch: JsonFetcher,
 *   setupSectionFetch: JsonFetcher,
 *   paragraphsForSectionIdFetch: JsonFetcher,
 *   urlForIdFetch: JsonFetcher,
 *   idForWorkSectionAndParagraphFetch: JsonFetcher,
 *   subsectionUrlForWorkFetch: JsonFetcher,
 *   urlForWorkFetch: JsonFetcher,
 *   redirectHandler: (string) => void
 * }} obj
 * @returns {ChooseWorkSectionParagraph}
 */
function setChooseWorkSectionParagraph ({
  workNamesFetch, setupSectionFetch, paragraphsForSectionIdFetch,
  urlForIdFetch, idForWorkSectionAndParagraphFetch,
  subsectionUrlForWorkFetch, urlForWorkFetch, redirectHandler
} = {}) {
  const redirector = redirectHandler || ((str) => {
    location.href = str;
  });
  /**
   *
   */
  class ChooseWorkSectionParagraph extends HTMLElement {
    /**
     * @returns {void}
     */
    static get observedAttributes () {
      return ['work', 'sectionsForWorkURL'];
    }

    /**
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     * @returns {void}
     */
    attributeChangedCallback (name, oldValue, newValue) {
      this[name] = newValue;
    }

    /**
     *
     */
    constructor () {
      super();

      this.work = '';

      this.attachShadow({mode: 'open'});

      this.updateRendering();
    }

    /**
     * @returns {void}
     */
    updateRendering () {
      render(this.shadowRoot, this.template());
    }

    /**
     * @returns {Hole}
     */
    template () {
      const chooseWork = html`<fetch-select
        class="chooseWork"
        url="./workNames">
        <option value="">(Choose work)</option>
      </fetch-select>`;
      const chooseWorkContainer = document.createElement('div');
      render(chooseWorkContainer, chooseWork);

      const chooseSection = html`<fetch-select class="chooseSection"
          url="">
        <option value="">(Choose section)</option>
      </fetch-select>`;
      const chooseSectionContainer = document.createElement('div');
      render(chooseSectionContainer, chooseSection);

      if (workNamesFetch) {
        chooseWorkContainer.firstElementChild.customFetch =
          wrapJSONFetch(workNamesFetch);
      }
      if (setupSectionFetch) {
        chooseSectionContainer.firstElementChild.customFetch =
          wrapJSONFetch(setupSectionFetch);
      }

      return html`
      <div>
        <form-control-steps default-trigger="change">
          <label slot="step" data-default="true"
            onmissing-options="${badLoadWorks}">
            <div class="errorDisplay"></div>
            ${chooseWorkContainer.firstElementChild}
          </label>

          <label slot="step" ontrigger-step=${this.setupSection.bind(this)}
            onmissing-options="${this.noSectionsForWork.bind(this)}">
            <div class="errorDisplay"></div>
            ${chooseSectionContainer.firstElementChild}
          </label>

          <label slot="step"
            ontrigger-step=${this.setupParagraph.bind(this)}
            trigger="id-display">
            <div class="errorDisplay"></div>
            <datalist id="paragraphChoices"></datalist>
            <input size="30" list="paragraphChoices"
              onchange=${this.redirectOrDisplay.bind(this)}
              class="chooseParagraph"
              placeholder="Paragraph number, e.g., &quot;5&quot;" />
          </label>

          <label slot="step" ontrigger-step=${this.setupIDDisplay.bind(this)}>
            <div class="errorDisplay"></div>
            <div class="idDisplay"></div>
          </label>
        </form-control-steps>
      </div>
      `;
    }

    /**
     * @param {Event} ev
     * @param {Element} ev.detail
     * @param {Element} ev.target
     * @returns {Promise<void>}
     */
    async setupSection ({detail, target}) {
      this.work = detail.value;
      const fetchSelect = target.querySelector('fetch-select');
      fetchSelect.url = sectionsForWorkURL.call(this);

      const ok = await fetchSelect.update();
      if (!ok) {
        // Errors handled in `noSectionsForWork` by triggered event
        return;
      }
      target.style.display = 'initial';
    }

    /**
     * @param {Event} ev
     * @param {Element} ev.detail
     * @param {Element} ev.target
     * @returns {Promise<void>}
     */
    async setupParagraph ({detail, target}) {
      this.section = detail.selectedOption.textContent;
      this.sectionID = detail.value;
      // Could instead do a URL-driven input box like we do for
      //   URL-driving select
      const {sectionID} = this;
      const paragraphs = await (await (
        paragraphsForSectionIdFetch
          ? wrapJSONFetch(paragraphsForSectionIdFetch)
          : fetch
      )(
        `paragraphsForSectionId?${new URLSearchParams({
          id: sectionID
        })}`
      )).json();
      if (!paragraphs.length) {
        const url = await (await (
          urlForIdFetch
            ? wrapJSONFetch(urlForIdFetch)
            : fetch
        )(
          `urlForId?${new URLSearchParams({
            id: sectionID
          })}`
        )).json();
        if (!url) {
          displayError(
            target.parentNode,
            'No URL found despite this having a work and section.',
            'input'
          );
          return;
        }
        redirector(url);
        return;
      }

      target.style.display = 'initial';
      const paragraphChoices = target.querySelector(
        'datalist#paragraphChoices'
      );
      render(paragraphChoices, html`
        ${paragraphs.map((paragraph) => {
    return html`<option>${paragraph}</option>`;
  })}
      `);
    }

    /**
     * @param {Event} e
     * @returns {Promise<void>}
     */
    async redirectOrDisplay (e) {
      const {target} = e;
      const {work, section} = this;
      const paragraph = target.value;

      const resp = await (
        idForWorkSectionAndParagraphFetch
          ? wrapJSONFetch(idForWorkSectionAndParagraphFetch)
          : fetch
      )(
        `./idForWorkSectionAndParagraph?${new URLSearchParams({
          work,
          section,
          paragraph
        })}`
      );
      const id = await resp.json();
      if (!id) {
        displayError(
          target.parentNode,
          'No id found for work section and paragraph.',
          'input'
        );
        return;
      }

      const redirect = this.hasAttribute('redirect');
      if (redirect) {
        redirector(`https://bahai.org/r/${id}`);
      } else {
        this.id = id;
        target.parentNode.dispatchEvent(new Event('id-display'));
        e.preventDefault();
      }
    }

    /**
     * @param {Event} e
     * @param {Element} e.target
     * @returns {void}
     */
    setupIDDisplay ({target}) {
      const idDisplay = target.querySelector('.idDisplay');

      const {id} = this;
      render(idDisplay, html`
        <b>ID</b>: <a href=${`https://bahai.org/r/${id}`}>${id}</a>
      `);
      target.style.display = 'initial';
    }

    /**
     * @param {Event} e
     * @param {Element} e.target
     * @returns {Promise<void>}
     */
    async noSectionsForWork ({target}) {
      let url = await (
        await (
          subsectionUrlForWorkFetch
            ? wrapJSONFetch(subsectionUrlForWorkFetch)
            : fetch
        )(`./subsectionUrlForWork?${new URLSearchParams({
          work: this.work
        })}`)
      ).json();

      if (!url) {
        url = await (
          await (
            urlForWorkFetch
              ? wrapJSONFetch(urlForWorkFetch)
              : fetch
          )(`./urlForWork?${new URLSearchParams({
            work: this.work
          })}`)
        ).json();
      }

      if (!url) {
        displayError(target.parentNode, 'No URL found for work.');
        return;
      }

      redirector(url);
    }
  }

  customElements.define(
    'choose-work-section-paragraph', ChooseWorkSectionParagraph
  );

  return ChooseWorkSectionParagraph;
}

export default setChooseWorkSectionParagraph;
