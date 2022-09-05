import React from 'react'
import Register from '../pages/Register';
import { Modal, ModalBody } from 'react-bootstrap';

export default function RegisterModal({ showRegister, closeRegisterModal }) {
  return (
    <>
      <Modal
          show={showRegister}
          onHide={closeRegisterModal}
          keyboard={false}
          centered
      >
          <ModalBody>
              <Register closeRegisterModal={closeRegisterModal}/>
          </ModalBody>
      </Modal>
    </>
  )
}
