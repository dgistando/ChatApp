import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {insertMessage} from "../actions/index";

class MessageBar extends Component{

    constructor(props){
        super(props);

        this.state = { term: ''}

        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onInputChange(event){
        console.log(event.target.value)
        this.setState({term: event.target.value})
    }

    onFormSubmit(event){
        event.preventDefault();
        this.props.insertMessage(this.state.term);
        this.setState({term: ''});
    }

    render(){
        return(
            <div>
                <form  onSubmit={this.onFormSubmit} className={"input-group"}>
                    <input
                        placeholder={"Say something..."}
                        className={"form-control"}
                        value={this.state.term}
                        onChange={this.onInputChange}
                    />
                    <span className={"input-group-btn"}>
                        <button type={"submit"} className={"btn btn-secondary"}>Submit</button>
                    </span>
                </form>
          </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({insertMessage}, dispatch);
}

export default connect(null, mapDispatchToProps)(MessageBar);