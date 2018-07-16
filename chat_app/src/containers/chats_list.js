import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {clearMessages,
        selectChat,
        showModal,
        getChats,
        getMessages,
        socket,
        deleteChat,
        getChatsByUser} from '../actions/index'

import {DropdownButton, MenuItem} from 'react-bootstrap';

import '../index.css'
import './dropup.css'

const ONLINE = 'online'
const AWAY = 'away'

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
        this.logout = this.logout.bind(this)
        this.onDeleteChat = this.onDeleteChat.bind(this)
    }

    onStatusSelect(event){
        event.preventDefault();

        var eventKey = event.target.id;
        var userName = `${this.props.homeInfo.userInfo.handle}#${this.props.homeInfo.userInfo.id}`
        var status;

        switch(eventKey){
            case 'Online':
                socket.emit('setStatus', userName, ONLINE)
                status = 'btn-primary'; 
                break;
            case 'Away':
                socket.emit('setStatus', userName, AWAY)
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
        var userName = `${this.props.homeInfo.userInfo.handle}#${this.props.homeInfo.userInfo.id}`

        socket.emit('go offline', userName);
        socket.emit('disconnect');
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
                    <div className="dropup">
                        <button className={"dropbtn dropup btn btn-raised "+this.state.status}>{this.state.name}</button>
                        <div className="dropup-content">
                            <a className="list-group-item dropdown-item"  id="Online" href="#" onClick={this.onStatusSelect}>Online</a>
                            <a className="list-group-item dropdown-item"  id="Away" href="#" onClick={this.onStatusSelect}>Away</a>
                            <a className="list-group-item dropdown-item" id="Offline" href="#" onClick={this.onStatusSelect}>Offline</a>
                        </div>
                    </div>

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

    onDeleteChat(){
        var activeChat = this.props.homeInfo.activeChat[0];
        var handle = this.props.homeInfo.userInfo.handle
        var id = this.props.homeInfo.userInfo.id


        if(this.props.Chats && activeChat){
            if(confirm(`Are you sure you want to delete the '${activeChat.name}' chat?`)){
                this.props.deleteChat(activeChat.hash)
                this.props.getChatsByUser(handle, id)
            }
        }
    }

    render(){
        return (

            <div className={"flex-item flex1"}>
                <div>
                <button onClick={() => this.showChatOrNewModal()} type="button" className={"btn btn-raised btn-primary btn-lg"}>New</button>{'\t\t'}
                    <button type="button" onClick={this.onDeleteChat} className={"btn btn-raised btn-danger btn-lg"}>Delete</button>
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
        clearMessages : clearMessages,
        deleteChat : deleteChat,
        getChatsByUser : getChatsByUser
    }, dispatch)
}

function mapStateToProps({Chats, single_item_reducer}){

    //console.log("Chat list update: ",Chats)

    return {Chats,
        homeInfo : single_item_reducer
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(ChatList)