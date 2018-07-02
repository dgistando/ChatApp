import React, {Component} from 'react';
import PropTypes from 'prop-types';

import '../index.css'

 class Modal extends Component {etr5u5tyrtugnvcmjk       

    render(){

        if(!this.props.show) {
            return null;
        }

        return (//<button className="btn btn-default" onClick={this.props.onClose}>Close</button>
            <div className="backdrop">
                <div className="modals">
                        {this.props.children}
                </div>
            </div>
        );
    }
}

Modal.propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node
};

export default Modal;