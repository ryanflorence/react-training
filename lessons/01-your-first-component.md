Your First Component
====================

[Demo](http://rpflorence.github.io/react-training/code/ContentToggler)
[Code](../code/ContentToggler)

React is just a view layer. Everything in React is a component. You can
think of these as web components, Ember components, or Angular
directives. They simply represent a section of your UI.

Rendering UI
------------

First, we'll just render a div into the document body:

```js
React.render(<div>this is dumb</div>, document.body);
```

Components are just functions, so we could do this without that freaky
JSX like so:

```js
var div = React.DOM.div;
React.render(div({}, 'this is dumb'), document.body);
```

Lets create our first component and render it to the page:

```js
var App = React.createClass({
  render: function() {
    return (
      <div className="App">
        <h1>Hello!</h1>
      </div>
    );
  }
});

React.render(<App/>, document.body);
```

**Note**: You must always return a root element from the `render`
method. If you get weird errors this is probably why.

Now lets create a content toggle component. When you click the summary,
the details will expand or contract.

In React, your top-level `App` component and small UI controls are all
components. There is no distinction between components, controllers,
views, directives, etc.

```js
var ContentToggle = React.createClass({

  render: function() {
    return (
      <div className="ContentToggle">
        I am a ContentToggle
      </div>
    );
  }

});
```

Now, to use this in `App`, we simply add it to the render method.

```js
var App = React.createClass({

  render: function() {
    return (
      <div className="App">
        <h1>Hello!</h1>
        <ContentToggle/>
      </div>
    );
  }

});
```

And finally, render it into the document:

```js
React.render(<App/>, document.body);
```

Props
-----

So far our `ContentToggle` is pretty useless. Lets allow the user to
supply some content to render by using `props`.

```js
var ContentToggle = React.createClass({

  render: function() {
    return (
      <div className="ContentToggle">
        <div className="ContentToggle__Summary">{this.props.summary}</div>
        <div className="ContentToggle__Details">{this.props.children}</div>
      </div>
    );
  }

});
```

Usage:

```xml
<ContentToggle summary="Tacos">
  <p>Everybody should eat tacos.</p>
</ContentToggle>
```

Properties are passed in just like HTML attributes. You access the
children nested in the component on `this.props.children`; this
is like `{{yield}}` in Ember or Angular's `ng-transclude`.

Note the `{curlies}`. When you're in JSX, this is how you bust back out
into JavaScript. So you've got JavaScript in your XML in your JavaScript
and you'll most likely love it soon but hate it right now.

Event Handlers
--------------

We want to click the summary and have the details toggle it's
visibility.  React uses `camelCase` names for event handlers declared on the
element itself: `onClick`, not `onclick`.

```js
var ContentToggle = React.createClass({

  handleClick: function(event) {
    console.log('soo ... now what?');
  },

  render: function() {
    return (
      <div className="ContentToggle">
        <div onClick={this.handleClick} className="ContentToggle__Summary">
          {this.props.summary}
        </div>
        <div className="ContentToggle__Details">
          {this.props.children}
        </div>
      </div>
    );
  }

});
```

State
-----

In React, the state of your component is restricted to the values on
`this.state`. Whenever you change state, your component will re-render.

Your component won't actually re-render everything to the DOM, but it
will re-render to a virtual DOM. It then compares this new virtual DOM
to the previous one. The resulting diff is the smallest set of
operations to apply to the real DOM.

We'll use state to manage the visibility of our details view.

```js
var ContentToggle = React.createClass({

  // lifecycle hook to get initial state and declare what
  // state you'll be managing in this component
  getInitialState: function() {
    return {
      showDetails: false
    };
  },

  handleClick: function(event) {
    this.setState({
      showDetails: !this.state.showDetails
    });
  },

  render: function() {
    var details = this.state.showDetails ? this.props.children : null;

    return (
      <div className="ContentToggle">
        <div onClick={this.handleClick} className="ContentToggle__Summary">
          {this.props.summary}
        </div>
        <div className="ContentToggle__Details">
          {details}
        </div>
      </div>
    );
  }

});
```

"Always Re-render" Model
------------------------

You hear the term "always re-render" in React. Instead of initializing a
view and then observing values as they change over time (a difficult
mental model as more things start happening in your views), in your
render method you get to pretend like this is the first and only time
you're ever rendering. Or, you can think of it like stateless
server-side rendering like you do in Rails or PHP.

Let's add some classes to our elements to see if we can get a feel for
what this means.

```js
var ContentToggle = React.createClass({

  // ...

  render: function() {
    var details;
    var summaryClassName = 'ContentToggle__Summary';

    if (this.state.showDetails) {
      details = this.props.children;
      summaryClassName += ' ContentToggle__Summary--open';
    }

    return (
      <div className="ContentToggle">
        <div onClick={this.handleClick} className={summaryClassName}>
          {this.props.summary}
        </div>
        <div className="ContentToggle__Details">
          {details}
        </div>
      </div>
    );
  }

});
```

Rather than observing state over time, we just consider the current
state and build up our `className`. There is no adding or removing, just
building. Again, its the same mental model as server rendering. You
don't observe fields in the database and then change the HTML a route
will render, you just render the data as it is right now.

When you first look at these render methods coming from other view
libraries it seems ... well, terrible. But it doesn't take long to enjoy
the simple mental model and ability to express your UI wherever it makes
sense.

Managing Focus and Refs
-----------------------

To make this accessible, we need to manage focus. First we simply add
`tabIndex="0"` to the summary to make it tabbable and `tabIndex="-1"` to
the details so we can programmatically focus it. But, the real task is
to go focus the details when it expands.

In order to do this we need to access the the details element. Instead
of relying on DOM traversal like `this.$()` from Ember or the `element`
api in an Angular directive, to get at our elements React uses `refs`.

Refs are sort of like element IDs but scoped to the component that owns
the ref.

```js
var ContentToggle = React.createClass({

  // ...

  handleClick: function(event) {
    this.setState({
      showDetails: !this.state.showDetails
    });
    this.refs.details.getDOMNode().focus();
  },

  render: function() {

    // ...

    return (
      <div className="ContentToggle">
        <div tabIndex="0" onClick={this.handleClick} className={summaryClassName}>
          {this.props.summary}
        </div>
        <div ref="details" tabIndex="-1" className="ContentToggle__Details">
          {details}
        </div>
      </div>
    );
  }

});
```

Note the `ref="details"` and then accessing it in `handleClick` with
`this.refs.details`. Finally, to get at the actual DOM node, you call
`getDOMNode()` on a ref.

We are fortunate that `refs.details` is always rendered. If the element
you need to focus is not going to be rendered until React is done with
its next render cycle from calling `setState`, focus the element in the
`setState` callback.

```js
this.setState(someState, this.focusSomething);
```

Homework
-----------------

Right now only clicking will toggle the details. Add keyboard support so
that `enter` and `space` will too.

