import Carousel from 'react-bootstrap/Carousel';
import '../css/IntroBackground.css';
import styled from "styled-components";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDisplay, faListCheck, faRightLong } from "@fortawesome/free-solid-svg-icons";

function IntroBackground() {
    const Icon = styled.i`
        width: ${(props) => props.width || "47px"};
        height: ${(props) => props.height || "70px"};
        background-position: ${(props) => props.backgruodPosion || "-845px -526px"};
        margin-bottom: ${(props) => props.marginBottom || "20px;"};

        overflow: hidden;
        display: inline-block;
        color: transparent;
        white-space: nowrap;
        vertical-align: top;
        background-image: url(/img/icons.png);
        background-size: 1788px 1080px;
    `;

    const moveToMap = () => {
        window.location.href = 'http://localhost:3000/map'
    }
    const moveToApi = () => {
        window.location.href = 'http://localhost:3000/docs'
    }

    return (
        <>
            <Carousel indicators={true}>
                <Carousel.Item >
                    <div className='introBackground__my__background'>
                        <div className='introBackground__deco__background'>
                            <Icon
                                width={'880px'}
                                height={'370px'}
                                backgruodPosion={'-200px -80px'}
                                marginBottom={'20px'}
                            />
                        </div>
                        <div className='introBackground__my__image'>
                            <Icon

                                width={'280px'}
                                height={'370px'}
                                backgruodPosion={'-380px -390px'}
                                marginBottom={'20px'}
                            />
                        </div>
                        <div className='introBackground__font__box'>
                            <h5 className='introBackground__h5'><FontAwesomeIcon icon={faListCheck} /> 가맹 관리</h5>
                            <h3 className='introBackground__h3'>복잡한 가맹점 정보는 그만!
                                <br />지도를 통한 간편한 가맹정보 조회 서비스</h3>
                            <div className="introBackground__button" >
                                <Link className='introBackground__link' to={'/map'}>
                                    <p className='introBackground__font'>자세히 보기 <FontAwesomeIcon icon={faRightLong} /></p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item >
                    <div className='introBackground__api__background'>
                        <div className='introBackground__deco__background'>
                            <Icon
                                width={'880px'}
                                height={'370px'}
                                backgruodPosion={'-200px -80px'}
                                marginBottom={'20px'}
                            />
                        </div>
                        <div className='introBackground__api__image'>
                            <Icon
                                width={'340px'}
                                height={'280px'}
                                backgruodPosion={'-1450px -660px'}
                                marginBottom={'20px'}
                            />
                        </div>
                        <div className='introBackground__font__box'>
                            <h5 className='introBackground__h5'><FontAwesomeIcon icon={faDisplay} /> API 서비스</h5>
                            <h3 className='introBackground__h3'>간편한 API 사용!
                                <br />가맹점 정보를 조회할 수 있는 API</h3>
                            <div className="introBackground__button" >
                                <Link className='introBackground__link' to={'/docs'}>
                                    <p className='introBackground__font'>자세히 보기 <FontAwesomeIcon icon={faRightLong} /></p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>
        </>
    );
}

export default IntroBackground;
