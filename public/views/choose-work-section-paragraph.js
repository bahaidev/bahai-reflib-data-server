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
 * @param {HTMLElement} slot
 * @param {string} message
 * @param {string} hideSelector
 * @returns {void}
 */
function displayError (slot, message, hideSelector = 'fetch-select') {
  const b = document.createElement('b');
  b.textContent = message +
    ' Try to refresh upon a good connection.';
  const errorDisplay = slot.querySelector('.errorDisplay');

  // Hide current select; subsequent should already be hidden
  slot.querySelector(hideSelector).style.display = 'none';
  // But ensure our slot is showing
  slot.style.display = 'initial';

  errorDisplay.textContent = '';
  errorDisplay.append(b);
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
    return html`
    <div>
      <form-control-steps default-trigger="change">
        <label slot="step" data-default="true"
          onmissing-options="${badLoadWorks}">
          <div class="errorDisplay"></div>
          <fetch-select class="chooseWork" url="./workNames">
            <option value="">(Choose work)</option>
          </fetch-select>
        </label>

        <label slot="step" ontrigger-step=${this.setupSection.bind(this)}
          onmissing-options="${this.noSectionsForWork.bind(this)}">
          <div class="errorDisplay"></div>
          <fetch-select class="chooseSection"
              url="">
            <option value="">(Choose section)</option>
          </fetch-select>
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
    const paragraphs = await (await fetch(
      `paragraphsForSectionId?${new URLSearchParams({
        id: sectionID
      })}`
    )).json();
    if (!paragraphs.length) {
      const url = await (await fetch(
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
      location.href = url;
      return;
    }

    target.style.display = 'initial';
    target.querySelector('datalist#paragraphChoices').append(
      ...paragraphs.map((paragraph) => {
        const option = document.createElement('option');
        option.textContent = paragraph;
        return option;
      })
    );
  }

  /**
   * @param {Event} e
   * @returns {Promise<void>}
   */
  async redirectOrDisplay (e) {
    const {target} = e;
    const {work, section} = this;
    const paragraph = target.value;

    const resp = await fetch(
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
      location.href = `https://bahai.org/r/${id}`;
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
    idDisplay.textContent = '';
    const b = document.createElement('b');
    b.textContent = 'ID';
    const a = document.createElement('a');
    const {id} = this;
    a.href = `https://bahai.org/r/${id}`;
    a.textContent = id;
    idDisplay.append(b, `: `, a);
    target.style.display = 'initial';
  }

  /**
   * @param {Event} e
   * @param {Element} e.target
   * @returns {Promise<void>}
   */
  async noSectionsForWork ({target}) {
    let url = await (
      await fetch(`./subsectionUrlForWork?${new URLSearchParams({
        work: this.work
      })}`)
    ).json();

    if (!url) {
      url = await (
        await fetch(`./urlForWork?${new URLSearchParams({
          work: this.work
        })}`)
      ).json();
    }

    if (!url) {
      displayError(target.parentNode, 'No URL found for work.');
      return;
    }

    location.href = url;
  }
}

customElements.define(
  'choose-work-section-paragraph', ChooseWorkSectionParagraph
);

export default ChooseWorkSectionParagraph;
