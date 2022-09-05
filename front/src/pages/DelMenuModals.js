import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { instance } from "../template/AxiosConfig/AxiosInterceptor";
import { ToastContainer, toast } from 'react-toastify';

export const DelMenuModals = ({ menuDelModalshow, setMenuDelModalShow, oneMenu, setOneMenu, menuList, setMenuList }) => {
    const ModalClose = () => {
        setOneMenu('');
        setMenuDelModalShow(false);
    }
    const DelMenu = () => {
        instance({
            method: "delete",
            url: `/menu/` + oneMenu.id,
        }).then(function (res) {
            setMenuDelModalShow(false);
            toast.success('메뉴가삭제되었습니다.', toast.toastDefaultOption);
            setMenuList(
                menuList.filter((menuList) => {
                    return menuList.id !== res.data.id;
                })
            );
            setOneMenu('');
        });
    };
    return (
        <Modal show={menuDelModalshow} onHide={ModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>메뉴 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>{`메뉴 : ${oneMenu.name} (을)를 삭제하시겠습니까?`}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={ModalClose}>
                    닫기
                </Button>
                <Button variant="danger" onClick={DelMenu}>
                    삭제
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

