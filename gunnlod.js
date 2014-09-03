exports.srcDirectory = 'lessons';

// these will be used in the preview
exports.stylesheets = [
  'assets/poole.css'
];

exports.template = function(React, meta, content) {
 return React.DOM.div({className: 'container'}, [
   React.DOM.div({dangerouslySetInnerHTML: {__html: content}})
 ]);
};
