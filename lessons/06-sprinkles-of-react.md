Sprinkles of React
==================

One reason we've adopted React is its ability to mix with non-React code
well.

We can use React to update small sections of our UI. Like replacing
actions menus, or small workflows on an existing page.

Using React around other code is no different than using React in a
full-blown React application, except that you unmount it eventually.

Remember, React components are really just functions, we don't need JSX to
call them. We'll need to create a factory before using them though.

```js
var SomeSmallView = React.createFactory(require('my-view'));

$('some').crazy().junk(function() {
  var someElement = $('.something')[0];
  React.render(SomeSmallView(), someElement);

  // When it needs to go away
  React.unmountComponentAtNode(someElement);
});
```

Getting Data In
---------------

When you call `render` multiple times on the same node, React's DOM
diffing still applies. Just call it any time you need to give it new
information from the outside app:

```js
React.render(SomeSmallView({students: ['joe']}), someElement);

// later, when things change
React.render(SomeSmallView({students: ['jane']}), someElement);
```

Getting Data Back Out
---------------------

Your component will no doubt need to tell the surrounding code about
things that are happening. Just pass in functions and then call them in
your component, no different than jQuery UI widget events.

```js
var SomeSmallView = React.createClass({
  handleFormSubmit: function() {
    // get the form data and then call the property
    this.props.onCreateSomething(data);
  },

  render: function() {
    return <form onSubmit={this.handleFormSubmit}/>;
  }
});

// surrounding code defines a handler
function handleCreate(data) {
  // do something with data
}

// pass in the handler
React.render(SomeSmallView({
  onCreateSomething: handleCreate
}), someElement);
```

That's all there is to it.

Iterative Changes
-----------------

Its easy to imagine taking a small workflow on a page and writing it in
React, and then another, and another, and another until a good portion
of the page is in React. At that point, you can start merging the
components into other components until the whole page is a React
application from top to bottom.

For example, the action menu in a row could be converted to React, and
then the whole row, and then the group surrounding the rows, and then
the tool bar controlling the groups.

Using better tech no longer requires big rewrites just to get a new
feature in.
