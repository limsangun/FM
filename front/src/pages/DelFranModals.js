import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { instance } from "../template/AxiosConfig/AxiosInterceptor";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const DelFranModals = ({ show, setShow, data, list, setList, franPage, setFranPage, searchCount }) => {
    let navigate = useNavigate();
    const handleClose = () => setShow(false);
    const DelFran = () => {
        instance({
            method: "delete",
            url: `/franchisee/` + data.businessNumber,
        }).then(function (res) {
            setShow(false);
            navigate('/mypage')
            toast.success("가맹점이 삭제되었습니다.", toast.toastDefaultOption);
            if (franPage) {
                if (franPage === (Math.ceil(searchCount / 5)) && (searchCount % 5 === 1)) {
                    setFranPage((franPage - 1));
                } else setFranPage(franPage);
            }

            if (list != null) {
                setList((list).filter((ele) => ele.businessNumber !== data.businessNumber));
            }
        });
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{data.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{`사업자번호 : ${data.businessNumber} 를 삭제하시겠습니까?`}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="danger" onClick={DelFran}>
                    삭제
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DelFranModals;
