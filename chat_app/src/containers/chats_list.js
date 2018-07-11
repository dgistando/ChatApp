import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {clearMessages, selectChat, showModal, getChats, getMessages, socket} from '../actions/index'

import {DropdownButton, MenuItem} from 'react-bootstrap';

import '../index.css'

class ChatList extends Component{
    constructor(props){
        super(props);

        this.state = {
            visible : null,
            isOpen : false,
            status : 'btn-secondary',
            name : 'Offline'  
        }

        this.showUserInfo = this.showUserInfo.bind(this)
        this.onStatusSelect = this.onStatusSelect.bind(this)
    }

    onStatusSelect(eventKey){
        var userName = `${this.props.homeInfo.userInfo.handle}#${this.props.homeInfo.userInfo.id}`
        var status;

        switch(eventKey){
            case 'Online':
                socket.emit('go online', userName)
                status = 'btn-primary'; 
                break;
            case 'Away':
                socket.emit('go away', userName)
                status = 'btn-warning';
                 break;
            case 'Offline':
                socket.emit('go offline', userName)
                status = 'btn-secondary'; 
                break;
        }

        this.setState({
            status : status,
            name : eventKey
        })
    }

    logout(event){ //I undertsand that this isnt a real logout
                  //Dont have time to write one
        event.preventDefault();
        location.reload();
    }

    showUserInfo(){
        if(!this.props.homeInfo.userInfo){
            return (
                <button onClick={() => { this.props.showModal('show')
                                         this.props.showModal('login')
                                        }}
                        type="button"
                        className="btn btn-raised btn-primary ">Login</button>
            );

        }else{
            
            return (
                <div>
                    Status:
                    <DropdownButton
                        className = {"dropup btn btn-raised "+this.state.status}
                        title={this.state.name}
                        key={1}
                        id={`dropup-basic-${1}`}
                        dropup={true}
                        >
                        <MenuItem className="list-group-item dropdown-item" eventKey="Online" onSelect={this.onStatusSelect}>Online</MenuItem>
                        <MenuItem className="list-group-item dropdown-item" eventKey="Away" onSelect={this.onStatusSelect}>Away</MenuItem>
                        <MenuItem className="list-group-item dropdown-item" eventKey="Offline" onSelect={this.onStatusSelect}>Offline</MenuItem>
                    </DropdownButton>

                    <p className="text-justify font-weight-light" > 
                     User:
                       {this.props.homeInfo.userInfo.handle}#
                       {this.props.homeInfo.userInfo.id}
                    </p>
                    <button onClick={this.logout} type="button" className={"btn btn-raised btn-danger btn-lg"}>Logout</button>
                </div>
            );
        }
    }

    showChatOrNewModal(){
        if(!this.props.homeInfo.userInfo){
            this.props.showModal('show') //set wether or not to show
            this.props.showModal('new') //set type of modal to show
        }else{
            this.props.showModal('show') 
            this.props.showModal('chat') 
        }
    }

    showChats(Chat){
        var userName = `${this.props.homeInfo.userInfo.handle}#${this.props.homeInfo.userInfo.id}`
        var ActiveChat = this.props.homeInfo.activeChat;

        return (
            <li
                key={Chat.hash}
                className={"list-group-item list-group-item-action list-group-item-success"}
                onClick={() => {
                    if(ActiveChat){
                         socket.emit('leave chat', ActiveChat.hash, userName) //be sure to leave the chat if in one.
                         this.props.clearMessages()
                    }
                    this.props.selectChat(Chat, userName)
                    this.props.getMessages(Chat.hash)
                    
                }}
            >{Chat.name}</li>
        )
    }

    render(){
        return (

            <div className={"flex-item flex1"}>
                <div>
                <button onClick={() => this.showChatOrNewModal()} type="button" className={"btn btn-raised btn-primary btn-lg"}>New</button>{'\t\t'}
                    <button type="button" className={"btn btn-raised btn-danger btn-lg"}>Delete</button>
                </div>

                <ul className="list-group chat-list">
                    {this.props.Chats.map(this.showChats,this)}
                </ul>  

                <div className="userInfo ">
                    {this.showUserInfo()}
                </div>
            </div>
        );
    }
}


function matchDispatchToProps(dispatch){
    return bindActionCreators({
        selectChat : selectChat,
        showModal : showModal,
        getChats : getChats,
        getMessages : getMessages,
        clearMessages : clearMessages
    }, dispatch)
}

function mapStateToProps({Chats, single_item_reducer}){

    //console.log("Chat list update: ",Chats)

    return {Chats,
        homeInfo : single_item_reducer
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(ChatList)