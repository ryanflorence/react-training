/** @jsx React.DOM */

// maybe the best test framework ever?
function equal(a, b, description) {
  if (a === b) {
    console.log('%c✔︎ ok', 'color: green', description);
  }
  else {
    console.log('%c✘ not ok', 'color: red', description);
    console.assert(a === b, description);
  }
}

var TestUtils = React.addons.TestUtils;
var wrapper = document.getElementById('test-wrapper');

// render a component to test
var component = React.renderComponent((
  <ContentToggle summary="i am the summary">
    I am the content
  </ContentToggle>
), wrapper);

// get the details DOM node
var details = component.refs.details.getDOMNode();

// assert
equal(details.innerHTML.trim(), '',
  'details are hidden by default');

// simulate an action on summary
var Simulate = TestUtils.Simulate;
var summary = component.getDOMNode().querySelector('.ContentToggle__Summary');

// simulate a click
Simulate.click(summary);

// assert
equal(details.innerHTML.trim(), 'I am the content',
  'details are shown when summary is clicked');
equal(document.activeElement, details,
  '"details" gets focus when open');

// simulate again to see if it closes
Simulate.click(summary);
equal(details.innerHTML.trim(), '',
  'details are hidden when summary is clicked');

// unmount the component
React.unmountComponentAtNode(wrapper);

