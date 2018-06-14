/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-spin-button',

  included: function(app) {
    this._super.included && this._super.included.apply(this, arguments);
    let host = this._findHost();
    this.import('node_modules/spin.js/spin.js');
    this.import('vendor/spinner.js', {
      exports: {
        spinner: ['default'],
      },
    });

  },
};
