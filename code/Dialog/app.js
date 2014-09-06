/** @jsx React.DOM */

var App = React.createClass({

  getInitialState: function() {
    return { taco: null, showForm: false };
  },

  handleTacoSubmission: function(event) {
    event.preventDefault();
    var taco = this.refs.favoriteTaco.getDOMNode().value;
    this.setState({
      taco: taco,
      showForm: false
    });
  },

  renderTaco: function() {
    return this.state.taco ?
      "Your favorite taco is: "+this.state.taco:
      "You don't have a favorite taco yet.";
  },

  showForm: function() {
    this.setState({showForm: true});
  },

  handleDialogClose: function() {
    if (!this.state.taco)
      alert("You don't have a favorite taco?");
  },

  render: function() {
    return (
      <div>
        <h1>Dialog (Wrapping DOM Libs)</h1>
        <button onClick={this.showForm}>Tell me your favorite taco</button>
        <p>{this.renderTaco()}</p>
        <Dialog
          title="Favorite Taco"
          open={this.state.showForm}
          onClose={this.handleDialogClose}
        >
          <form onSubmit={this.handleTacoSubmission}>
            <p>Tacos are delicious. Which is your favorite?</p>
            <p>
              <input type="text" ref="favoriteTaco"/> <button type="submit">Submit</button>
            </p>
          </form>
        </Dialog>
      </div>
    );
  }
});

React.renderComponent(<App/>, document.body);
