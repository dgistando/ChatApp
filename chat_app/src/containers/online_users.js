import React, {Component} from 'react'
import PropTypes from 'prop-types';

import '../index.css'

class OnlineUsers extends Component{

    showUsers(user){
        return (
            <li 
            key={user.userName+user.status}
            className={"list-group-item list-group-item-action list-group-item-success"}
            >
                {user.userName +" "+ user.status}
            </li>
        );
    }

    render(){
        if(!this.props.onlineUsers){
            return <div className={'flex-item flex3'}>No one here.</div>
        }

        if(this.props.onlineUsers.length === 0){
            return <div className={'flex-item flex3'}>No one here.</div>
        }

        console.log(this.props.onlineUsers)
        return (
            <div className={'flex-item flex3'}>
                <ul className="list-group chat-list">
                    {this.props.onlineUsers.map(this.showUsers, this)}
                </ul>
            </div>
        );
    }
}

OnlineUsers.propTypes = {
    onlineUsers : PropTypes.array
};

export default OnlineUsers;