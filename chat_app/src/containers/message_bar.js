import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {insertMessage, getMessages, socket, receiveMessage, clearMessages} from "../actions/index";

class MessageBar extends Component{

    constructor(props){
        super(props);

        this.state = { term: ''}

        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);

        //Socket events
        socket.on('broadcast_chat', (message_obj) => {
            this.props.receiveMessage(message_obj)
        })

        socket.on('force update', () => {
            this.props.clearMessages()
            this.props.getMessages(this.props.Chat[0].hash)
        })
    }

    onInputChange(event){
        console.log(event.target.value)
        this.setState({term: event.target.value})
    }

    onFormSubmit(event){
        event.preventDefault();

        var user = this.props.UserInfo
        var hash = this.props.Chat[0].hash

        this.props.insertMessage(this.state.term, user.handle+"#"+user.id, hash);
        //this.props.getMessages(hash)
        this.setState({term: ''});
    }

    

    render(){
        return(
            <div>
                <form  onSubmit={this.onFormSubmit} className={"input-group"}>
                    <input
                        placeholder={"Say something..."}
                        className={"form-control"}
                        value={this.state.term}
                        onChange={this.onInputChange}
                    />
                    <span className={"input-group-btn"}>
                        <button type={"submit"} className={"btn btn-secondary"}>Submit</button>
                    </span>
                </form>
          </div>
        );
    }
}



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        insertMessage,
        getMessages,
        receiveMessage,
        clearMessages
    }, dispatch);
}

function mapStateToProps({single_item_reducer, Messages}){

    return {
        Chat : single_item_reducer.activeChat,
        Messages : Messages,
        UserInfo : single_item_reducer.userInfo
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageBar);