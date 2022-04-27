import {html, render} from '../vendor/uhtml/esm.js';

/**
 *
 */
class FormControlSteps extends HTMLElement {
  /**
   *
   */
  constructor () {
    super();

    this.attachShadow({mode: 'open'});
  }

  /**
   * @returns {void}
   */
  connectedCallback () {
    const steps = [...this.querySelectorAll('[slot=step]')];
    steps.forEach((step, i) => {
      const ev = step.getAttribute('trigger') ||
        this.getAttribute('default-trigger');
      step.addEventListener(ev, ({target}) => {
        // Todo: Check instead whether the form control is valid
        // if (!target.value) {
        //   return;
        // }
        const nextStep = steps[i + 1];
        if (!nextStep) {
          return;
        }

        // Besides requiring extra logic, this was too difficult on the
        //  instances to control the timing of display especially async;
        //  they can instead listen for the trigger and act as they wish
        /*
        // Avoid flickering; we don't want to temporarily show if a
        //   triggering event is going to hide shortly after
        nextStep.triggering = true;
        requestAnimationFrame(() => {
          if (!nextStep.squelched) {
            nextStep.style.display = 'initial';
          }
          nextStep.squelched = false;
          nextStep.triggering = false;
        });
        */

        // If earlier one reactivated ensure the others are hidden
        steps.slice(i + 1).forEach((futureStep) => {
          futureStep.style.display = 'none';
        });

        const e = new CustomEvent('trigger-step', {
          detail: target
        });
        nextStep.dispatchEvent(e);
      }, true);
    });

    this.steps = steps;
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
        <style>
          /* Todo: Figure out why not working? */
          ::slotted(*) {
            /* not apparently working */
            font-size: 30pt;
            background-color: yellow;
          }
          :not(::slotted([data-default])) {
            display: none;
          }

          :host label[data-default] {
            /* background-color: red; */
          }
          :host label:not([data-default]) {
            display: none;
            /* background-color: blue; */
          }
        </style>

        ${this.steps}
      </div>
    `;
  }
}

customElements.define('form-control-steps', FormControlSteps);

export default FormControlSteps;
