import React from "react";
import FindPassword from "../pages/FindPassword";
import { Modal, ModalBody } from "react-bootstrap";

export default function FindPWModal({findpwshow, closeFindpw}) {
    
    return (
        <>
            <Modal
                show={findpwshow}
                onHide={closeFindpw}
                keyboard={false}
                style={{top:'160px'}}
            >
                <ModalBody>
                    <FindPassword closeFindpw={closeFindpw} />
                </ModalBody>
            </Modal>
        </>
    );
}
