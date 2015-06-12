Testing Components
==================

[Demo](http://ryanflorence.github.io/react-training/code/ContentToggler/test-runner.html)
[Code](../code/ContentToggler/tests.js)

Setting up a test for a React component is not really different than
rendering it into your app. Let's test our `ContentToggle` component
from the last lesson.

To illustrate only the concepts that you need for React, we'll not use
any testing frameworks. Instead, we'll make possibly the best JavaScript
test framework you've ever seen:

```js
function equal(a, b, description) {
  if (a === b) {
    console.log('%c✔︎ ok', 'color: green', description);
  }
  else {
    console.log('%c✘ not ok', 'color: red', description);
    console.assert(a === b, description);
  }
}
```

React Test Utilities
--------------------

React has some test utilities we'll be using, docs are here:

http://facebook.github.io/react/docs/test-utils.html

Rendering a Component for Testing
---------------------------------

Rendering components for testing is no different than rendering a
component in your app.

```js
var node = document.getElementById('test-node');
React.render(<ContentToggle/>, node);
```

And then make sure to unmount after each test

```js
React.unmountComponentAtNode(node);
```

React will know it has a component there and unmount it.

React provides a test utility named `renderIntoDocument`. It renders
your component into a detached DOM node, so you won't see it in the
browser as you test, but it makes your tests faster. I don't often use
it because I usually have tests that check if elements receive focus:
you can't assert that unless its in the document. If you need to speed
up your tests though, you can use `renderIntoDocument` for all the tests
that don't assert element focus.

```js
var TestUtils = React.addons.TestUtils;
var wrapper = document.getElementById('test-wrapper');

// render a component to test
var component = React.render((
  <ContentToggle summary="i am the summary">
    I am the content
  </ContentToggle>
), wrapper);

// get the details DOM node
var details = component.refs.details.getDOMNode();

// assert
equal(details.innerHTML.trim(), '',
  'details are hidden by default');
```

That's all you need to start testing a component. Simple stuff.

Simulating Events
-----------------

React's test utilities provide a way to simulate events on your
component, like `click` and `dragEnter`. The utility supports any event
React understands.

Let's simulate some clicks on the summary and assert that the details
display and receive focus.

```js
// simulate an action on summary
var Simulate = TestUtils.Simulate;
var summary = component.getDOMNode().querySelector('.ContentToggle__Summary');

// simulate a click
Simulate.click(summary);

// assert
equal(details.innerHTML.trim(), 'I am the content',
  'details are shown when summary is clicked');

// simulate again to see if it closes
Simulate.click(summary);
equal(details.innerHTML.trim(), '',
  'details are hidden when summary is clicked');

// unmount the component
React.unmountComponentAtNode(wrapper);
```

Pass in Some Props
------------------

One handy thing about React is that every component has the same API:
props. Some components will display differently depending on the props
you pass in. This makes testing various scenarios very easy: simply
render with different props and then make assertions.

Bad Ideas
---------

Try not to make assertions on `component.state` or `component.props`.
The end result of a component is usually the effect on its display, so
assert on the DOM when you can. Asserting on `state` and `props` is
brittle, you could `render: function() { return null; }` and have a
passing test suite and a totally useless component.

Finally, avoid calling methods directly on a component. Simulate events
that exercise the behavior you want to assert. Its rare in React that a
component has a "public" method. If that method takes some input and
returns some output, it sounds like it would be happier living in a
module somewhere else that doesn't even require UI to be tested.

In other words, when testing components, the inputs are properties
passed in and events the component responds to (usually user events);
the output is the display in the DOM. Anything else can probably live
outside the component.

