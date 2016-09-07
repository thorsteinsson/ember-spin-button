import Ember from 'ember';
import createSpinner from 'ember-spin-button/utils/spinner';

const { set, get, isPresent, run } = Ember;

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
    'color:data-color',
    'buttonStyle:data-style'
  ],

  classNameBindings: ['inFlight:in-flight:ready', ':spin-button'],

  _timer: null,

  click(evt) {
    evt.preventDefault();
    set(this, 'inFlight', true);

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

  didRender() {
    this._super(...arguments);

    let element = get(this, 'element');
    let inFlight = get(this, 'inFlight');

    if (inFlight) {
      if (get(this, 'startDelay') > 4) {
        run.later(this, this.createSpinner, element, get(this, 'startDelay'));
      } else {
        this.createSpinner(element);
      }
    } else {
      this.setEnabled();
    }
  },

  createSpinner(element) {
    if (!this._spinner) {
      this._spinner = createSpinner(element);
      this._spinner.spin(element.querySelector('.spin-button-spinner'));
    }

    if (this._timer) { run.cancel(this._timer); }

    let timeout = get(this, 'defaultTimout');

    if (timeout > 4) {
      this._timer = run.later(this, this.setEnabled, timeout);
    }
  },

  disabled: Ember.computed.readOnly('inFlight'),

  setEnabled() {
    if (this._timer) { run.cancel(this._timer); }

    if (this._spinner) {
      this._spinner.stop();
      this._spinner = null;
    }

    if (!get(this, 'isDestroyed')) {
      this.setProperties({
        inFlight: false
      });
    }
  },
});
