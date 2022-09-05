import { Button, Form, Modal, FloatingLabel } from "react-bootstrap";

const BusinessListMenuModal = () => {
    return (
        <Modal>
            <Modal.Header>
                <Modal.Title>메뉴 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="ex-layout">
                        <div className="main">
                            <div className="left-menu">
                                {/* <img
                                    src={menuImgsrc}
                                    style={{
                                        width: "200px",
                                        height: "220px",
                                    }}
                                /> */}
                                <br />
                            </div>
                            <div className="content">
                                <div className="article">
                                    <Form.Group className="mb-3">
                                        <Form.Label>메뉴 이름</Form.Label>

                                        <Form.Control
                                            name="name"
                                            type="text"
                                            placeholder="메뉴 이름을 적어주세요."
                                            autoFocus
                                        />
                                    </Form.Group>
                                </div>
                                <div className="comment">
                                    <Form.Group className="mb-3">
                                        <Form.Label>메뉴 가격</Form.Label>

                                        <Form.Control
                                            name="price"
                                            type="text"
                                            placeholder="메뉴 가격을 적어주세요."
                                            autoFocus
                                        />
                                    </Form.Group>
                                </div>
                                <div className="comment">
                                    <Form.Group className="mb-3 filebox">
                                        <Form.Label for="ex_file">
                                            이미지 업로드
                                        </Form.Label>
                                        <Form.Control
                                            type="file"
                                            id="ex_file"
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
                <FloatingLabel label="메뉴 소개">
                    <Form.Control
                        name="description"
                        as="textarea"
                        placeholder="메뉴 소개"
                        style={{
                            height: "150px",
                            resize: "none",
                        }}
                    />
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary">뒤로</Button>

                <Button variant="primary">등록</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BusinessListMenuModal;
