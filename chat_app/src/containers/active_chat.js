import React, {Component} from 'react'
import { connect } from 'react-redux';
import MessageBar from './message_bar'

import '../index.css'

class ActiveChat extends Component {
    render(){
        return (
            <div  className={"flex-item flex2"}>

                <div className={"search-bar"}>
                <ul className={"list-group-item"}>
                    <li>This is a chat</li>
                </ul>
            
                <MessageBar />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        Chat : state.ActiveChat
    };
}

export default connect(mapStateToProps)(ActiveChat)