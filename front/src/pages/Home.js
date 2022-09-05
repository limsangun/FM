import IntroMenu from "../template/IntroMenu";
import IntroMyFranchisee from "../template/IntroMyFranchisee";
import IntroSection from "../template/IntroSection";
import { Container } from "react-bootstrap";
import MainHeader from "../template/MainHeader";
import Footer from "../template/Footer";
import IntroBackground from '../template/IntroBackground';
import '../css/Home.css';
import ScrollToTop from '../template/ScrollToTop';
import { createContext, useEffect, useState } from "react";
import { instance } from "../template/AxiosConfig/AxiosInterceptor";

export const BusinessContext = createContext();

function Home() {
    const menus = [
        {
            to: "/mypage",
            width: "47px",
            height: "70px",
            backgruodPosion: "-845px -526px",
            marginBottom: "13px",
            text: "업체 신규 등록"
        },
    ];


    const sections = [
        {
            title: `위치 기반 서비스로 <br/>
            가맹점을 관리하세요!`,
            description: `보유하고 계신 가맹점들을 위치 기반으로 관리하세요.<br/>
            또한 다른 가맹점 정보를 볼 수 있어요.`,
            to: "/map",
            imgPath: "/img/intro-section.png"
        },
        {
            title: `제공되는 API를 사용하여 <br/>
            새로운 세상을 열어보세요!`,
            description: `저희 서비스에 등록된 가맹점 정보를 <br/>
            조회 할 수 있는 API를 제공해드립니다.`,
            to: "/docs",
            imgPath: "/img/intro-section-2.png"
        }
    ];

    const [userData, setUserData] = useState({});
    const [franchiseeList, setFranchiseeList] = useState({});
    const [franPage, setFranPage] = useState(1);

    //신규업체등록 모달
    const [addFranModal, setAddFranModal] = useState(false);

    // //유저 정보 받아오는 통신
    useEffect(() => {
        instance({
            method: "get",
            url: `/member/` + localStorage.getItem("userId") + `/franchisee`,
            params: { page: franPage },
        })
            .then(function (res) {
                setFranchiseeList(res.data.franchisees);
            })
            .catch((err) => {
            });
    }, []);


    return (
        <>
            <ScrollToTop />
            <BusinessContext.Provider value={{ userData, setUserData, franchiseeList, setFranchiseeList }}>
                <MainHeader />
                <IntroBackground></IntroBackground>
                <Container fluid="lg" className='home_margin'>
                    <IntroMenu menus={menus} addFranModal={addFranModal} setAddFranModal={setAddFranModal} />
                    <IntroMyFranchisee></IntroMyFranchisee>
                    <IntroSection sections={sections}></IntroSection>
                </Container>
                <Footer />
            </BusinessContext.Provider>
        </>
    );
}

export default Home;