import React, { useState } from "react";

const Modal = ({ modalOption }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return <>{modalOption?.show && <div>a</div>}</>;
};

export default Modal;
