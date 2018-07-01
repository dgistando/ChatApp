import React, { Component } from 'react';
import ChatList from '../containers/chats_list';
import ActiveChat from '../containers/active_chat';

import '../index.css';

class App extends Component {
  render() {
    return (
      <div id="root">
        <ul className="flex-container">
          <ChatList />
          <ActiveChat />
        </ul>
      </div>
    );
  }
}

export default App;
