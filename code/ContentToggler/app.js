/** @jsx React.DOM */

var ContentToggle = React.createClass({

  getInitialState: function() {
    return {
      showDetails: false
    };
  },

  handleClick: function(event) {
    this.setState({
      showDetails: !this.state.showDetails
    });
    this.refs.details.getDOMNode().focus();
  },

  render: function() {
    var details;
    var summaryClassName = 'ContentToggle__Summary';

    if (this.state.showDetails) {
      details = this.props.children;
      summaryClassName += ' ContentToggle__Summary--open';
    }

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

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>ContentToggle</h1>
        <ContentToggle summary="Tacos">
          <p>Tacos are delicious.</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
        </ContentToggle>
      </div>
    );
  }
});

React.renderComponent(<App/>, document.body);
