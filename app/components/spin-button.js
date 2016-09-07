import Ember from 'ember';
import createSpinner from 'ember-spin-button/utils/spinner';

const { computed, set, get, isPresent, run } = Ember;

export default Ember.Component.extend({
  tagName: 'button',
  type: 'submit',
  inFlight: false,
  color: 'blue',
  buttonStyle: 'expand-right',

  defaultTimout: 10E3,
  startDelay: 100,

  attributeBindings: [
    'name',
    'type',
    'disabled',
    'spinnerColor:data-spinner-color',
    'color:data-color',
    'buttonStyle:data-style'
  ],

  classNameBindings: ['inFlight:in-flight:ready', ':spin-button'],

  disabled: computed.readOnly('inFlight'),
  spinnerColor: null,
  _timer: null,

  click(evt) {
    evt.preventDefault();
    set(this, 'inFlight', true);
    this.setupSpinner();

    if ('function' === typeof this.attrs.action) {
      let actionResult = this.attrs.action();

      if (isPresent(actionResult) && ('function' === typeof actionResult.finally)) {
        actionResult.finally(() => {
          if (this.isDestroying || this.isDestroyed) {
            return;
          }

          set(this, 'inFlight', false);
        });
      }
    }
  },

  setupSpinner() {
    let element = get(this, 'element');
    if (!this.element) { return; }

    let inFlight = get(this, 'inFlight');

    if (inFlight) {
      if (get(this, 'startDelay') > 4) {
        run.later(this, this.createSpinner, element, get(this, 'startDelay'));
      } else {
        this.createSpinner(element);
      }
    } else {
      this.enable();
    }
  },

  didRender() {
    this._super(...arguments);
    this.setupSpinner();
  },

  createSpinner(element) {
    if (!this._spinner) {
      this._spinner = createSpinner(element);
      this._spinner.spin(element.querySelector('.spin-button-spinner'));
    }

    if (this._timer) { run.cancel(this._timer); }

    let timeout = get(this, 'defaultTimout');

    if (timeout > 4) {
      this._timer = run.later(this, this.enable, timeout);
    }
  },

  enable() {
    if (this._timer) { run.cancel(this._timer); }

    if (this._spinner) {
      this._spinner.stop();
      this._spinner = null;
    }

    if (!this.isDestroyed && !this.isDestroying) {
      set(this, 'inFlight', false);
    }
  },
});
