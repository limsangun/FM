import React, { useState } from "react";
import NaverApiMap from "../apis/NaverAPIMap";
import SearchResultList from "../template/SearchResultList";
import SearchBar from "../template/SearchBar";
import "../css/Map.css";
import SearchDetail from "../template/SearchDetail";
import MapNavbar from "../template/MapNavbar";
import { instance } from '../template/AxiosConfig/AxiosInterceptor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { naver } = window;

function Map() {
    // offcanvase 옵션 배경 스크롤 허용 클릭 허용
    // const options1 = {
    //     name: '',
    //     scroll: true,
    //     backdrop: false,
    // };

    const [searchData, setSearchData] = useState([{
        name: '',
        tel: '',
        firstImg: ''
    }]);

    let [searchResultToggle, setsearchResultToggle] = useState(false);
    let [detailTog, setDetailTog] = useState(false);
    let [clickMarkerBN, setClickMarkerBN] = useState("");
    const [keyword, setKeyword] = useState('');
    const [searchPage, setSearchPage] = useState(1);
    let placeMarker;

    const searchMarkerTogOpen = (e) => {
        setsearchResultToggle((searchResultToggle = true));
        if (e != null) {
            setSearchData(e);
        } else {
            setSearchData({});
        }
    }

    // 글자수 제한
    const checkStringCount = (value, count) => {
        value = String(value);
        if (value.length > count) {
            return value.substr(0, count - 1) + ' ...';
        } else return value;
    };

    const searchAjax = (inputkeyword) => {
        instance({
            method: "get",
            url:
                `/franchisee/search/keyword?keyword=` + inputkeyword,
        }).then(function (res) {
            setSearchData([]);
            setSearchData(res.data);
            setKeyword(inputkeyword);
            let searchPlace = new naver.maps.LatLng(res.data.franchisees[0].y, res.data.franchisees[0].x);
            test.map.setCenter(searchPlace);
            test.removePlaceMarker();
            test.removeCluster();
            test.map.setZoom(16);
            placeMarker = new naver.maps.Marker({
                position: naver.maps.LatLng(searchPlace),
                map: test.map,
                icon: {
                    content: [
                        '<div class="naverApiMap-mappingMarker">',
                        '<div class="naverApiMap-mappingMarker--imageZone">',
                        '<img src="' + process.env.PUBLIC_URL + '/img/restImg.png">',
                        "</div>",
                        '<div class="naverApiMap-mappingMarker--mainZone">',
                        '<div class="naverApiMap-mappingMarker--titleZone">',
                        "<span>",
                        checkStringCount(res.data.franchisees[0].name, 5),
                        "</span>",
                        "</div>",
                        '<div class="naverApiMap-mappingMarker--phoneNumberZone">',
                        "<span>",
                        res.data.franchisees[0].tel.substring(0, 2) === "02" ?
                            res.data.franchisees[0].tel.replace(
                                /(\d{2})(\d{3,4})(\d{4})/,
                                "$1-$2-$3"
                            )
                            : res.data.franchisees[0].tel.replace(
                                /(\d{3})(\d{3,4})(\d{4})/,
                                "$1-$2-$3"
                            ),
                        "</span>",
                        "</div>",
                        "</div>",
                        "</div>",
                    ].join(""),
                    anchor: new naver.maps.Point(25, 60),
                },
                title: res.data.franchisees[0].businessNumber
            })
            naver.maps.Event.addListener(placeMarker, "click", function (e) {
                detailTogClose();
                detailTogOpen(e.overlay.title);
            })
            test.placeMarker.push(placeMarker);

            test.movedCenterCircle.setVisible(false);
            document.querySelector('#btnSearchListOpen').addEventListener('click', function () { searchMarkerTogOpen(res.data); });

        }).catch(function (err) {
            setSearchData([]);
            toast.error('검색결과가 없습니다', toast.toastDefaultOption);
            // document.querySelector('#btnSearchListOpen').addEventListener('click', function(){console.log(searchData)});
            document.querySelector('#btnSearchListOpen').addEventListener('click', function () { searchMarkerTogOpen(null) });
        });
    }

    const searchResultTogOpen = (inputkeyword) => {
        if (searchResultToggle === false) {
            setsearchResultToggle((searchResultToggle = true));
        }
        searchAjax(inputkeyword);
    };
    // const searchResultTogClose = () => {
    //     setsearchResultToggle((searchResultToggle = false));
    // };
    const detailTogOpen = (businessNumber) => {
        if (detailTog === false) {
            setDetailTog((detailTog = true));
        }
        setClickMarkerBN(businessNumber);
        if (searchResultToggle === false) {
            setsearchResultToggle((searchResultToggle = true));
        }
    }

    const detailSearchTogOpen = (businessNumber, ele) => {
        let choicePlace = new naver.maps.LatLng(ele.y, ele.x);
        test.map.setCenter(choicePlace);
        test.removePlaceMarker();
        test.map.setZoom(17);
        if (test.markers.length === 0) {
            placeMarker = new naver.maps.Marker({
                position: naver.maps.LatLng(choicePlace),
                map: test.map,
                icon: {
                    content: [
                        '<div class="naverApiMap-mappingMarker">',
                        '<div class="naverApiMap-mappingMarker--imageZone">',
                        '<img src="' + process.env.PUBLIC_URL + '/img/restImg.png">',
                        "</div>",
                        '<div class="naverApiMap-mappingMarker--mainZone">',
                        '<div class="naverApiMap-mappingMarker--titleZone">',
                        "<span>",
                        checkStringCount(ele.name, 5),
                        "</span>",
                        "</div>",
                        '<div class="naverApiMap-mappingMarker--phoneNumberZone">',
                        "<span>",
                        ele.tel.substring(0, 2) === "02" ?
                            ele.tel.replace(
                                /(\d{2})(\d{3,4})(\d{4})/,
                                "$1-$2-$3"
                            )
                            : ele.tel.replace(
                                /(\d{3})(\d{3,4})(\d{4})/,
                                "$1-$2-$3"
                            ),
                        "</span>",
                        "</div>",
                        "</div>",
                        "</div>",
                    ].join(""),
                    anchor: new naver.maps.Point(25, 60),
                },
                title: ele.businessNumber
            })
            naver.maps.Event.addListener(placeMarker, "click", function (e) {
                detailTogClose();
                detailTogOpen(e.overlay.title);
            })
            test.placeMarker.push(placeMarker);
        }

        setDetailTog((detailTog = true));
        setClickMarkerBN(businessNumber);
    }
    const detailTogClose = () => {
        setDetailTog((detailTog = false));
    }

    test.togOn = (title, data) => { detailTogOpen(title); searchMarkerTogOpen(data); };

    return (
        <>
            <div className="outline">
                <MapNavbar detailTogOpen={detailTogOpen} detailTogClose={detailTogClose} searchMarkerTogOpen={searchMarkerTogOpen} />
                <NaverApiMap detailTogOpen={detailTogOpen} detailTogClose={detailTogClose} searchMarkerTogOpen={searchMarkerTogOpen}></NaverApiMap>
                <SearchDetail detailTogOpen={detailTogOpen} detailTogClose={detailTogClose} detailTogObj={{ detailTog, setDetailTog, clickMarkerBN }}></SearchDetail>
                {/* <SearchDetail options={options1} detailTogOpen={detailTogOpen} detailTogClose={detailTogClose} detailTogObj={{ detailTog, setDetailTog, clickMarkerBN }}></SearchDetail> */}
                <SearchResultList searchPage={searchPage} setSearchPage={setSearchPage} resultTog={{ searchResultToggle, setsearchResultToggle }} searchData={{ searchData, setSearchData }} detailSearchTogOpen={detailSearchTogOpen} detailTogClose={detailTogClose} keyword={keyword} detailTog={detailTog} />
                {/* <SearchResultList searchPage={searchPage} setSearchPage={setSearchPage} options={options1} resultTog={{ searchResultToggle, setsearchResultToggle }} searchData={{ searchData, setSearchData }} detailSearchTogOpen={detailSearchTogOpen} detailTogClose={detailTogClose} keyword={keyword} detailTog={detailTog} /> */}
                <div className="searchBarContainer">
                    <SearchBar setSearchPage={setSearchPage} searchResultTogOpen={searchResultTogOpen} detailTogClose={detailTogClose} keyword={keyword}></SearchBar>
                </div>
                <div className="container"></div>
            </div>
        </>
    );
}

export default Map;
