Wrapping DOM Libs
=================

[Demo](http://rpflorence.github.io/react-training/code/Dialog/)
[Code](../code/Dialog/)

We're not going to get away from DOM libs like jQuery UI or stuff we've
written in Backbone. React handles integrating with dom-centric libraries
incredibly well.

Let's wrap jQuery UI Dialog into a React component to see how it works.

Methodology
-----------

1. DOM libs usually manipulate the DOM
2. React tries to re-render and finds a different DOM than it had last
   time and freaks out
3. We hide the DOM manipulation from React by breaking the rendering tree and then reconnecting around the DOM the lib manipulates.
4. Consumers of our component can stay in React-land.

The Wrong Way
-------------

When you call
`$(el).dialog()`, jQuery will take the element, rip it out of its
context, wrap it in some other elements, and then append it as a direct
child of `body`.

If we did something like this:

```js
var Dialog = React.createClass({
  componentDidMount: function() {
    $(this.getDOMNode()).dialog();
  },

  render: function() {
    return <div>{this.props.children}</div>
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {now: Date.now()};
  },

  componentDidMount: function() {
    setInterval(function() {
      this.setState({now: Date.now()});
    }.bind(this), 1000);
  },

  render: function() {
    return (
      <div>
        <Dialog>
          <div>{this.state.now}</div>
        </Dialog>
      </div>
    );
  }
});
```

As soon as we call `setState` in the interval, React is gonna have a bad
time because the node for the dialog element has been moved and has a bunch
of new elements wrapping it. React only writes to the DOM, it never reads,
so if you change it, it doesn't know what its supposed to do anymore.

Portals
-------

We need a way to stop rendering with React, do the jQuery dialog work,
and then start rendering with React again. Some people call these
"Portals".  You open a portal for React to skip over a bit of old-school
DOM stuff, and then keep going on the other side.

The big trick is rendering nothing and then calling
`React.renderComponent` _inside_ a component.

```js
var Dialog = React.createClass({
  render: function() {
    // don't render anything, this is where we open the portal
    return <div/>;
  },

  componentDidMount: function() {
    var node = this.getDOMNode();

    // do the old-school stuff
    var dialog = $(node).dialog().data('ui-dialog');
  
    // start a new React render tree with our node and the children
    // passed in from above, this is the other side of the portal.
    React.renderComponent(<div>{this.props.children}</div>, node):
  }
});
```

`this.props.children` is the markup we supplied to `<Dialog/>`. Think of
it as `{{yield}}` in Ember or `<div ng-transclude></div>` in Angular.
Normally we'd do `{this.props.children}` in `render` like we did in the broken
code, but this is the
trick: we stop the render tree by rendering an empty `<div/>`, do our
DOM work, and then start rendering again with a new tree in
`componentDidMount`.

Now, when the owner component sets new state, and our dialog re-renders,
React doesn't care or even know that there's a bunch of different DOM
because it went through a portal.

Getting Updates
---------------

This is great, but if we update the children of the dialog, nothing
changes. We need to implement `componentWillReceiveProps` and then
render the children into the node again. This will take a little
refactoring since we're doing the same work in two places now.

```js
var Dialog = React.createClass({
  //...

  componentDidMount: function() {
    // store the node on the `this.node` so we can access elsewhere
    this.node = this.getDOMNode();
    var dialog = $(this.node).dialog().data('ui-dialog');
  
    // moved this code so we can call it in other places
    this.renderDialogContent();
  },

  // add this hook
  componentWillReceiveProps: function(newProps) {
    // its important to pass the new props in
    this.renderDialogContent(newProps);
  },

  renderDialogContent: function(props) {
    // if called from `componentWillReceiveProps`, then we use the new
    // props, otherwise use what we already have.
    props = props || this.props;

    // the code that used to be in `componentDidMount`
    React.renderComponent(<div>{props.children}</div>, this.node):
  }
});
```

Now we'll get updates as the owner component's state changes, and the
`<Dialog/>` consumer doesn't have to even know that jQuery UI is
powering the dialog, or that there is non-react DOM manipulation.

Supplying Options
-----------------

Most DOM libs have a bunch of options you pass in when you initialize
it. We can just pass along any props we get to the dialog, even
functions for the events that the dialog emits.

```js
// use it like this:
<Dialog title="I am a title" onClose={this.handleDialogClose} />

// and then ...
var Dialog = React.createClass({
  // ...

  componentDidMount: function() {
    // ...
    // pass along the options we care about
    var dialog = $(this.node).dialog({
      title: this.props.title,
      close: this.props.onClose
    }).data('ui-dialog');
    // ...
  },

  //...
});
```
You can support as many or as few of the options and events of the
dialog as you want.

Calling Methods on the DOM Lib
------------------------------

This is great, but how do we close it from the owner component, or even
open it? Right now it just opens when we render and that's probably not
what we want.

Use props.

```js
var Dialog = React.createClass({
  // ...

  componentDidMount: function() {
    // ...
    // use `autoOpen` false so it doesn't automatically open and then
    // store the dialog on the component so we can use it elsewhere
    this.dialog = $(this.node).dialog({
      autoOpen: false,
      title: this.props.title,
      close: this.props.onClose
    }).data('ui-dialog');
    // ...
  },

  // ...

  renderDialogContent: function(props) {
    // ...
    React.renderComponent(<div>{props.children}</div>, this.node):

    // after we've rendered the dialog, now we can call methods on it
    // via the props passed in like
    // `<Dialog open={this.state.dialogIsOpen} />`
    if (props.open)
      this.dialog.open();
    else
      this.dialog.close();
  }
});
```

It is in `renderDialogContent` that we manage the state of the DOM lib
based on the props passed in to the component that wraps it.

Cleaning Up
-----------

We can't forget to clean up our mess.

```js
var Dialog = React.createClass({
  // ...

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.node);
    this.dialog.destroy();
  }
});
```

When the React component is destroyed, we need to destroy our dialog as
well.

