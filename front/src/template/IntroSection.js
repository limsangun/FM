import { Link } from 'react-router-dom';
import '../css/IntroSection.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong } from "@fortawesome/free-solid-svg-icons";

function IntroSection({sections}){
    
    const moveToPage = (e) => {
        window.location.href = e
    };
    return (
        <>
            
            {
            sections.map((section, idx) => {
                return(
                    <div key={section.title} className="section">
                        <div className='section__inner'>
                        {(() => {
                            if(idx % 2 === 0) return(
                                <>
                                    <div className="section__text__franchiess section__1">
                                        <h3 className="section__text__title" dangerouslySetInnerHTML={{__html : section.title}}>
                                        </h3>
                                        <div>
                                            <p className='section__text__description' dangerouslySetInnerHTML={{__html : section.description}}>
                                            </p>
                                        </div>
                                        
                                        <div className="section__text__button">
                                            <Link className='introBackground__link' to={'/map'}>
                                                <p className='introBackground__font'>자세히 보기 <FontAwesomeIcon icon={faRightLong}/></p>
                                            </Link>
                                        </div>
                                    </div>
                                    <img className="section_image section__image_franchiess" src={section.imgPath} alt=""/>
                                    
                                </>
                            )
                            else return(
                                <>
                                    <div className='section__api section__2'>
                                        <img className="section_image section__image_api" src={section.imgPath} alt=""/>
                                        <div className="section__text__api">
                                            <h3 className="section__text__title" dangerouslySetInnerHTML={{__html : section.title}}>
                                            </h3>
                                            <div>
                                                <p className='section__text__description' dangerouslySetInnerHTML={{__html : section.description}}>
                                                </p>
                                            </div>
                                            <div className="section__text__button">
                                                <Link className='introBackground__link' to={'/docs'}>
                                                    <p className='introBackground__font'>자세히 보기 <FontAwesomeIcon icon={faRightLong}/></p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                        </div>
                    </div>
                );
            })
            }
        </>
    );
}

export default IntroSection;