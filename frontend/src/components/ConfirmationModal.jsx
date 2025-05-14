// This ConfirmationModal.jsx
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './ConfirmationModal.css'; // import the CSS file

class ConfirmationModal extends Component {
  render() {
    return (
      <div className="confirmation-modal">
        <div className="modal-content">
          <span className="close-button" onClick={this.props.onCancel}>&times;</span>
          <div className="icon-container">
            <div className="icon">
              <FontAwesomeIcon icon={faTrashAlt} />
            </div>
          </div>
          <h2>{this.props.title}</h2>
          <p>{this.props.message}</p>
          <div className="button-container">
            <button className="cancel-button" onClick={this.props.onCancel}>Cancel</button>
            <button className="delete-button" onClick={this.props.onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmationModal;
