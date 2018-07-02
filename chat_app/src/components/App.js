import React, { Component } from 'react';
import ChatList from '../containers/chats_list';
import ActiveChat from '../containers/active_chat';
import Modal from '../containers/modal';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {showModal, insertUser,getUser, insertChat} from '../actions/index'

import '../index.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = { isOpen: false,
                    userName : '',
                    name: '',
                    Uid:'',
                    chatName: '' ,
                    userList : []};
    this.toggleModal = this.toggleModal.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  toggleModal(){
    this.props.showModal('hide')
  }

  showForm(type){
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
    // if(target === 'insertUser'){
    //   this.props.insertUser(this.state.userName, this.state.name)
    // }else if(target === 'getUser'){
    //   this.props.getUser(this.state.userName, this.state.Uid)
    // }

    switch(event.target.id){
      case('insertUser'):
        this.props.insertUser(this.state.userName, this.state.name)
        break;
      case('getUser'):
        console.log("GET USER")
        this.props.getUser(this.state.userName, this.state.Uid)
        break;
      case('createChat'):
        console.log("Create Chat")
        this.props.insertChat(this.state.chatName, this.state.userList)
        break;
    }

    this.setState({
      userName : '',
      name: '',
      Uid:'',
      userList : []
    })

    this.toggleModal();
  }

  onInputChange(event){

    if(event.target.id === 'usersList'){//This means users cant have emptySpace in names
      event.target.value = event.target.value.replace(' ','').split(',')
    }

    console.log(event.target.value)
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
            <input type="text" className="form-control" id="Uid" value={this.state.userList} onChange={this.onInputChange}/>
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
          <input type="text" className="form-control" id="usersList" value={this.state.Uid} onChange={this.onInputChange}/>
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
        <Modal show={this.props.isModalOpenProp}>
              {this.showForm(this.props.modalTypeProp)}
        </Modal>
        
        <ul className="flex-container">
          <ChatList />
          <ActiveChat />
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
    insertChat : insertChat
 }, dispath) 
}

function mapStatetoProps({isModalOpen, homeInfo}){

  console.log(isModalOpen.modalType)

  return {
    isModalOpenProp : isModalOpen.isModalOpen,
    modalTypeProp : isModalOpen.modalType,
    homeInfo : homeInfo.userInfo
  };
}


export default connect(mapStatetoProps, matchDispatchToProps)(App)
