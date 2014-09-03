/** @jsx React.DOM */

// fake
var guid = 0;

var AssignmentForm = React.createClass({

  propTypes: {
    onCreate: React.PropTypes.func.isRequired
  },

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

