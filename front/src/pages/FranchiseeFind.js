import { Button, Container } from "react-bootstrap";
import Footer from "../template/Footer";
import Header from "../template/MainHeader";
import '../css/FranchiseeFind.css'
import ScrollToTop from '../template/ScrollToTop';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { TbBoxOff } from "react-icons/tb";
import { BiArrowBack } from "react-icons/bi";
import { instance } from "../template/AxiosConfig/AxiosInterceptor";
import { useNavigate } from "react-router";


function FanchiseeNodeList({ searchData, paramkeyword }) {
    return (
        <>
            <ScrollToTop />
            {
                (searchData == null) && (
                    <>
                        <div className="find__list">
                            <div className="find__list__header">
                                <strong>0</strong>건의 조회 결과가 있습니다.
                            </div>
                        </div>
                    </>
                )
            }
            {
                (searchData != null) && (
                    <>
                        <div className="find__list">
                            <div className="find__list__header">
                                <strong>{searchData.searchCount}</strong>건의 조회 결과가 있습니다.
                            </div>
                            {
                                searchData.franchisees.map((franchisee, idx) => {
                                    return (
                                        <FanchiseeNode franchisee={franchisee} key={idx} paramkeyword={paramkeyword} searchData={searchData.searchCount} />
                                    );
                                })
                            }
                        </div>
                    </>
                )
            }

        </>
    );
}

