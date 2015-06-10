Less Simple Communication
=========================

[Demo](http://rpflorence.github.io/react-training/code/SidewaysCommunication/)
[Code](../code/SidewaysCommunication/)

Passing function props from the owner to a component works great when you go just one level. However, when you have to pass the functions down more than one level, your application becomes brittle and difficult to refactor. I call this "drilling holes". When the hierarchy changes, it's error-prone and cumbersome. Refactoring large components requires you to re-drill those holes and change a lot of tests.

Drilling Holes
--------------

Let's illustrate what we're talking about. Recall the code from last time:

```js
var App = React.createClass({
  // ...
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

Its easy to imagine our UI growing and introducing a new `Content` component that now owns the `AssignmentForm`.

```js
var Content = React.createClass({
  render: function() {
    return (
      <div>
        <p>A bunch more stuff to justify this component</p>
        <AssignmentForm onCreate={this.addAssignment}/>
      </div>
    )
  }
});

var App = React.createClass({
  // ...
  render: function() {
    return (
      <div>
        <h1>Assignment Form</h1>
        {/* replaced `<AssignmentForm/>` with `<Content/>` */}
        <Content/>
        <AssignmentList assignments={this.state.assignments}/>
      </div>
    );
  }
});
```

Note `this.addAssignment` in `Content::render`. That method lives on `App`, not `Content`. So to get this data all the way back up to `App` we'd drill a hole, or rather, pass the data up some more:

```js
var Content = React.createClass({
  // ...
  addAssignment: function(assignment) {
    this.props.onCreateAssignment(assignment);
  }
});

// and in App::render
<Content onCreateAssignment={this.addAssignment} />
```

It works ... but it's kind of dumb. Imagine going three or four levels deep
D: We'd also want to add some `propTypes` to `Content` like we did in the
last lesson on `AssignmentForm`.

All of this is cumbersome and discourages refactoring to better code. Every time you move a component around you have to fill in old holes, drill new ones and fix tests.

If you find yourself drilling holes it indicates that you actually have something bigger going on. You are dealing with "application actions" and "application state".

Enter "actions" and "stores".

Actions
-------

Rather than drilling a hole to send data back up the component hierarchy to perform some action, we can just go sideways to an action module.

```js
var AssignmentActions = {
  addAssignment: function(assignment) {
    // do something with the assignment
  }
};
```

Now any component or module can call this action regardless of UI hierarchy.

Since the only use case for an assignment form is to create a new assignment, we can do it there and skip the property passing altogether:

```js
var AssignmentForm = React.createClass({
  // ...

  handleSubmit: function(event) {
    // ...
    AssignmentActions.addAssignment({
      id: ++guid,
      name: name.value,
      points: points.value
    });
    // ...
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* ... */}
      </form>
    );
  }
});
```

That's it for actions. They are super simple. But we need to do something with that assignment data...

Stores
------

Stores hold your data. Here's a really naive store, but it'll work for this miniature app.

```js
var AssignmentStore = {
  _state: {
    assignments: []
  },

  getState: function() {
    return this._state;
  },

  addAssignment: function(assignment) {
    this._state.assignments.push(assignment);
    this.onChange();
  },

  onChange: function() {}
};
```

Really simple. All it can do is return its current state and add an assignment.

Now we have something to do in our action from before:

```js
var AssignmentActions = {
  addAssignment: function(assignment) {
    AssignmentStore.addAssignment(assignment);
  }
};
```

We're almost done. Everything is set up correctly but our `App` component
won't ever know that an assignment has been created. We can assign
`AssignmentStore.onChange` to a method in `App` so it knows when to get
its state from the store again. It's a pretty decent refactor but I think
it'll make sense:

```js
var App = React.createClass({
  getStateFromStore: function() {
    return AssignmentStore.getState();
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  componentDidMount: function() {
    // when the assignment store says its data changed, we update
    AssignmentStore.onChange = this.onChange;
  },

  onChange: function() {
    this.setState(this.getStateFromStore());
  },

  // ...
});
```

The `onChange` is limited to only being assigned once. In a real app we'd want the store to be a real event emitter with the ability for multiple components to subscribe to its changes.

Flux
----

You're right, this looks like flux. It's not flux yet, though. You can iterate your way toward flux; creating actions and stores is a great first step.

If you're curious, the next step would be to introduce a `Dispatcher` so that our `AssignmentActions` aren't calling methods on our stores, but instead dispatch the action with a payload and forget about it. Then, the stores would respond to actions from the dispatcher and deal with the payload themselves. In other words, actions shouldn't know about stores, and stores shouldn't have public methods other modules use, allowing the stores to be self-contained and the actions blissfully simple.
