/** @jsx React.DOM */

var Dialog = React.createClass({
  render: function() {
    // 1) render nothing, this way the DOM diff will never try to do
    //    anything to it again, and we get a node to mess with
    return <div/>;
  },

  componentDidMount: function() {
    // 2) do DOM lib stuff
    this.node = this.getDOMNode();
    this.dialog = $(this.node).dialog({
      autoOpen: false,
      // pass in lib options from props
      title: this.props.title,
      close: this.props.onClose
    }).data('ui-dialog');

    // 3) call method to reconnect React's rendering
    this.renderDialogContent();
  },

  componentWillReceiveProps: function(newProps) {
    // 4) render reconnected tree when props change
    this.renderDialogContent(newProps);
  },

  renderDialogContent: function(props) {
    // decide to use newProps from `componentWillReceiveProps` or to use
    // existing props from `componentDidMount`
    props = props || this.props;

    // 5) make a new rendering tree, we've now hidden the DOM
    //    manipulation from jQuery UI dialog and then continued
    //    rendering with React
    React.renderComponent(<div>{props.children}</div>, this.node);

    // 6) Call methods on the DOM lib via prop changes
    if (props.open)
      this.dialog.open();
    else
      this.dialog.close();
  },

  componentWillUnmount: function() {
    // clean up the mess
    this.dialog.destroy();
  },

  getDefaultProps: function() {
    return {
      title: '',
      onClose: function(){}
    }
  }
});

