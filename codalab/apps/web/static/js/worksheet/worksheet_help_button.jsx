/**
 * worksheet_help_button.jsx
 * -------------------------
 * The help button user interface.
 **/

var HELP_STATES = {
  'INITIAL': 1,
  'OPEN': 2,
  'SENDING': 3,
  'FAILED': 4,
  'SUCCESS': 5
};

var HelpButton = React.createClass({
    getInitialState: function() {
        return {
           state: HELP_STATES.INITIAL,
           message: ''
        };
    },

    sendMessage: function(message) {
        var data = {
          message: message
        };

        var onSuccess = function(data, status, jqXHR) {
            this.messageSentTransition(true);
        }.bind(this);

        var onError = function(jqXHR, status, error) {
            console.error(jqXHR.responseText);
            this.messageSentTransition(false);
        }.bind(this);

        $.ajax({
            url: '/rest/help/',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: onSuccess,
            error: onError
        });
    },

    messageSentTransition: function(isSuccess) {
        var TIMEOUT_TIME = 3000;
        switch (this.state.state) {
            case HELP_STATES.SENDING:
                var nextState;
                if (isSuccess) {
                    nextState = HELP_STATES.SUCCESS;
                } else {
                    nextState = HELP_STATES.FAILED;
                }

                this.setState(
                    {state: nextState},
                    function() {
                        setTimeout(this.timerTransition, TIMEOUT_TIME);
                    }.bind(this)
                );
                break;
            default:
                console.error("Error: The messageSentTransition() should only be called when the program is in the SENDING state");
                return;
        }
    },

    clickTransition: function(e) {
        switch (this.state.state) {
            case HELP_STATES.INITIAL:
                this.setState({state: HELP_STATES.OPEN});
                break;
            case HELP_STATES.OPEN:
                if (this.state.message) {
                    this.sendMessage(this.state.message);
                    this.setState({state: HELP_STATES.SENDING});
                } else {
                    this.setState({state: HELP_STATES.INITIAL});
                }
                break;
            default:
                return;
        }
    },

    timerTransition: function() {
        switch (this.state.state) {
            case HELP_STATES.FAILED:
                this.setState({state: HELP_STATES.OPEN});
                break;
            case HELP_STATES.SUCCESS:
                this.setState({
                    state: HELP_STATES.INITIAL,
                    message: ''
                });
                break;
            default:
                return;
        }
    },

    onMessageChange: function(e) {
        this.setState({message: e.target.value});
    },

    helpButtonIcon: function() {
        switch (this.state.state) {
            case HELP_STATES.INITIAL:
                return '?';
            case HELP_STATES.OPEN:
                if (this.state.message) {
                    return '>';
                } else {
                    return 'X';
                }
            case HELP_STATES.SENDING:
                return '...';
            case HELP_STATES.FAILED:
                return '!';
            case HELP_STATES.SUCCESS:
                return '\u2713';
            default:
                console.error("Error: Invalid state", this.state.state);
                return HELP_STATES.INITIAL;
        }
    },

    helpTextMessage: function() {
        switch (this.state.state) {
            case HELP_STATES.OPEN:
                return 'Questions/Comments? Send us an email here or at codalab@gmail.com';
            case HELP_STATES.SENDING:
                return 'Sending...';
            case HELP_STATES.FAILED:
                return 'Something went wrong, please try again';
            case HELP_STATES.SUCCESS:
                return 'Message sent! We\'ll get back to you soon!';
            default:
                return '';
        }
    },

    render: function() {
/*
      var helpButtonStyle = {
          width: '50px',
          height: '50px',
          borderRadius: '25px',
          backgroundColor: 'rgb(115, 156, 185)',
          color: 'white',
          display: ['flex', '-webkit-flex'],
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          float: 'right',
          margin: '3px',
          boxShadow: 'none'
      };
      */


/*
      var messageStyle = {
          width: '550px',
          height: '45px',
          float: 'left',
          margin: '5px',
          marginRight: '-30px',
          padding: '3px',
          border: 'none',
          borderRadius: '15px'
      };
      */

      var helpTextStyle = {};
      var messageBoxStyle = {};
      var containerStyle = {};

      var helpTextIsVisible = function() {
          return this.state.state !== HELP_STATES.INITIAL;
      }.bind(this);

      var messageBoxIsVisible = function() {
          return this.state.state !== HELP_STATES.INITIAL;
      }.bind(this);

      var containerIsVisible = function() {
          return this.state.state !== HELP_STATES.INITIAL;
      }.bind(this);

      helpTextStyle.display = helpTextIsVisible() ? null : 'none';
      messageBoxStyle.display = messageBoxIsVisible() ? null : 'none';
      containerStyle.backgroundColor = containerIsVisible() ? null : 'transparent';

      return (
          <div style={containerStyle} className={['help-container']}>
              <div className={['help-text']} style={helpTextStyle}>{this.helpTextMessage()}</div>
              <div>
                  <textarea style={messageBoxStyle} className={['help-message-box']} value={this.state.message} onChange={this.onMessageChange}/>
                  <button className={['help-button']} onClick={this.clickTransition}>{this.helpButtonIcon()}</button>
              </div>
          </div>
      );
    }

});
