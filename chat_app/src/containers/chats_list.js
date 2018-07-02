import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {selectChat,showModal} from '../actions/index'

import '../index.css'


class ChatList extends Component{
    constructor(props){
        super(props);

        this.state = {
            visible : null,
            isOpen : false
        }
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
                                        }} type="button" className="btn btn-raised btn-primary ">Login</button>
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

    showChatOrNew(){
        if(!this.props.homeInfo.userInfo){
            this.props.showModal('show') //set wether or not to show
            this.props.showModal('new') //set type of modal to show
        }else{
            this.props.showModal('show') //set wether or not to show
            this.props.showModal('chat') //set type of modal to show
        }
    }

    getChats(){
        if(!this.props.Chats){
            return (<li>No Items yet!!</li>)
        }

        return ( this.props.Chats.map( Chat =>{
                return <li
                    key={Chat.hash}
                    className={"list-group-item"}
                    onClick={() => this.props.selectChat(Chat)}
                >{Chat.name}</li>
            })
        );
    }

    render(){//<button onClick={() => this.props.showModal('show')} type="button" className={"btn btn-raised btn-primary btn-lg"}>New</button>
        return (

            <div className={"flex-item flex1"}>
                <div>
                <button onClick={() => this.showChatOrNew()} type="button" className={"btn btn-raised btn-primary btn-lg"}>New</button>{'\t\t'}
                    <button type="button" className={"btn btn-raised btn-danger btn-lg"}>Delete</button>
                </div>

                <ul className="list-group">
                    {this.getChats()}
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
        showModal : showModal
    }, dispatch)
}

function mapStatetoProps({Chats, homeInfo}){
    return {Chats,
        homeInfo : homeInfo
    };
}

export default connect(mapStatetoProps, matchDispatchToProps)(ChatList)