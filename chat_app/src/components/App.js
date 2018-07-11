import React, { Component } from 'react';
import ChatList from '../containers/chats_list';
import ActiveChat from '../containers/active_chat';
import OnlineUsers from '../containers/online_users';
import Modal from '../containers/modal';
require("babel-core/register");
require("babel-polyfill");

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {showModal,
        insertUser,
        getUser,
        insertChat,
        checkUser,
        getChatsByUser,
        getChats,
        selectChat,
        socket} from '../actions/index'

import '../index.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = { alertOpened: false,
                    userName : '',
                    name: '',
                    Uid:'',
                    chatName: '' ,
                    usersList : [],
                    usersOnline : undefined};
    this.toggleModal = this.toggleModal.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)

    socket.on('users online', (userList) => {
      console.log('updating online users', userList)
      this.setState({usersOnline : userList})
    })
  }

  toggleModal(){
    this.props.showModal('hide')
  }

  showForm(type){

    console.log("modal type == "+ type)
    switch(type){
      case 'login':
        return this.getUser();
      case 'new':
        return this.addUser();
      case 'chat':
        return this.addChat();
    }
  }

  onFormSubmit(event){
    event.preventDefault();
    var target = event.target.id

    console.log("target : "+target)
    if(event.target.id === 'createChat') this.onInputChange(event)

    switch(event.target.id){
      case('insertUser'):
        this.props.insertUser(this.state.userName, this.state.name)
        break;
      case('getUser'):
        console.log("GET USER")
        this.props.getUser(this.state.userName, this.state.Uid)
        this.props.getChatsByUser(this.state.userName,this.state.Uid)
        break;
      case('createChat'):
        console.log("Create Chat")
        var finalUserList = [this.props.userInfo.handle+"#"+this.props.userInfo.id, ...this.state.usersList]
        this.props.insertChat(this.state.chatName, finalUserList)
        break;
    }

    this.setState({
      userName : '',
      name: '',
      Uid:'',
      chatName: '',
      userList : []
    })

    this.toggleModal();
  }

  onInputChange(event){

      //check users here
    if(event.target.id === 'usersList' && 
       event.target.value[event.target.value.length - 1] === ','){

      var userList = event.target.value.substring(0, event.target.value.length - 1).replaceAll(' ','').split(',')

      console.log(userList)

        var check = 1;

        userList = userList.map(entity => {
          entity = entity.split('#')

          if(entity.length != 2 || isNaN(entity[1])){
            alert(`(${entity[0]}) Is in the incorrect format.\n Correct format : <username>#<id number>`)
            check = null;
            return;
          }

          return entity
        })

        if(check === null)return;    

      
      //Make the call for the existing users
      this.props.checkUser(userList);

      this.setState({alertOpened : false})
    }else if(event.target.id === 'usersList' && this.state.alertOpened == false){   
        //checking that the user are real
        if(this.props.userExistProp !== undefined && this.props.userExistProp.length != 0){
        alert("The following users don't exist:\n"+JSON.stringify(this.props.userExistProp))

        this.setState({alertOpened : true})
        return;
      }
    }

    console.log(event.target.id +"  "+event.target.value)
    this.setState({ [event.target.id] : [event.target.value] })
  }

  addUser(){
    return (
      <div>
        <h3 className="mb-3">Do you have a userName?</h3>
        <form onSubmit={this.onFormSubmit} id="insertUser">
          <div className="form-group">
            <label htmlFor="userName" className="bmd-label-floating required">Username</label>
            <input type="text" className="form-control" id="userName" value={this.state.userName} onChange={this.onInputChange}/>
            <span className="bmd-help"> A username is required to use this app.</span>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="bmd-label-floating">Name</label>
            <input type="text" className="form-control" id="name" value={this.state.name} onChange={this.onInputChange}/>
          </div>

          <button className="btn btn-default" onClick={this.toggleModal}>Cancel</button>{' '}
          <button type="submit" className="btn btn-primary btn-raised" >Submit</button> {' '}
          <button onClick={() => { this.props.showModal('show')
                                         this.props.showModal('login')
                                        }} type="button" className="btn btn-raised btn-secondary ">Login</button>
        </form>
      </div>
    );
  }

  getUser(){
    return (
      <div>
        <h3 className="mb-3">Enter Username and ID</h3>
        <form onSubmit={this.onFormSubmit} id="getUser">
          <div className="form-group">
            <label htmlFor="userName" className="bmd-label-floating required">Username</label>
            <input type="text" className="form-control" id="userName" value={this.state.userName} onChange={this.onInputChange}/>
            <span className="bmd-help"> A username is required to use this app.</span>
            
          </div>

          <div className="form-group">
            <label htmlFor="Uid" className="bmd-label-floating required">ID</label>
            <input type="text" className="form-control" id="Uid" value={this.state.Uid} onChange={this.onInputChange}/>
          </div>

          <button className="btn btn-default" onClick={this.toggleModal}>Cancel</button>{' '}
          <button type="submit" className="btn btn-primary btn-raised" >Login</button>
        </form>
      </div>
    );
  }

  addChat(){
    return (
      <div>
      <h3 className="mb-3">Create a chat</h3>
      <form onSubmit={this.onFormSubmit} id="createChat">
        <div className="form-group">
          <label htmlFor="chatName" className="bmd-label-floating required">Name</label>
          <input type="text" className="form-control" id="chatName" value={this.state.chatName} onChange={this.onInputChange}/>
          <span className="bmd-help"> A chat name is requied to create one</span>
        </div>

        <div className="form-group">
          <label htmlFor="usersList" className="bmd-label-floating required">User List (comma separated)</label>
          <input type="text" className="form-control" id="usersList" value={this.state.usersList} onChange={this.onInputChange}/>
        </div>

        <button className="btn btn-default" onClick={this.toggleModal}>Cancel</button>{' '}
        <button type="submit" className="btn btn-primary btn-raised" >Add</button>
      </form>
    </div>
    );
  }

  render() {
    return (
      <div id="root">
        <Modal show={this.props.isModalOpen}>
              {this.showForm(this.props.modalTypeProp)}
        </Modal>
        
        <ul className="flex-container">
          <ChatList />
          <ActiveChat />
          <OnlineUsers onlineUsers={this.state.usersOnline}/>
        </ul>
      </div>
    );
  }
}

function matchDispatchToProps(dispath){
 return bindActionCreators({
    showModal : showModal,
    insertUser : insertUser,
    getUser : getUser,
    insertChat : insertChat,
    checkUser : checkUser,
    getChatsByUser : getChatsByUser,
    getChats : getChats,
    selectChat : selectChat
 }, dispath) 
}

function mapStatetoProps({single_item_reducer}){
  //console.log(single_item_reducer)
  return {
    isModalOpen : single_item_reducer.isModalOpen,
    modalTypeProp : single_item_reducer.modalType,
    userExistProp : single_item_reducer.userExist,
    userInfo : single_item_reducer.userInfo,
  };
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export default connect(mapStatetoProps, matchDispatchToProps)(App)
