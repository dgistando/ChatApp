import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NewUser from '../containers/new_user_modal';

import {selectChat} from '../actions/index'

import '../index.css'

// MBRC1937

class ChatList extends Component{
    constructor(props){
        super(props);

        this.state = {
            user : null,
            visible : null
        }
    }

    showModal(){
        if(!this.state.user){
            //Show the create user modal
            
        }else{
            //show the add chat modal
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

    render(){
        return (
            <div className={"flex-item flex1"}>

                <div>
                    <button onClick={this.showModal} type="button" className={"btn btn-raised btn-primary btn-lg"}>New</button>{'\t\t'}
                    <button type="button" className={"btn btn-raised btn-danger btn-lg"}>Delete</button>
                </div>

                <ul className="list-group">
                    {this.getChats()}
                </ul>  
            </div>
        );
    }
}


function matchDispatchToProps(dispatch){
    return bindActionCreators({selectChat : selectChat}, dispatch)
}

function mapStatetoProps({Chats}){
    return {Chats};
}

export default connect(mapStatetoProps, matchDispatchToProps)(ChatList)