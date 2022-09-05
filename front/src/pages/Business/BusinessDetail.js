import React, { useEffect, useState } from 'react'
import MainHeader from '../../template/MainHeader'
import "../../css/Business/BusinessDetail.css"
import { BusinessDetailInfo } from './BusinessDetailInfo'
import BusinessDetailList from './BusinessDetailList'
import { BusinessDetailMenu } from './BusinessDetailMenu'
import BusinessDetailRunTime from './BusinessDetailRunTime'
import { instance } from "../../template/AxiosConfig/AxiosInterceptor";
import DelFranModals from "../DelFranModals";
import { useLocation, useNavigate } from 'react-router-dom';
import { createContext } from "react";
import ScrollToTop from '../../template/ScrollToTop'

export const BusinessContext = createContext();

const MainZone = () => {
    const { state } = useLocation()
    let navigate = useNavigate();
    //가맹점 정보
    const [franList, setFranList] = useState((() => {
        if (state.list.franList == null) {
            return (state.list);
        } else {
            return (state.list.franList);
        }
    })());
    const [searchCount, setSearchCount] = useState((() => {
        if (state.list.franList == null) {
            return (state.searchCount);
        } else {
            return (state.searchCount.searchCount);
        }
    })());
    const [businessPageNum, setBusinessPageNum] = useState(0);
    //모달 띄우기
    const [showDelModal, setShowDelModal] = useState(false);
    const [businessdata, setBusinessData] = useState({});

    const [franBackImg, setFranBackImg] = useState([]);

    // 가맹점 내업체 리스트 페이지
    const [franPage, setfranPage] = React.useState((() => {
        if (state.query) {
            return 1;
        } else {
            return (state.franPage.franPage);
        }
    }));

    const [businessDetailInfo, setBusinessDetailInfo] = useState({
        address: {
            jibun: '',
            road: '',
            postalcode: ''
        },
        firstImg: '',
        tel: ''
    });
    useEffect(() => {
        instance({
            method: "get",
            url: `/franchisee/` + state.businessNumber,
        }).then(function (res) {
            setBusinessDetailInfo(res.data);
        });
        instance({
            method: "get",
            url: `/franchisee/` + state.businessNumber + "/images",
        }).then(function (res) {
            setFranBackImg(res.data);
        }).catch(function (err) {
            setFranBackImg([]);
        });

        // instance({
        //     method: "get",
        //     url: "/member/" + localStorage.getItem("userId") + "/franchisee",
        //     params: { page: franPage },
        // })
        // .then(function (res) {
        // })
        // .catch((err) => {
        // });
    }, [state, searchCount, franList]);

    const [franDetailList, setFranDetailList] = useState({});

    useEffect(() => {
        instance({
            method: "get",
            url: "/member/" + localStorage.getItem("userId") + "/franchisee",
            params: { page: franPage },
        })
            .then(function (res) {
                setFranDetailList(res.data.franchisees);
            })
            .catch((err) => {
            });
    }, [businessDetailInfo])

    const goPlace = () => {
        navigate('/map', { state: [businessDetailInfo] });
    }

    return (
        <>
            <ScrollToTop />
            <BusinessContext.Provider value={{ businessDetailInfo, setBusinessDetailInfo }}>
                <div style={{ overflowX: "hidden" }}>
                    <BusinessDetailList info={businessDetailInfo} businessPageNum={businessPageNum} setBusinessPageNum={setBusinessPageNum} list={state.list} franList={franList} setFranList={setFranList} searchCount={searchCount} setSearchCount={setSearchCount} franPage={franPage} setfranPage={setfranPage} franDetailList={franDetailList} setFranDetailList={setFranDetailList} />
                    <div className='businessDetail--mainZone'>
                        <div className='businessDetail--mainZone__img1' alt="가맹점이미지" style={{ backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}${businessDetailInfo.firstImg})` }}>
                            <div className='businessDetail--mainZone__img2'>
                            </div>
                        </div>
                        <span className='businessDetail--mainZone__name'>{businessDetailInfo.name}</span>
                        <div className='businessDetail--mainZone__phoneText'>전화번호</div>
                        <div className='businessDetail--mainZone__phoneZone'>
                            <span>
                                {businessDetailInfo.tel.substring(0, 2) === "02" ?
                                    businessDetailInfo.tel.replace(
                                        /(\d{2})(\d{3,4})(\d{4})/,
                                        "$1-$2-$3"
                                    )
                                    : businessDetailInfo.tel.replace(
                                        /(\d{3})(\d{3,4})(\d{4})/,
                                        "$1-$2-$3"
                                    )}
                            </span>
                        </div>
                        <div className='businessDetail--mainZone__BtnZone'>
                            <button className='businessDetail--mainZone__BtnZone-Btn' onClick={() => { goPlace(); }}>내 플레이스 보기</button>
                            <button className='businessDetail--mainZone__BtnZone-Btn' onClick={(e) => { setShowDelModal(true); setBusinessData(businessDetailInfo); }}>업체 삭제</button>
                        </div>
                    </div>
                    <div>
                        {businessPageNum === 0 ? (<BusinessDetailInfo franBackImg={franBackImg} setFranBackImg={setFranBackImg} />) : (businessPageNum === 1 ? (<BusinessDetailMenu businessNumber={businessDetailInfo.businessNumber} />) : (<BusinessDetailRunTime businessNumber={businessDetailInfo.businessNumber} businessDetailInfo={businessDetailInfo} setBusinessDetailInfo={setBusinessDetailInfo} />))}
                    </div>
                </div>
                {showDelModal ? (
                    <DelFranModals
                        show={showDelModal}
                        setShow={setShowDelModal}
                        data={businessdata}
                    />
                ) : null}
            </BusinessContext.Provider>
        </>
    )
}
export const BusinessDetail = () => {
    return (
        <>
            <MainHeader></MainHeader>
            <MainZone />
        </>
    )
}
