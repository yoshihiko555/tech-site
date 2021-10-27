module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier'
  ],
  plugins: [
    'stylelint-scss',
  ],
  rules: {
    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: ['v-deep'],
    }],
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    'no-invalid-position-at-import-rule': null,
    'no-empty-source': null,
    'declaration-empty-line-before': null,
    'at-rule-name-space-after': null,
  }
}
