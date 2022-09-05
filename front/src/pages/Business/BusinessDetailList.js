import '../../css/Business/BusinessDetailList.css';
import { AiFillInfoCircle } from 'react-icons/ai';
import { MdFastfood } from 'react-icons/md';
import { CgTimelapse } from 'react-icons/cg';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TbCheck } from 'react-icons/tb';
import React, { useState } from 'react';
import { TablePagination } from "@mui/material";
import { instance } from '../../template/AxiosConfig/AxiosInterceptor';

function BusinessDetailList({ setBusinessPageNum, info, franList, setFranList, searchCount, setSearchCount, franPage, setfranPage, franDetailList, setFranDetailList }) {
    const [toolCheck, setToolCheck] = useState(false);
    //가맹점 페이징
    // const [franPage, setFranPage] = React.useState(1);


    const franListPage = (value) => {
        instance({
            method: "get",
            url: "/member/" + localStorage.getItem("userId") + "/franchisee",
            params: { page: value },
        })
            .then(function (res) {
                let list = [];
                for (let idx = 0; idx < res.data.franchisees.length; idx++) {
                    list.push(res.data.franchisees[idx]);
                }
                setFranList({ list });
            })
            .catch((err) => {
            });
    };

    const handleChangePage = (event, newPage) => {
        setfranPage(newPage + 1);
        franListPage(newPage + 1)
    };


    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3" id="BusinessDetailList-popoverHeader">내 업체 목록</Popover.Header>
            <Popover.Body>
                {franDetailList.length > 0 ? (franDetailList.map((ele, idx) => {
                    return (
                        <div key={idx}>
                            <Link
                                to={"/businessDetail"}
                                state={{ businessNumber: `${ele.businessNumber}`, list: { franList }, searchCount: { searchCount }, data: { ele }, franPage: { franPage } }}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                }}
                                onClick={(e) => { setToolCheck(false); setBusinessPageNum(0) }}
                            >
                                <div className='businessDetailList-listZone'>
                                    <img className='businessDetailList-businessImg' alt="가게이미지" src={`${process.env.REACT_APP_SERVER_URL}${ele.firstImg}`} />
                                    <span className='businessDetailList-businessName'> {ele.name.length < 8 ? ele.name : ele.name.slice(0, 9) + '...'}</span>
                                    <span className='businessDetailList-buttonZone'>
                                        {ele.businessNumber === info.businessNumber ? (<button className='businessDetailList-selectBtn'><TbCheck id="businessDetailList-check" /></button>) : (<button className='businessDetailList-Btn'></button>)}
                                    </span>
                                    <hr />
                                </div>
                            </Link>
                        </div>
                    )
                })) : null}

                {/* {(franList.list) ? ((franList.list).map((ele, idx) => {
                    return (
                        <div key={idx}>
                            <Link
                                to={"/businessDetail"}
                                state={{ businessNumber: `${ele.businessNumber}`, list: { franList }, searchCount: { searchCount }, data: { ele }, franPage: { franPage } }}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                }}
                                onClick={(e) => { setToolCheck(false); setBusinessPageNum(0) }}
                            >
                                <div className='businessDetailList-listZone'>
                                    <img className='businessDetailList-businessImg' alt="가게이미지" src={`${process.env.REACT_APP_SERVER_URL}${ele.firstImg}`} />
                                    <span className='businessDetailList-businessName'> {ele.name.length < 8 ? ele.name : ele.name.slice(0, 9) + '...'}</span>
                                    <span className='businessDetailList-buttonZone'>
                                        {ele.businessNumber === info.businessNumber ? (<button className='businessDetailList-selectBtn'><TbCheck id="businessDetailList-check" /></button>) : (<button className='businessDetailList-Btn'></button>)}
                                    </span>
                                    <hr />
                                </div>
                            </Link>

                        </div>
                    )
                }
                )) : ((franList.franList.list).map((ele, idx) => {
                    return (
                        <div key={idx}>
                            <Link
                                to={"/businessDetail"}
                                state={{ businessNumber: `${ele.businessNumber}`, list: { franList }, searchCount: { searchCount }, data: { ele }, franPage: { franPage } }}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                }}
                                onClick={(e) => { setToolCheck(false); }}
                            >
                                <div className='businessDetailList-listZone' >
                                    <img className='businessDetailList-businessImg' alt="가게이미지" src={`${process.env.REACT_APP_SERVER_URL}${ele.firstImg}`} />
                                    <span className='businessDetailList-businessName'> {ele.name.length < 9 ? ele.name : ele.name.slice(0, 6) + '...'}</span>
                                    <span className='businessDetailList-buttonZone'>
                                        {ele.businessNumber === info.businessNumber ? (<button className='businessDetailList-selectBtn'><TbCheck id="businessDetailList-check" /></button>) : (<button className='businessDetailList-Btn'></button>)}
                                    </span>
                                    <hr />
                                </div>
                            </Link>
                            {(() => {
                                if (idx === 4) {
                                    return (
                                        <TablePagination
                                            component="div"
                                            count={searchCount.searchCount.searchCount}
                                            page={franPage - 1}
                                            labelRowsPerPage=""
                                            onPageChange={handleChangePage}
                                            rowsPerPage={5}
                                            rowsPerPageOptions={[]}
                                        />
                                    );
                                }
                            })()}
                        </div>
                    )
                }))} */}

                <TablePagination
                    component="div"
                    count={searchCount.searchCount}
                    page={franPage - 1}
                    labelRowsPerPage=""
                    onPageChange={handleChangePage}
                    rowsPerPage={5}
                    rowsPerPageOptions={[]}
                />
            </Popover.Body>
        </Popover >
    );

    return (
        <>
            <div className="businessDetailList-sidebarzone">
                <div className='businessDetailList-titlezone'>
                    <div className='businessDetailList-titlezone--imagezone'>
                        <img src='./img/usermarker.png' alt='대표이미지' />
                    </div>
                    <div className='businessDetailList-titlezone--textzone'>
                        <strong>{info.name}</strong>
                    </div>
                    <OverlayTrigger trigger="click" placement="right" overlay={popover} show={toolCheck}>
                        <div role="button" className='businessDetailList-titlezone--buttonzone' onClick={(e) => { setToolCheck(!toolCheck) }}><BsFillArrowRightCircleFill role='button' style={{ fontSize: '18pt' }} /></div>
                    </OverlayTrigger>
                </div>
                <div className='businessDetailList-contentzone'>
                    <ul className='businessDetailList-contentzone__contentlist'>
                        <li className='businessDetailList-li' onClick={() => setBusinessPageNum(0)}><AiFillInfoCircle style={{ fontSize: '18pt' }} /><span>&nbsp;&nbsp;&nbsp;기본정보</span></li>
                        <li className='businessDetailList-li' onClick={() => setBusinessPageNum(1)}><MdFastfood style={{ fontSize: '18pt' }} /><span>&nbsp;&nbsp;&nbsp;메뉴정보</span></li>
                        <li className='businessDetailList-li' onClick={() => setBusinessPageNum(2)}><CgTimelapse style={{ fontSize: '18pt' }} /><span>&nbsp;&nbsp;&nbsp;영업시간</span></li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default BusinessDetailList;