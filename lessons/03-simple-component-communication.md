Simple Component Communication
==============================

[Demo](http://rpflorence.github.io/react-training/code/AssignmentForm/)
[Code](../code/AssignmentForm/)

In React you can communicate between components with functions passed
from parents to children, and then children call those functions.

First, the DOM
--------------

First, lets consider a regular DOM element.

```js
function doStuff() { alert('hi'); }
var button = document.createElement('button');
button.onClick = doStuff;
```

An event can be added to a native element as a property, and so it is
with React components:

```js
React.renderComponent(<button onClick={doStuff}/>, ...);
```

This works for "custom events" as well. You can supply a function to any
property you want in a component and call it when something of interest
happens.

An Example
----------

Lets consider a "new assignment form" and see how to get its data back
up to the owner component. First we'll just get some stuff on the page.

```js
var AssignmentForm = React.createClass({
  handleSubmit: function(event) {
    // hmm ... 
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <legend>New Assignment</legend>
        <p>
          <label htmlFor="name">Assignment Name</label><br/>
          <input id="name" ref="name"/>
        </p>

        <p>
          <label htmlFor="points">Points Possible</label><br/>
          <input id="points" ref="points"/>
        </p>

        <p>
          <button type="submit">Create</button>
        </p>
      </form>
    );
  }
});
```

And then the app that uses it:

```js
// not really relevant to what we're talking about ...
var AssignmentList = React.createClass({
  render: function() {
    var assignments = this.props.assignments.map(function(assignment) {
      return <li key={assignment.id}>
        {assignment.name} - {assignment.points} points
      </li>;
    });
    return <ul>{assignments}</ul>;
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {assignments: [] };
  },

  render: function() {
    return (
      <div>
        <h1>Assignment Form</h1>

        {/* okay, here it is */}
        <AssignmentForm />

        <AssignmentList assignments={this.state.assignments}/>
      </div>
    );
  }
});
```

Custom Events
-------------

We need a way to tell `App` that the assignment has been created by the
user so we can add it to `this.state.assignments`. Remember, components
are just functions and JSX is simply a way to call them. This means you
can pass anything into the property of a component, including functions.
So, to get the data out of the form, just give it a function.

```js
<AssignmentForm onCreate={this.addAssignment}/>
```

And in context:

```js
var App = React.createClass({

  // ...

  addAssignment: function(assignment) {
    var newAssignments = this.state.assignments.concat([assignment]);
    this.setState({ assignments: newAssignments});
  },

  render: function() {
    return (
      <div>
        <h1>Assignment Form</h1>
        <AssignmentForm onCreate={this.addAssignment}/>
        <AssignmentList assignments={this.state.assignments}/>
      </div>
    );
  }
});
```

Finally, we need to go back to the `AssignmentForm` and call that
function property from `AssignmentForm` when the user submits the form.

```js
<form onSubmit={this.handleSubmit}>
  // ...
</form>
```

```js
var guid = 0;

var AssignmentForm = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var name = this.refs.name.getDOMNode();
    var points = this.refs.points.getDOMNode();

    // call the "custom event" with `this.props.onCreate()`.
    this.props.onCreate({
      id: ++guid,
      name: name.value,
      points: points.value
    });

    this.getDOMNode().reset();
    name.focus();
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <legend>New Assignment</legend>
        <p>
          <label htmlFor="name">Assignment Name</label><br/>
          <input id="name" ref="name"/>
        </p>

        <p>
          <label htmlFor="points">Points Possible</label><br/>
          <input id="points" ref="points"/>
        </p>

        <p>
          <button type="submit">Create</button>
        </p>
      </form>
    );
  }
});
```

PropTypes
---------

This component requires that the developer supplies an `onCreate`
property that is a function. React provides a way for you to help
developers use your component without them having to look up the docs or
irc you with questions.

```js
var AssignmentForm = React.createClass({
  propTypes: {
    onCreate: React.PropTypes.func.isRequired
  },

  // ...
});
```

Now when somebody tries to use this component and they forget to supply
an `onCreate` property, they'll get a warning in the console:

> Warning: Required prop `onCreate` was not specified in
> `AssignmentForm`. Check the render method of `App`.

Or if it's the wrong type:

> Warning: Invalid prop `onCreate` of type `string` supplied to
> `AssignmentForm`, expected `function`. Check the render method of
> `App`.

While they are reading that warning and fixing the code, you can keep
eating lunch. [More on validating props here][props].

  [props]:http://facebook.github.io/react/docs/reusable-components.html#prop-validation