function FanchiseeNode({ franchisee, paramkeyword, searchData }) {
    const navigate = useNavigate();

    const goPlace = () => {
        navigate('/map', { state: [franchisee, paramkeyword, searchData] });
    }

    return (
        <div className="find__node">
            <div className="find__node__body">
                <div className="find__node__img">
                    <img src={process.env.REACT_APP_SERVER_URL + franchisee.firstImg} alt="업체" width="74" height="74" />
                </div>
                <div className="find__node__info">
                    <strong className="find__node__name">{franchisee.name}</strong>
                    <div className="find__node__tel">
                        {franchisee.tel.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-")}
                    </div>
                    <div className="find__node__address">{franchisee.address.road}</div>
                </div>
            </div>
            <div className="find__node__button">
                <button className="find__node__btn" onClick={goPlace}>가맹점 보기</button>
            </div>
        </div>
    );
}

function FranchiseeFind() {

    const [telActive, setTelActive] = useState(true);
    const [telValue, setTelValue] = useState("");
    const [telInvalid, setTelInvalid] = useState(true);

    const [bsnsActive, setBsnsActive] = useState(false);
    const [bsnsValue, setBnsnValue] = useState("");
    const [bsnsInvalid, setBnsnInvalid] = useState(true);

    const [franActive, setFranActive] = useState(false);
    const [franValue, setFranValue] = useState("");
    const [franInvalid, setFranInvalid] = useState(true);

    const [btnEnable, setBtnEnable] = useState(false);
    const [selValue, setSelValue] = useState("02");

    const [franchiseeList, setFranchiseeList] = useState(null);
    const [searchPage, setSearchPage] = useState(true);

    useEffect(() => {
        buttonEnableCheck();
    }, [telActive, telInvalid, bsnsActive, bsnsInvalid, franActive, franInvalid])

    const telClick = () => {
        setTelActive(true);
        setBsnsActive(false);
        setFranActive(false);
    }

    const bsnsClick = () => {
        setTelActive(false);
        setBsnsActive(true);
        setFranActive(false);
    }

    const farnClick = () => {
        setTelActive(false);
        setBsnsActive(false);
        setFranActive(true);
    }

    const telChange = (e) => {
        const input = e.nativeEvent.data
        if (!(input >= 0 && input <= 9)) return;

        const value = e.target.value;

        if (value.length <= 8) {
            setTelValue(value);
            if (value.length >= 7) setTelInvalid(false);
            else setTelInvalid(true);
        }
    }

    const bsnsChange = (e) => {
        const input = e.nativeEvent.data
        if (!(input >= 0 && input <= 9)) return;

        const value = e.target.value;

        if (value.length <= 10) {
            setBnsnValue(value);
            if (value.length === 10) setBnsnInvalid(false);
            else setBnsnInvalid(true);
        }
    }

    const franChange = (e) => {
        let value = e.target.value;

        if (value === " ") value = "";
        setFranValue(value);
        if (value.length === 0) setFranInvalid(true);
        else setFranInvalid(false);
    }

    const buttonEnableCheck = () => {
        if (telActive) {
            setBtnEnable(!telInvalid);
        } else if (bsnsActive) {
            setBtnEnable(!bsnsInvalid);
        } else if (franActive) {
            setBtnEnable(!franInvalid);
        }
    }



    const toggle = () => {
        setSearchPage(!searchPage);
    }

    const handleOnKeyPress = (e) => {
        if (e.key === 'Enter') {
            getFranList();
        }
    }

    const [paramkeyword, setParamkeyword] = useState({});

    const searchFranchisee = (params, successCallback, failCallback) => {
        instance({
            method: "get",
            url: "/franchisee/search",
            params: params
        }).then(function (res) {
            successCallback(res);
            setParamkeyword(params);

        }).catch(function (err) {
            failCallback(err)
        })
    }

    const getFranList = (e, page) => {
        const params = {
            businessNum: "",
            tel: "",
            name: ""
        };

        const successCallback = (res) => {
            if (res.status === 200) {
                window.scrollTo(0, 0);
                setFranchiseeList(res.data);
                // console.log('success', res.data);
                setSearchPage(false);
            }
        }

        const failCallback = (err) => {
            window.scrollTo(0, 0);
            setFranchiseeList(null);
            // console.log('fail', err);
            setSearchPage(false);
        }

        if (telActive) params.tel = selValue + telValue;
        if (bsnsActive) params.businessNum = bsnsValue;
        if (franActive) params.name = franValue;
        if (page !== undefined) params.page = page;

        searchFranchisee(params, successCallback, failCallback);
    }

    return (
        <>
            <ScrollToTop />
            <Header></Header>
            <Container style={{ marginTop: "109px" }}>
                {
                    !searchPage && (
                        <>
                            <button className="back__button" onClick={toggle}><BiArrowBack /></button>
                            <FanchiseeNodeList searchData={franchiseeList} paramkeyword={paramkeyword} />
                            <div className="find__list__pagination">
                                {
                                    (franchiseeList != null) && (
                                        <Pagination
                                            style={{ marginTop: "60px" }}
                                            count={Math.ceil(franchiseeList.searchCount / 5)}
                                            shape="rounded"
                                            siblingCount={3}
                                            variant="outlined"
                                            onChange={getFranList}
                                            showFirstButton
                                            showLastButton
                                        />
                                    )
                                }
                                {
                                    (franchiseeList == null) && (
                                        <div className="find__list__empty">
                                            <h1>
                                                <TbBoxOff
                                                    style={{
                                                        color: "#4187f5",
                                                        marginTop: "50px",
                                                    }}
                                                />
                                            </h1>
                                            <div>
                                                <p>등록된 가맹점이 없습니다</p>
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                        </>
                    )
                }
                {
                    searchPage && (
                        <div className="find__main">
                            <div className="find__main__header">
                                <strong className="find__main__sub">조회 방법 선택</strong>
                            </div>
                            <div className="find__main__control">
                                <div className="cntl__sel">
                                    <Form.Check.Input id="tel" type="radio" name="search" defaultChecked={telActive} onClick={telClick} />
                                    <label htmlFor="tel">전화번호로 검색</label>
                                </div>
                                <div className="cntl__input">
                                    <Form.Select disabled={!telActive} value={selValue} onChange={(e) => { setSelValue(e.target.value) }}>
                                        {
                                            ["02", "031", "032", "033", "041", "042", "043", "044", "051",
                                                "052", "053", "054", "055", "061", "062", "063", "064", "010"].map((localNum, idx) => {
                                                    return (
                                                        <option key={idx} value={localNum}>{localNum}</option>
                                                    );
                                                })
                                        }
                                    </Form.Select>
                                    <Form.Control
                                        type="text"
                                        placeholder="전화번호 (&quot;-&quot; 제외) 를 입력하세요."
                                        isInvalid={telInvalid && telActive}
                                        disabled={!telActive}
                                        onChange={telChange}
                                        onKeyPress={handleOnKeyPress}
                                        value={telValue}
                                    />
                                </div>
                                {
                                    (telInvalid && telActive) && (
                                        <Form.Text className="cntl__danger">
                                            전화번호를 정확히 입력해주세요.
                                        </Form.Text>
                                    )
                                }

                            </div>
                            <div className="find__main__control">
                                <div className="cntl__sel">
                                    <Form.Check.Input id="bsns" type="radio" name="search" defaultChecked={bsnsActive} onClick={bsnsClick} />
                                    <label htmlFor="bsns">사업자 번호로 검색</label>
                                </div>
                                <div className="cntl__input">
                                    <Form.Control
                                        type="text"
                                        placeholder="사업자 번호 (&quot;-&quot; 제외) 를 입력하세요."
                                        isInvalid={bsnsInvalid && bsnsActive}
                                        disabled={!bsnsActive}
                                        onChange={bsnsChange}
                                        onKeyPress={handleOnKeyPress}
                                        value={bsnsValue}
                                    />
                                </div>
                                {
                                    (bsnsInvalid && bsnsActive) && (
                                        <Form.Text className="cntl__danger">
                                            사업자등록번호를 정확히 입력해주세요.
                                        </Form.Text>
                                    )
                                }

                            </div>
                            <div className="find__main__control">
                                <div className="cntl__sel">
                                    <Form.Check.Input id="fran" type="radio" name="search" defaultChecked={franActive} onClick={farnClick} />
                                    <label htmlFor="fran">가맹점 이름으로 검색</label>
                                </div>
                                <div className="cntl__input">
                                    <Form.Control
                                        type="text"
                                        placeholder="가맹점 명을 입력하세요."
                                        isInvalid={franInvalid && franActive}
                                        disabled={!franActive}
                                        onChange={franChange}
                                        onKeyPress={handleOnKeyPress}
                                        value={franValue}
                                    />
                                </div>
                                {
                                    (franInvalid && franActive) && (
                                        <Form.Text className="cntl__danger">
                                            가맹점 명을 정확히 입력해주세요.
                                        </Form.Text>
                                    )
                                }

                            </div>
                            <div className="find__button">
                                <Button disabled={!btnEnable} onClick={getFranList}>
                                    조회
                                </Button>
                            </div>
                        </div>
                    )
                }
            </Container>
            <Footer></Footer>
        </>
    );
}
export default FranchiseeFind;