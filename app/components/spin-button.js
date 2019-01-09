import Ember from 'ember';
import createSpinner from 'ember-spin-button/utils/spinner';

const { computed, set, get, isPresent, run } = Ember;

export default Ember.Component.extend({
  tagName: 'button',
  type: 'submit',
  inFlight: false,
  color: 'blue',
  buttonStyle: 'expand-right',

  startDelay: 100,

  attributeBindings: [
    'name',
    'type',
    '_disabled:disabled',
    'spinnerColor:data-spinner-color',
    'color:data-color',
    'buttonStyle:data-style'
  ],

  classNameBindings: ['inFlight:in-flight:ready', ':spin-button'],
  disabled: false,
  spinnerColor: null,

  _timer: null,

  _disabled: computed('inFlight', 'disabled', function() {
    return get(this, 'inFlight') || get(this, 'disabled');
  }).readOnly(),

  click(evt) {
    evt.preventDefault();

    if (this.attrs && 'function' === typeof this.attrs.action) {
      this.attrs.action();
    } else {
      this.sendAction('action');
    }
  },

  didInsertElement() {
    this._super(...arguments);

    if (!this._spinner) {
      this._spinner = createSpinner(get(this, 'element'));
    }
  },

  didReceiveAttrs() {
    this._super(...arguments);

    this._timer = run.scheduleOnce('afterRender', this, this.stateChanged);
  },

  stateChanged() {
    let inFlight = get(this, 'inFlight');

    if (!inFlight && this._spinner) {
      this.stopSpinner();
    } else {
      let element = get(this, 'element');

      if (!this._spinner) {
        this._spinner = createSpinner(element);
      }

      this._spinner.spin(element.querySelector('.spin-button-spinner'));
    }
  },

  stopSpinner() {
    if (this._timer) {
      run.cancel(this._timer);
    }

    if (this._spinner) {
      this._spinner.stop();
      this._spinner = null;
    }
  }
});
