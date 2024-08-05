// ResultModal.js to make result pop uppppp
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ResultModal = ({ show, handleClose, result }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Result</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResultModal;
