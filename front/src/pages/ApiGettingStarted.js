import { Container, Row, Table, Col } from "react-bootstrap";
import Footer from "../template/Footer";
import MainHeader from "../template/MainHeader";
import JSONPretty from 'react-json-pretty';
import '../css/ApiDocument.css'
import '../css/ApiGettingStarted.css'
import ApiHeader from "../template/ApiHeader";

import { Link } from "react-router-dom";
import Scroll from 'react-scroll';

import ScrollToTop from '../template/ScrollToTop';

import { useEffect, useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import Collapse from '@mui/material/Collapse';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faPlus, faKey, faRecycle, faInfo, faBars, faImage, faClock, faArrowUp } from "@fortawesome/free-solid-svg-icons";

function ApiDocumentForm() {
    const apiToken = {
        "accessToken": "iLCJleHAiOjE2NTk0OTk3NDUsImVtYWlsIjoianNwOTk3MEBuYXZlci5jb20ifQ.iHVHwjZ11"
    }
    const host = 'fm.bizplay.shop';
    const apiDocuments = {
        mainTitle: "가맹점 API 사용",
        contents: [
            {
                tagId: "franchisee-search",
                title: "가맹점 정보 검색",
                intro: `<p>가맹점 정보를 제공하는 API입니다. 가맹점의 사업자번호, 가맹점 명, 주소, 좌표, 전화번호 등의 다양한 정보를 함께 제공합니다.</p>
                <p>발급 받은 JWT 토큰을 헤더에 담아 <code>GET</code>으로 요청합니다. 페이지 번호, 한 페이지 결과 수와 함께 결과 형식 파라미터의 값을 선택적으로 추가할 수 있습니다.</p>
                <p>응답은 <code>JSON</code>과 <code>XML</code> 형식을 지원합니다. 요청 시 파라미터의 <code>resultType</code> 부분에 원하는 응답 형식을 지정할 수 있습니다. 별도로 포맷을 지정하지 않은 경우 응답은 <code>JSON</code> 형식으로 반환됩니다.</p>`,
                request: {
                    method: "GET",
                    path: "/open-api/v1/franchisee/",
                    host: host,
                    parameter: [
                        {
                            name: "page",
                            type: "int",
                            description: "페이지 번호",
                            required: "O"
                        },
                        {
                            name: "rowsNum",
                            type: "int",
                            description: "한 페이지 결과 수",
                            required: "O"
                        },
                        {
                            name: "bsnsNm",
                            type: "String",
                            description: "가맹점명",
                            required: "X"
                        },
                        {
                            name: "resultType",
                            type: "String",
                            description: `검색 결과 제공 방식<br />
                                다음 중 하나 :<br />
                                <code>json</code>,  <code>xml</code><br />
                                (기본값 : <code>json</code>)`,
                            required: "X"
                        }
                    ]
                },
                response: [
                    {
                        title: "franchisee",
                        items: [
                            {
                                name: "businessNumber",
                                type: "String",
                                description: "사업자 번호"
                            },
                            {
                                name: "name",
                                type: "String",
                                description: "가맹점 이름"
                            },
                            {
                                name: "firstImg",
                                type: "String",
                                description: "가맹점 대표 이미지 경로"
                            },
                            {
                                name: "address",
                                type: `Address`,
                                description: "가맹점 주소"
                            },
                            {
                                name: "name",
                                type: "String",
                                description: "가맹점 이름"
                            },
                            {
                                name: "x",
                                type: "String",
                                description: "경도"
                            },
                            {
                                name: "y",
                                type: "String",
                                description: "위도"
                            },
                            {
                                name: "tel",
                                type: "String",
                                description: "가맹점 대표 전화번호"
                            },
                            {
                                name: "ownerName",
                                type: "String",
                                description: "가맹점 대표자 이름"
                            },
                            {
                                name: "intro",
                                type: "String",
                                description: "가맹점 소개"
                            },
                            {
                                name: "createDate",
                                type: "String",
                                description: "가맹점 등록 날짜"
                            }
                        ]
                    },
                    {
                        title: "Address",
                        items: [
                            {
                                name: "postalCode",
                                type: "String",
                                description: "우편번호"
                            },
                            {
                                name: "road",
                                type: "String",
                                description: "도로명"
                            },
                            {
                                name: "jibun",
                                type: "String",
                                description: "지번명"
                            },
                            {
                                name: "detail",
                                type: "String",
                                description: "상세주소"
                            },
                        ]
                    }
                ],
                sample: {
                    request: {
                        url: "&quot;https://" + host + "/open-api/v1/franchisee?page=1&#38;rowsNum=5&quot;",

                    },
                    response: {
                        object: {
                            "franchisees": [
                                {
                                    "businessNumber": "7511024245",
                                    "name": "(주) C.H.B Company 이랴이랴",
                                    "firstImg": "/test/test.jpg",
                                    "address": {
                                        "postalCode": "123456789",
                                        "road": "부산광역시 수영구 광안로 9, 2~3층 (광안동)",
                                        "jibun": "부산광역시 수영구 광안동 144 - 25 외1필지 (2~3층) ",
                                        "detail": "null"
                                    },
                                    "x": 129.1140697,
                                    "y": 35.1571629,
                                    "tel": "0517511024",
                                    "ownerName": "kim",
                                    "intro": "testasdf",
                                    "createDate": "2022-07-15 12:08:06"
                                }
                            ]
                        }
                    }
                }
            },
            {
                tagId: "menu-search",
                title: "가맹점 메뉴 검색",
                intro: `<p>가맹점 메뉴를 제공하는 API입니다. 가맹점 메뉴의 이름, 가격, 이미지 경로, 소개 등의 정보를 제공합니다.</p>
                        <p>발급 받은 JWT 토큰을 헤더에 담아 <code>GET</code>으로 요청합니다. 사업자 번호와 함께 결과 형식 파라미터의 값을 선택적으로 추가할 수 있습니다.</p>
                        <p>응답은 <code>JSON</code>과 <code>XML</code> 형식을 지원합니다. 요청 시 파라미터의 <code>resultType</code> 부분에 원하는 응답 형식을 지정할 수 있습니다. 별도로 포맷을 지정하지 않은 경우 응답은 <code>JSON</code> 형식으로 반환됩니다.</p>`,
                request: {
                    method: "GET",
                    path: "/open-api/v1/franchisee/menus",
                    host: host,
                    parameter: [
                        {
                            name: "bsnsNum",
                            type: "String",
                            description: "사업자 번호",
                            required: "O"
                        },
                        {
                            name: "resultType",
                            type: "String",
                            description: `검색 결과 제공 방식<br />
                                            다음 중 하나 :<br />
                                            <code>json</code>,  <code>xml</code><br />
                                            (기본값 : <code>json</code>)`,
                            required: "X"
                        }
                    ]
                },
                response: [
                    {
                        title: "menu",
                        items: [
                            {
                                name: "name",
                                type: "String",
                                description: "메뉴명"
                            },
                            {
                                name: "image",
                                type: `Image`,
                                description: "메뉴 이미지 정보"
                            },
                            {
                                name: "description",
                                type: "String",
                                description: "메뉴 설명"
                            },
                            {
                                name: "price",
                                type: `<code>int</code>`,
                                description: "메뉴 가격"
                            },
                            {
                                name: "createDate",
                                type: "String",
                                description: "메뉴 등록 날짜"
                            }
                        ]
                    },
                    {
                        title: "Image",
                        items: [
                            {
                                name: "path",
                                type: "String",
                                description: "이미지 경로"
                            },
                            {
                                name: "name",
                                type: "String",
                                description: "이미지명"
                            },
                            {
                                name: "type",
                                type: "String",
                                description: "이미지 타입"
                            },
                            {
                                name: "createDate",
                                type: "String",
                                description: "메뉴 등록 날짜"
                            }
                        ]
                    }
                ],
                sample: {
                    request: {
                        url: "&quot;https://" + host + "/open-api/v1/franchisee/menus?bsnsNum=<span class=variable>${businessNumber}</span>&quot;"
                    },
                    response: {
                        object: {
                            "menus": [
                                {
                                    "name": "파리바게트 메뉴1",
                                    "image": {
                                        "path": "/api/v1/file/fm_34f7f1cec31a492b932eb1acbf6bdc20.jpg",
                                        "size": "15713",
                                        "name": "fm_34f7f1cec31a492b932eb1acbf6bdc20.jpg",
                                        "type": "image/jpeg",
                                        "createDate": "2022-07-22 09:28:24"
                                    },
                                    "description": "파리바게트 메뉴1 소개입니다",
                                    "price": 20000,
                                    "createDate": "2022-07-22 09:28:30"
                                },
                                {
                                    "name": "파리바게트 메뉴2",
                                    "image": {
                                        "path": "/api/v1/file/fm_331ea3db407f45508995e0b25974037c.jpg",
                                        "size": "8185",
                                        "name": "fm_331ea3db407f45508995e0b25974037c.jpg",
                                        "type": "image/jpeg",
                                        "createDate": "2022-07-22 09:28:39"
                                    },
                                    "description": "파리바게트 메뉴2입니다",
                                    "price": 15000,
                                    "createDate": "2022-07-22 09:28:45"
                                }
                            ]
                        }
                    }
                }
            },
            {
                tagId: "image-search",
                title: "가맹점 이미지 검색",
                intro: `<p>가맹점 이미지 정보를 제공하는 API입니다. 가맹점 이미지의 경로, 크기, 이름, 타입 등의 정보를 제공합니다.</p>
                        <p>발급 받은 JWT 토큰을 헤더에 담아 <code>GET</code>으로 요청합니다. 사업자 번호와 함께 결과 형식 파라미터의 값을 선택적으로 추가할 수 있습니다.</p>
                        <p>응답은 <code>JSON</code>과 <code>XML</code> 형식을 지원합니다. 요청 시 파라미터의 <code>resultType</code> 부분에 원하는 응답 형식을 지정할 수 있습니다. 별도로 포맷을 지정하지 않은 경우 응답은 <code>JSON</code> 형식으로 반환됩니다.</p>`,
                request: {
                    method: "GET",
                    path: "/open-api/v1/franchisee/images?bsnsNum=<span className=variable>${businessNumber}</span>",
                    host: host,
                    parameter: [
                        {
                            name: "bsnsNum",
                            type: "String",
                            description: "사업자 번호",
                            required: "O"
                        },
                        {
                            name: "resultType",
                            type: "String",
                            description: `검색 결과 제공 방식<br />
                                            다음 중 하나 :<br />
                                            <code>json</code>,  <code>xml</code><br />
                                            (기본값 : <code>json</code>)`,
                            required: "X"
                        }
                    ]
                },
                response: [
                    {
                        title: "Image",
                        items: [
                            {
                                name: "path",
                                type: "String",
                                description: "이미지 경로"
                            },
                            {
                                name: "name",
                                type: "String",
                                description: "이미지명"
                            },
                            {
                                name: "type",
                                type: "String",
                                description: "이미지 타입"
                            },
                            {
                                name: "createDate",
                                type: "String",
                                description: "메뉴 등록 날짜"
                            }
                        ]
                    }
                ],
                sample: {
                    request: {
                        url: "&quot;https://" + host + "/open-api/v1/franchisee/images?bsnsNum=<span class=variable>${businessNumber}</span>&quot;",

                    },
                    response: {
                        object: {
                            "images": [
                                {
                                    "path": "/api/file/a16dff995a9b4cf8a804c6332c94f803-logo.jpg",
                                    "size": "11265",
                                    "name": "a16dff995a9b4cf8a804c6332c94f803-logo.jpg",
                                    "type": "image/jpeg",
                                    "createDate": "2022-07-18 09:22:40"
                                },
                                {
                                    "path": "/api/file/9d9d583f8d56459ab458832ebc0ab77a-webcash.png",
                                    "size": "3676",
                                    "name": "9d9d583f8d56459ab458832ebc0ab77a-webcash.png",
                                    "type": "image/png",
                                    "createDate": "2022-07-15 17:25:47"
                                }
                            ]
                        }
                    }
                }
            },
            {
                tagId: "hours-search",
                title: "가맹점 영업시간 검색",
                intro: `<p>가맹점 영업시간를 제공하는 API입니다. 가맹점 영업시간을 요일별로 제공합니다.</p>
                        <p>발급 받은 JWT 토큰을 헤더에 담아 <code>GET</code>으로 요청합니다. 사업자 번호와 함께 결과 형식 파라미터의 값을 선택적으로 추가할 수 있습니다.</p>
                        <p>응답은 <code>JSON</code>과 <code>XML</code> 형식을 지원합니다. 요청 시 파라미터의 <code>resultType</code> 부분에 원하는 응답 형식을 지정할 수 있습니다. 별도로 포맷을 지정하지 않은 경우 응답은 <code>JSON</code> 형식으로 반환됩니다.</p>`,
                request: {
                    method: "GET",
                    path: "/open-api/v1/franchisee/schedule?bsnsNum=<span className=&quot;variable&quot;>${businessNumber}</span>",
                    host: host,
                    parameter: [
                        {
                            name: "bsnsNum",
                            type: "String",
                            description: "사업자 번호",
                            required: "O"
                        },
                        {
                            name: "resultType",
                            type: "String",
                            description: `검색 결과 제공 방식<br />
                                            다음 중 하나 :<br />
                                            <code>json</code>,  <code>xml</code><br />
                                            (기본값 : <code>json</code>)`,
                            required: "X"
                        }
                    ]
                },
                response: [
                    {
                        title: "Schedule",
                        items: [
                            {
                                name: "monday",
                                type: "String",
                                description: "월요일 영업시간"
                            },
                            {
                                name: "thursday",
                                type: "String",
                                description: "화요일 영업시간"
                            },
                            {
                                name: "wednesday",
                                type: "String",
                                description: "수요일 영업시간"
                            },
                            {
                                name: "thursday",
                                type: "String",
                                description: "목요일 영업시간"
                            },
                            {
                                name: "friday",
                                type: "String",
                                description: "금요일 영업시간"
                            },
                            {
                                name: "saturday",
                                type: "String",
                                description: "토요일 영업시간"
                            },
                            {
                                name: "sunday",
                                type: "String",
                                description: "일요일 영업시간"
                            },

                        ]
                    }
                ],
                sample: {
                    request: {
                        url: "&quot;https://" + host + "/open-api/v1/franchisee/schedule?bsnsNum=<span class=variable>${businessNumber}</span>&quot;",

                    },
                    response: {
                        object: {
                            monday: "09:00 ~ 18:00",
                            thursday: "09:00 ~ 18:00",
                            wednesday: "09:00 ~ 18:00",
                            tuesday: "09:00 ~ 18:00",
                            friday: "09:00 ~ 18:00",
                            saturday: "09:00 ~ 18:00",
                            sunday: "09:00 ~ 18:00"
                        }
                    }
                }
            }
        ]

    }


    // const moveToAppList = () => {
    //     window.location.href = 'http://localhost:3000/application'
    // }
    const drawerWidth = 240;
    const apiStartfunc = (ele) => {
        if (ele === 0) {
            return <FontAwesomeIcon icon={faPlus} />
        } else if (ele === 1) {
            return <FontAwesomeIcon icon={faKey} />
        } else if (ele === 2) {
            return <FontAwesomeIcon icon={faCoins} />
        } else if (ele === 3) {
            return <FontAwesomeIcon icon={faRecycle} />
        }
    };
    const apiDocsfunc = (ele) => {
        if (ele === 0) {
            return <FontAwesomeIcon icon={faInfo} />
        } else if (ele === 1) {
            return <FontAwesomeIcon icon={faBars} />
        } else if (ele === 2) {
            return <FontAwesomeIcon icon={faImage} />
        } else if (ele === 3) {
            return <FontAwesomeIcon icon={faClock} />
        }
    };

    const apiStartScroll = (ele) => {
        if (ele === 0) {
            return 'app-create'
        } else if (ele === 1) {
            return 'app-key'
        } else if (ele === 2) {
            return 'app-token'
        } else if (ele === 3) {
            return 'app-re-token'
        }
    };

    const apiDocsScroll = (ele) => {
        if (ele === 0) {
            return 'franchisee-search'
        } else if (ele === 1) {
            return 'menu-search'
        } else if (ele === 2) {
            return 'image-search'
        } else if (ele === 3) {
            return 'hours-search'
        }
    };

    const [showButton, setShowButton] = useState(false);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    useEffect(() => {
        const handleShowButton = () => {
            if (window.scrollY > 500) {
                setShowButton(true)
            } else {
                setShowButton(false)
            }
        }

        window.addEventListener("scroll", handleShowButton)
        return () => {
            window.removeEventListener("scroll", handleShowButton)
        }
    }, [])

    //대제목 소제목 리스트
    const [titleOpen, setTitleOpen] = React.useState(false);
    const [appOpen, setAppOpen] = React.useState(true);

    const titleClick = () => {
        setTitleOpen(true);
        setAppOpen(false);
        scrollToTop();
    };

    const appClick = () => {
        setAppOpen(true);
        setTitleOpen(false);
        scrollToTop();
    }

    return (
        <>
            <ScrollToTop />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <ApiHeader />
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />

                    <Box sx={{ overflow: 'hidden' }}>
                        <List>
                            <ListItemButton onClick={appClick}>
                                <ListItemText primary="앱" onClick={scrollToTop} />
                                {appOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                            </ListItemButton>
                            <Collapse in={appOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {['앱 만들기', '앱 키', '앱 토큰 발급', '앱 토큰 재발급'].map((text, index) => (
                                        <ListItem key={index} disablePadding>
                                            <Scroll.Link className="nav-sm" spy to={apiStartScroll(index)}>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        {apiDocsfunc(index)}
                                                    </ListItemIcon>
                                                    <ListItemText style={{ wordBreak: 'keep-all' }} primary={text} />
                                                </ListItemButton>
                                            </Scroll.Link>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </List>
                        <Divider />
                        <List>
                            <ListItemButton onClick={titleClick}>
                                <ListItemText primary="가맹점" onClick={scrollToTop} />
                                {titleOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                            </ListItemButton>
                            <Collapse in={titleOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {['가맹점 정보 검색', '가맹점 메뉴 검색', '가맹점 이미지 검색', '가맹점 영업시간 검색'].map((text, index) => (
                                        <ListItem key={index} disablePadding>
                                            <Scroll.Link className="nav-sm" spy to={apiDocsScroll(index)}>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        {apiDocsfunc(index)}
                                                    </ListItemIcon>
                                                    <ListItemText style={{ wordBreak: 'keep-all' }} primary={text} />
                                                </ListItemButton>
                                            </Scroll.Link>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </List>

                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container fluid style={{ marginTop: '12px' }}>
                        <Row>
                            <Col sm={8}>
                                {titleOpen ? (<>
                                    <div id="doc-title" className="group__subject">
                                        <div className="area__subject">
                                            <h2 className="tit_subject">{apiDocuments.mainTitle}</h2>
                                        </div>
                                    </div>
                                    {
                                        apiDocuments.contents.map((content, index) => {
                                            return (
                                                <div key={index} id={content.tagId} className="area__doc">
                                                    <div className="area__doc__header">
                                                        <h3 className="area__doc__subject">
                                                            {content.title}
                                                        </h3>
                                                        <div dangerouslySetInnerHTML={{ __html: content.intro }}></div>
                                                    </div>
                                                    <div className="area__doc__body">
                                                        <h4>
                                                            Request
                                                        </h4>
                                                        <h5>URL</h5>
                                                        <pre className="url__code">
                                                            <code style={{ color: 'white' }}>
                                                                <span className="http__method">{content.request.method}  </span>
                                                                <span className="http__path" dangerouslySetInnerHTML={{ __html: content.request.path }}></span><br />
                                                                <span className="key" >Host</span> : {content.request.host}<br />
                                                                <span className="key" >Authorization</span> : Bearer <span className="variable">{'${JWT}'}</span>
                                                            </code>
                                                        </pre>
                                                        <h5>Parameter</h5>
                                                        <Table className="container__table">
                                                            <thead>
                                                                <tr>
                                                                    {
                                                                        ['항목명', '타입', '항목설명', 'Required'].map((item, index) => {
                                                                            return (<th key={index} style={{ backgroundColor: '#e2e4ee' }}>{item}</th>);
                                                                        })
                                                                    }
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    content.request.parameter.map((param, index) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>{param.name}</td>
                                                                                <td><code>{param.type}</code></td>
                                                                                <td dangerouslySetInnerHTML={{ __html: param.description }}></td>
                                                                                <td>{param.required}</td>
                                                                            </tr>
                                                                        );
                                                                    })

                                                                }
                                                            </tbody>
                                                        </Table>

                                                        <h4>
                                                            Response
                                                        </h4>
                                                        {
                                                            content.response.map((res, index) => {
                                                                return (
                                                                    <div key={index}>
                                                                        {
                                                                            (() => {
                                                                                if (res.title === 'Address') {
                                                                                    return (
                                                                                        <>
                                                                                            <a className='title__address' style={{ position: "relative", top: "-79px" }}></a>
                                                                                            <h5>
                                                                                                {res.title}
                                                                                            </h5>
                                                                                        </>
                                                                                    )
                                                                                } else if (res.title === 'Image') {
                                                                                    return (
                                                                                        <>
                                                                                            <a className='title__image' style={{ position: "relative", top: "-79px" }}></a>
                                                                                            <h5>
                                                                                                {res.title}
                                                                                            </h5>
                                                                                        </>
                                                                                    )
                                                                                } else {
                                                                                    return (
                                                                                        <h5>
                                                                                            {res.title}
                                                                                        </h5>
                                                                                    )
                                                                                }
                                                                            })()

                                                                        }
                                                                        <Table className="container__table">
                                                                            <thead>
                                                                                <tr>
                                                                                    {
                                                                                        ['항목명', '타입', '항목설명'].map((item, index) => {
                                                                                            return (
                                                                                                <th key={index} style={{ backgroundColor: '#e2e4ee' }}>{item}</th>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {
                                                                                    res.items.map((item, index) => {
                                                                                        return (
                                                                                            <tr key={index}>
                                                                                                <td dangerouslySetInnerHTML={{ __html: item.name }}></td>
                                                                                                <td>

                                                                                                    {
                                                                                                        (() => {
                                                                                                            if (item.type === 'Address') {
                                                                                                                return (
                                                                                                                    <Scroll.Link className="nav-point" spy to={"title__address"}>
                                                                                                                        <code dangerouslySetInnerHTML={{ __html: item.type }}></code>
                                                                                                                    </Scroll.Link>
                                                                                                                )
                                                                                                            } else if (item.type === 'Image') {
                                                                                                                return (
                                                                                                                    <Scroll.Link className="nav-point" spy to={"title__image"}>
                                                                                                                        <code dangerouslySetInnerHTML={{ __html: item.type }}></code>
                                                                                                                    </Scroll.Link>
                                                                                                                )
                                                                                                            } else {
                                                                                                                return (
                                                                                                                    <code dangerouslySetInnerHTML={{ __html: item.type }}></code>
                                                                                                                )
                                                                                                            }
                                                                                                        })()

                                                                                                    }
                                                                                                </td>
                                                                                                <td dangerouslySetInnerHTML={{ __html: item.description }}></td>
                                                                                            </tr>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </tbody>
                                                                        </Table>
                                                                    </div>

                                                                );
                                                            })
                                                        }
                                                        <h5>
                                                            Error
                                                        </h5>
                                                        <Table className="container__table">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ backgroundColor: '#e2e4ee' }}>항목명</th>
                                                                    <th style={{ backgroundColor: '#e2e4ee' }}>타입</th>
                                                                    <th style={{ backgroundColor: '#e2e4ee' }}>항목설명</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>message</td>
                                                                    <td><code>String</code></td>
                                                                    <td>에러 메세지</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>status</td>
                                                                    <td><code>String</code></td>
                                                                    <td>Http Status Code</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>code</td>
                                                                    <td><code>String</code></td>
                                                                    <td>FM Service Error Code</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>detail</td>
                                                                    <td><code>String</code></td>
                                                                    <td>상세 메세지</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>

                                                        <h4>
                                                            Sample
                                                        </h4>
                                                        <h5>Request</h5>
                                                        <pre className="url__code">
                                                            <code style={{ color: 'white' }}>
                                                                curl -X
                                                                <span className="http__method">  GET  </span>
                                                                <span className="http__path" dangerouslySetInnerHTML={{ __html: content.sample.request.url }}></span> \<br />
                                                                -H
                                                                <span className="http__path">  &quot;Authorization: Bearer <span className="variable">{'${JWT}'}</span>&quot;</span>
                                                            </code>
                                                        </pre>
                                                        <h5>Response</h5>
                                                        <pre className="url__code">
                                                            <code style={{ color: 'white' }}>
                                                                Content-Type: application/json;charset=UTF-8
                                                                <JSONPretty data={content.sample.response.object}></JSONPretty>
                                                            </code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </>) : (<>
                                    <div id="doc-title" className="group__subject">
                                        <div className="area__subject">
                                            <h2 className="tit_subject">시작하기</h2>
                                        </div>
                                    </div>
                                    <div className="area__doc__header appDetail__header">
                                        <h3 className="area__doc__title ">
                                            애플리케이션 등록
                                        </h3>
                                        <p>이 문서는 애플리케이션(이하 앱) 등록에 대해 안내합니다.</p>
                                    </div>
                                    {/* id 값 수정을 통해서,  */}
                                    <div id='app-create' className="area__doc">
                                        <div className="area__doc__header">
                                            <h3 className="area__doc__subject">
                                                앱 만들기
                                            </h3>
                                            <p>FM API 사용을 위해 개발자 웹사이트에서 앱을 만들고, 해당 앱에 서비스 이름을 등록할 수 있습니다.
                                                <br />개발자 웹사이트에서 로그인한 후, [내 애플리케이션] - [애플리케이션 추가하기]를 눌러 앱을 생성할 수 있습니다.</p>
                                            <br />
                                            <Link className="normal outlink" to="/application">
                                                내 애플리케이션
                                            </Link>
                                            <span className="img_preveal"></span>
                                            <div>
                                                <img src={`${process.env.REACT_APP_SERVER_URL}/api/v1/file/fm_009feacf317c423db37e83fd25e77c0f.png`} alt="애플리케이션 추가 화면" className="img_thumb" width="768px" />
                                            </div>
                                            <div>
                                                <img src={`${process.env.REACT_APP_SERVER_URL}/api/v1/file/fm_01924dbb14104c66a3abdd7e41ecd945.png`} alt="애플리케이션 추가 화면" className="img_thumb" width="768px" />
                                            </div>
                                            <p>
                                                ⓐ 앱 이름: 서비스 이름<br />
                                                ⓑ 저장: 입력한 기본 정보로 앱 등록
                                            </p>
                                        </div>
                                    </div>
                                    <div id='app-key' className="area__doc">
                                        <div className="area__doc__header">
                                            <h3 className="area__doc__subject">
                                                앱 키
                                            </h3>
                                            <p>앱을 생성하면 앱 키(App Key)가 발급됩니다. 발급받은 앱 키는 [내 앱 관리] - [사용 앱] 에서 확인할 수 있습니다.
                                                <br />앱 키의 [복사] 버튼으로 값을 그대로 복사해 사용하면 편리합니다.</p>

                                            <span className="img_preveal"></span>
                                            <div>
                                                <img src={`${process.env.REACT_APP_SERVER_URL}/api/v1/file/fm_f90eec5395b24c84a3e41bc9fe2ed791.png`} alt="애플리케이션 추가 화면" className="img_thumb" width="768px" />
                                            </div>
                                            <p>
                                                ⓐ 앱 정보: 앱 상세정보 페이지로 이동<br />
                                            </p>
                                            <div>
                                                <img src={`${process.env.REACT_APP_SERVER_URL}/api/v1/file/fm_1313dd937cec4d028f1bf2815e6839e8.png`} alt="애플리케이션 추가 화면" className="img_thumb" width="768px" />
                                            </div>
                                            <p>
                                                ⓐ 앱 리스트: 앱 리스트로 페이지 이동<br />
                                                ⓑ 재발급: 앱 키 재발급<br />
                                                ⓒ 복사: 앱 키 복사<br />
                                                ⓓ 삭제: 앱 삭제<br />
                                                ⓔ 수정: 앱 이름 수정<br />
                                            </p>
                                            <div className="box_sign type_error">
                                                <span className=""></span>
                                                <strong>※ 주의: 앱 키 재발급</strong><br />
                                                <strong>한 번 키가 재발급되면 이전으로 되돌릴 수 없으니 주의합니다. </strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div id='app-token' className="area__doc">
                                        <div className="area__doc__header">
                                            <h3 className="area__doc__subject">
                                                앱 토큰 발급
                                            </h3>
                                            <p>FM API 사용을 위한 토큰을 발급받는 API 입니다.
                                                <br />토큰 유효시간은 1시간으로, 그 이후에는 토큰 재발급 API 를 사용해 토큰을 갱신해야 합니다.</p>
                                            <div className="area__doc__body">
                                                <h4>
                                                    Request
                                                </h4>
                                                <h5>URL</h5>
                                                <pre className="url__code">
                                                    <code style={{ color: 'white' }}>
                                                        <span className="http__method">POST  </span>
                                                        <span className="http__path">/api/v1/auth/publish</span><br />
                                                        <span className="http__method">HOST  </span>: fm.bizplay.shop <br />
                                                        {/* <span className="key" >Authorization</span> : Bearer <span className="variable">{'${JWT}'}</span> */}
                                                    </code>
                                                </pre>
                                                <h5>Publish Info</h5>
                                                <Table className="container__table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목명</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>타입</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목설명</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>Required</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>appKey</td>
                                                            <td><code>String</code></td>
                                                            <td>앱 키</td>
                                                            <td>O</td>
                                                        </tr>

                                                    </tbody>
                                                </Table>

                                                <h4>
                                                    Response
                                                </h4>
                                                <h5>
                                                    AppToken
                                                </h5>
                                                <Table className="container__table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목명</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>타입</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목설명</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>accessToken</td>
                                                            <td><code>String</code></td>
                                                            <td>API 사용을 위한 토큰</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <h5>
                                                    Error
                                                </h5>
                                                <Table className="container__table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목명</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>타입</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목설명</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>message</td>
                                                            <td><code>String</code></td>
                                                            <td>에러 메세지</td>
                                                        </tr>
                                                        <tr>
                                                            <td>status</td>
                                                            <td><code>String</code></td>
                                                            <td>Http Status Code</td>
                                                        </tr>
                                                        <tr>
                                                            <td>code</td>
                                                            <td><code>String</code></td>
                                                            <td>FM Service Error Code</td>
                                                        </tr>
                                                        <tr>
                                                            <td>detail</td>
                                                            <td><code>String</code></td>
                                                            <td>상세 메세지</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <h4>
                                                    Sample
                                                </h4>
                                                <h5>Request</h5>
                                                <pre className="url__code">
                                                    <code style={{ color: 'white' }}>
                                                        curl -X
                                                        <span className="http__method">  POST</span>
                                                        <span className="http__path">  &quot;https://fm.bizplay.shop/api/v1/auth/publish&quot;</span> \
                                                        <br />-H
                                                        <span className="http__path">  &quot;Authorization: Bearer <span className="variable">{'${JWT}'}</span>&quot;</span> \
                                                        <br />-H
                                                        <span className="http__path">  &quot;Content-Type: application/json&quot;</span> \
                                                        <br /><br />-d
                                                        <span>  &quot;{'{'}</span> \
                                                        <br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;
                                                        <span style={{ color: 'skyblue' }}>appKey</span>&quot; :
                                                        <span className="http__path">&quot;Tk3MEBuYXZlci5jb20ifQ.iHVHwjZ11&quot;</span> \
                                                        <br />
                                                        <span>&#9;&#9;&#9;&#9;&#9;&#9;{'}'}&quot;</span> \

                                                    </code>
                                                </pre>
                                                <h5>Response</h5>
                                                <pre className="url__code">
                                                    <code style={{ color: 'white' }}>
                                                        Content-Type: application/json;charset=UTF-8
                                                        <JSONPretty data={apiToken}></JSONPretty>
                                                    </code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                    <div id='app-re-token' className="area__doc">
                                        <div className="area__doc__header">
                                            <h3 className="area__doc__subject">
                                                앱 토큰 재발급
                                            </h3>
                                            <p>기존 토큰 만료 시, FM API 사용을 위한 토큰을 재발급받는 API 입니다.
                                                <br />기존 토큰이 만료되지 않았을 시, 해당 API에 접근한다면 잘못된 접근으로 인식하고 기존 토큰을 만료시킵니다. </p>

                                            <div className="area__doc__body">
                                                <h4>
                                                    Request
                                                </h4>
                                                <h5>URL</h5>
                                                <pre className="url__code">
                                                    <code style={{ color: 'white' }}>
                                                        <span className="http__method">POST  </span>
                                                        <span className="http__path">/api/v1/auth/republish</span><br />
                                                        <span className="http__method">HOST  </span>: fm.bizplay.shop <br />
                                                        {/* <span className="key" >Authorization</span> : Bearer <span className="variable">{'${JWT}'}</span> */}
                                                    </code>
                                                </pre>
                                                <h5>Republish Info</h5>
                                                <Table className="container__table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목명</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>타입</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목설명</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>Required</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>accessToken</td>
                                                            <td><code>String</code></td>
                                                            <td>기존에 사용중인 앱 토큰</td>
                                                            <td>O</td>
                                                        </tr>
                                                        <tr>
                                                            <td>appKey</td>
                                                            <td><code>String</code></td>
                                                            <td>앱 키</td>
                                                            <td>O</td>
                                                        </tr>

                                                    </tbody>
                                                </Table>

                                                <h4>
                                                    Response
                                                </h4>
                                                <h5>
                                                    AppToken
                                                </h5>
                                                <Table className="container__table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목명</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>타입</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목설명</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>accessToken</td>
                                                            <td><code>String</code></td>
                                                            <td>API 사용을 위한 토큰</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <h5>
                                                    Error
                                                </h5>
                                                <Table className="container__table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목명</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>타입</th>
                                                            <th style={{ backgroundColor: '#e2e4ee' }}>항목설명</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>message</td>
                                                            <td><code>String</code></td>
                                                            <td>에러 메세지</td>
                                                        </tr>
                                                        <tr>
                                                            <td>status</td>
                                                            <td><code>String</code></td>
                                                            <td>Http Status Code</td>
                                                        </tr>
                                                        <tr>
                                                            <td>code</td>
                                                            <td><code>String</code></td>
                                                            <td>FM Service Error Code</td>
                                                        </tr>
                                                        <tr>
                                                            <td>detail</td>
                                                            <td><code>String</code></td>
                                                            <td>상세 메세지</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <h4>
                                                    Sample
                                                </h4>
                                                <h5>Request</h5>
                                                <pre className="url__code">
                                                    <code style={{ color: 'white' }}>
                                                        curl -X
                                                        <span className="http__method">  POST</span>
                                                        <span className="http__path">  &quot;https://fm.bizplay.shop/api/v1/auth/publish&quot;</span> \
                                                        <br />-H
                                                        <span className="http__path">  &quot;Authorization: Bearer <span className="variable">{'${JWT}'}</span>&quot;</span> \
                                                        <br />-H
                                                        <span className="http__path">  &quot;Content-Type: application/json&quot;</span> \
                                                        <br /><br />-d
                                                        <span>  &quot;{'{'}</span> \
                                                        <br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;
                                                        <span style={{ color: 'skyblue' }}>accessToken</span>&quot; :
                                                        <span className="http__path">&quot;iLCJleHAiOjE2NTk0OTk3NDUsImVtYWlsIjoianNwOTk3MEBuYXZlci5jb20ifQ&quot;</span> \
                                                        <br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;
                                                        <span style={{ color: 'skyblue' }}>appKey</span>&quot; :
                                                        <span className="http__path">&quot;Tk3MEBuYXZlci5jb20ifQ.iHVHwjZ11&quot;</span> \
                                                        <br />
                                                        <span>&#9;&#9;&#9;&#9;&#9;&#9;{'}'}&quot;</span> \
                                                    </code>
                                                </pre>
                                                <h5>Response</h5>
                                                <pre className="url__code">
                                                    <code style={{ color: 'white' }}>
                                                        Content-Type: application/json;charset=UTF-8
                                                        <JSONPretty data={apiToken}></JSONPretty>
                                                    </code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                    <br /><br /><br /><br /><br />
                                </>)}
                            </Col>
                        </Row>
                        <div className="scroll__container">
                            <button id="top" onClick={scrollToTop} type="button"> <FontAwesomeIcon icon={faArrowUp} /></button>
                        </div>
                    </Container>
                </Box>
            </Box>
        </>

    )
}
function ApiDocument() {
    return (
        <>
            <MainHeader></MainHeader>
            <ApiDocumentForm></ApiDocumentForm>
            <Footer></Footer>
        </>
    )
}

export default ApiDocument;
