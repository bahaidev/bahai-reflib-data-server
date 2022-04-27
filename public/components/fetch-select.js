import {html, render} from '../vendor/uhtml/esm.js';

/**
 *
 */
class FetchSelect extends HTMLElement {
  /**
   * @returns {void}
   */
  static get observedAttributes () {
    return ['url'];
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
   * @returns {void}
   */
  connectedCallback () {
    // We apparently can't get our slots without shadow DOM, but they need
    //   copying too (?)
    this.update();
  }

  /**
   *
   */
  constructor () {
    super();

    this.url = '';

    Object.defineProperty(this, 'selectedOption', {
      get () {
        const select = this.shadowRoot.querySelector('select');
        return select.options[select.selectedIndex];
      }
    });

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
      <select onchange="${this.change.bind(this)}">
        <slot />
      </select>
    `;
  }

  /**
   * @param {Event} e
   * @returns {void}
   */
  change (e) {
    const ev = new Event('change', {
      bubbles: true,
      // Get out of the shadow DOM
      composed: true
    });
    this.value = e.target.value;
    this.dispatchEvent(ev);
  }

  /**
   * @returns {Promise<boolean>}
   */
  async update () {
    const {url, customFetch} = this;
    if (!url) {
      return false;
    }

    let jsonOptions = [];
    try {
      const resp = await (customFetch ? customFetch(url) : fetch(url));
      jsonOptions = await resp.json();
    } catch (err) {
      // eslint-disable-next-line no-console -- Debugging
      console.error('Erred fetching', err);
      // Continue so can trigger `missing-options` and show errors
      // return false;
    }

    if (!jsonOptions.length) {
      const ev = new Event('missing-options', {
        bubbles: true,
        // Get out of the shadow DOM
        composed: true
      });
      this.dispatchEvent(ev);
      return false;
    }

    const select = this.shadowRoot.querySelector('select');
    render(
      select, html`
      ${
  [...this.querySelectorAll('option')].map((option) => {
    return option.cloneNode(true);
  })
}
      ${
  jsonOptions.sort((a, b) => {
    // Sort so that an underdotted "H" is treated more like an "H"
    const form = 'NFD';
    const normA = (Array.isArray(a) ? a[1] : a).normalize(form);
    const normB = (Array.isArray(b) ? b[1] : b).normalize(form);
    return normA < normB ? -1 : normA > normB ? 1 : 0;
  }).map((jsonOption) => {
    const option = document.createElement('option');
    if (Array.isArray(jsonOption)) {
      option.value = jsonOption[0];
      option.textContent = jsonOption[1];
    } else {
      option.textContent = jsonOption;
    }
    return option;
  })
}
      `
    );
    // console.log('json', jsonOptions, elem.outerHTML);

    return true;
  }
}

customElements.define('fetch-select', FetchSelect);

export default FetchSelect;
