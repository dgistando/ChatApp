import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {selectChat, showModal, getChats, getMessages} from '../actions/index'

import '../index.css'

class ChatList extends Component{
    constructor(props){
        super(props);

        this.state = {
            visible : null,
            isOpen : false    
        }

        this.showUserInfo = this.showUserInfo.bind(this)
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
                    <p className="text-justify font-weight-light" >{this.props.homeInfo.userInfo.handle}#
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
        
        return (
            <li
                key={Chat.hash}
                className={"list-group-item list-group-item-action list-group-item-success"}
                onClick={() => {
                    this.props.selectChat(Chat)
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

                <ul className="list-group">
                    {this.props.Chats.map(this.showChats,this)}
                </ul>  

                <div className="userInfo">
                    <h3>User:</h3>
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
        getMessages : getMessages
    }, dispatch)
}

function mapStateToProps({Chats, single_item_reducer}){

    //console.log("Chat list update: ",Chats)

    return {Chats,
        homeInfo : single_item_reducer
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(ChatList)