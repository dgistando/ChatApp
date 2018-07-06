import React, {Component} from 'react'
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux'
import MessageBar from './message_bar'

import {getMessages} from '../actions/index'

import '../index.css'

class ActiveChat extends Component {

    showMessages(message){
        return (<li 
            key={message.userName + message.time.toString()}
            className={"list-group-item list-group-item-action list-group-item-success"}

        //I'll worry about message styles later
        >[{message.userName}]: {message.content}</li>
        )
    }

    render(){
        return (
            <div  className={"flex-item flex2"}>

                <div className={"search-bar"}>
                <ul className={"list-group-item"}>
                    {this.props.Messages.map(this.showMessages, this)}
                </ul>
            
                <MessageBar />
                </div>
            </div>
        );
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        getMessages : getMessages
    }, dispatch)
}

function mapStateToProps({single_item_reducer, Messages}){
    return {
        Chat : single_item_reducer.activeChat,
        Messages : Messages,
        UserInfo : single_item_reducer.userInfo
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(ActiveChat)