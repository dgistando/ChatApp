import React, {Component} from 'react'
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux'
import MessageBar from './message_bar'

import {getMessages} from '../actions/index'


import '../index.css'

class ActiveChat extends Component {

    componentDidUpdate(){
        this.scrollToBottom()
    }

    scrollToBottom(){
        console.log("scrolling into view")
        if(this.newItem)//got an extant error
            this.newItem.scrollIntoView(true, {behavior: "smooth", block: "end", inline: "nearest"})
    }

    showMessages(message){

        //console.log(message)

        return (<li 
            key={message.userName + message.time.toString()}
            className={"list-group-item list-group-item-action list-group-item-success messages"}
            tabIndex="1"
            ref = {newItem => this.newItem = newItem}
        //I'll worry about message styles later
        >[{message.userName}]:<div className="message-text">  {message.content}</div></li>
        )
    }

    render(){
        

        return (
            <div className={"flex-item flex2"}>

                <div className={"search-bar"}>
                <ul className={"list-group-item message-list"}>
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