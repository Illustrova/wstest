const StyleDictionary = require("style-dictionary");

StyleDictionary.registerTransform({
  name: "size/px", // notice: the name is an override of an existing predefined method
  type: "value",
  matcher: function (prop) {
    /* supports both "pixel" and "pixels" */
    return (
      prop &&
      prop.original &&
      prop.original.unit &&
      prop.original.unit.startsWith("pixel")
    );
  },
  transformer: function (prop) {
    return `${prop.value}px`;
  },
});

/* Basic filter to separate typography tokens. It might need tweaking depending on the token data shape */
StyleDictionary.registerFilter({
  name: "isTypography",
  matcher: function (prop) {
    return (
      [
        'fontSize',
        'textDecoration',
        'fontFamily',
        'fontWeight',
        'fontStyle',
        'fontStretch',
        'fontStyleOld',
        'letterSpacing',
        'lineHeight',
        'paragraphIndent',
        'paragraphSpacing',
        'textCase'
      ].indexOf(prop.path[1]) !== -1
    )
    /* return (
      prop.name.startsWith("headline") || prop.name.startsWith("paragraph")
    );
    */
  },
});

module.exports = {
  source: ["./src/tokens/design-tokens.json"],
  platforms: {
    js: {
      transformGroup: "js",
      buildPath: "./src/tokens/dist/",
      transforms: ["size/px", "name/cti/camel"],
      /* We split tokens into separate files - it will be easier to use them this way */
      files: [
        /* Filter and extract typography tokens */
        {
          destination: "typography.js",
          format: "javascript/es6",
          filter: "isTypography",
        },
        /* Filter and extract color tokens*/
        {
          destination: "colors.js",
          format: "javascript/es6",
          filter: {
            type: "color",
          },
        },
      ],
    },
  },
};
