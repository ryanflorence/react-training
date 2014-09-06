/** @jsx React.DOM */

var AssignmentList = React.createClass({
  render: function() {
    var assignments = this.props.assignments.map(function(assignment) {
      return <li key={assignment.id}>{assignment.name} - {assignment.points} points</li>;
    });
    return (
      <ul>
        {assignments}
      </ul>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return this.getStateFromStore();
  },

  getStateFromStore: function() {
    return AssignmentStore.getState();
  },

  componentDidMount: function() {
    AssignmentStore.onChange = this.onChange;
  },

  onChange: function() {
    this.setState(this.getStateFromStore());
  },

  render: function() {
    return (
      <div>
        <h1>Assignment Form</h1>
        <AssignmentForm />
        <AssignmentList assignments={this.state.assignments}/>
      </div>
    );
  }
});

React.renderComponent(<App/>, document.body);
