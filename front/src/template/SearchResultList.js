import React from "react";
import { Offcanvas, Card } from "react-bootstrap";
import "../css/SearchResultList.css";
import { TbBoxOff } from 'react-icons/tb';
import { instance } from './AxiosConfig/AxiosInterceptor';
import { Pagination, Stack } from "@mui/material";
import { BsChevronDoubleLeft } from 'react-icons/bs';
// import ScrollToTop from '../template/ScrollToTop';

function SearchResultList({ searchPage, setSearchPage, resultTog, searchData, detailSearchTogOpen, detailTogClose, keyword, detailTog }) {
    // console.log('options', options);
    // 글자수 제한
    const checkStringCount = (value, count) => {
        value = String(value);
        if (value.length > count) {
            return value.substr(0, count - 1) + ' ...';
        } else return value;
    };

    const resultClose = () => {
        detailTogClose();
        resultTog.setsearchResultToggle(false);
    }

    // const [searchPage, setSearchPage] = React.useState(1);
    const moreSearchAjax = (value) => {
        instance({
            method: "get",
            url:
                `/franchisee/search/keyword?keyword=` + keyword,
            params: { page: value },
        }).then(function (res) {
            searchData.setSearchData(res.data);

        });
    };
    const handleChange = (event, value) => {
        setSearchPage(value);
        moreSearchAjax(value);
    };

    const offcanOptions = {
        scroll: true,
        backdrop: false
    }

    return (
        <>
            <Offcanvas
                className={"searchResultlist-offcanvas"}
                show={resultTog.searchResultToggle}
                onHide={resultClose}
                // {...options}
                {...offcanOptions}
            >
                <Offcanvas.Header closeButton className="searchResultlist-offcanvas--headerzone">
                    <Offcanvas.Title></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body
                    className={"searchResultlist-offcanvasbody--bodyzone"}
                    style={{ marginTop: "20px" }}
                >
                    {(() => {
                        //시작
                        if (searchData.searchData.searchCount > 0) {
                            //키워드검색
                            return searchData.searchData.franchisees.map((ele, idx) => {
                                return (
                                    <div key={idx}>
                                        <Card className="searchResultlist-offcanvasbody--cardzone"
                                            onClick={() => { detailSearchTogOpen(ele.businessNumber, ele); }}
                                        >
                                            <Card.Body>
                                                <Card.Title className="searchResultlist-offcanvasbody--textzone">
                                                    <Card.Text className="searchResultlist-offcanvasbody__title">
                                                        {checkStringCount(ele.name, 11)}
                                                    </Card.Text>
                                                    <Card.Text className="text-muted searchResultlist-offcanvasbody__tel">
                                                        {ele.tel.substring(0, 2) === "02" ? ele.tel.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3") : ele.tel.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")}
                                                    </Card.Text>
                                                    <Card.Text className="text-muted searchResultlist-offcanvasbody__intro">
                                                        {checkStringCount(ele.intro, 58)}
                                                    </Card.Text>
                                                </Card.Title>
                                                {(() => {
                                                    if (ele.firstImg !== '/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg') {
                                                        if (ele.firstImg !== process.env.REACT_APP_SERVER_URL + '/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg') {
                                                            return (
                                                                <Card.Img
                                                                    className="searchResultlist-offcanvasbody--cardzone__img"
                                                                    variant="right"
                                                                    src={`${process.env.REACT_APP_SERVER_URL}${ele.firstImg}`}
                                                                />
                                                            )
                                                        }
                                                    }
                                                })()}
                                                {/* <Card.Img
                                                    className="searchResultlist-offcanvasbody--cardzone__img"
                                                    variant="right"
                                                    src={`${process.env.REACT_APP_SERVER_URL}${ele.firstImg}`}
                                                /> */}
                                            </Card.Body>
                                        </Card>
                                        {(() => {
                                            if (idx === searchData.searchData.franchisees.length - 1) {
                                                return (
                                                    <Stack spacing={2}>
                                                        <Pagination page={searchPage} count={Math.ceil(searchData.searchData.searchCount / 10)} color="primary" onChange={handleChange} />
                                                    </Stack>
                                                );
                                            }
                                        })()}
                                    </div>
                                );
                            })
                        } else if (searchData.searchData.length > 0) {
                            //주변장소 검색
                            return searchData.searchData.map((ele, idx) => {
                                return (
                                    <div key={idx} >
                                        <Card className="searchResultlist-offcanvasbody--cardzone"
                                            onClick={() => { detailSearchTogOpen(ele.businessNumber, ele); }}
                                        >
                                            <Card.Body>
                                                <Card.Title className="searchResultlist-offcanvasbody--textzone">
                                                    <Card.Text className="searchResultlist-offcanvasbody__title">
                                                        {checkStringCount(ele.name, 11)}
                                                    </Card.Text>
                                                    <Card.Text className="text-muted searchResultlist-offcanvasbody__tel">
                                                        {ele.tel.substring(0, 2) === "02" ? ele.tel.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3") : ele.tel.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")}
                                                    </Card.Text>
                                                    <Card.Text className="text-muted searchResultlist-offcanvasbody__intro">
                                                        {checkStringCount(ele.intro, 58)}
                                                    </Card.Text>
                                                </Card.Title>
                                                {(() => {
                                                    if (ele.firstImg !== '/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg') {
                                                        if (ele.firstImg !== process.env.REACT_APP_SERVER_URL + '/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg') {
                                                            return (
                                                                <Card.Img
                                                                    className="searchResultlist-offcanvasbody--cardzone__img"
                                                                    variant="right"
                                                                    src={`${process.env.REACT_APP_SERVER_URL}${ele.firstImg}`}
                                                                />
                                                            )
                                                        }
                                                    }
                                                })()}
                                            </Card.Body>
                                        </Card>
                                    </div>
                                );
                            })
                        } else {
                            //검색결과 없을 때
                            return (
                                <>
                                    <Card className="searchResultlist-offcanvasbody--defaultzone">
                                        <Card.Body>
                                            <Card.Text>
                                                <TbBoxOff style={{ color: '#4187f5', fontSize: '30pt' }} />
                                            </Card.Text>
                                            <Card.Text>
                                                검색된 결과가 없습니다.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </>
                            );
                        }
                        //끝
                    })()
                    }
                </Offcanvas.Body>
            </Offcanvas>
            {(() => {
                if (resultTog.searchResultToggle === true && detailTog === false) {
                    return (
                        <button id='btnSearchListClose' style={{ left: '462px' }} onClick={resultClose}>
                            <BsChevronDoubleLeft style={{ color: 'gray', marginLeft: '-4px' }} type='button'/>
                        </button>
                    )
                }
            })()}

        </>
    );
}

export default SearchResultList;
