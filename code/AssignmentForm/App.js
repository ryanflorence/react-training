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
    return {
      assignments: []
    };
  },

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

React.renderComponent(<App/>, document.body);
