var AssignmentStore = {
  _state: {
    assignments: [],
    loaded: false
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

