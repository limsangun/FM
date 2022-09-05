import { Link } from 'react-router-dom';
import '../css/IntroNotice.css';

function IntroNotice ({notices}){
    return (
        <div className="main__area">
            <div className="main__header">
                <span className="main__title">공지사항</span>
                <Link to='#' className="main__link">더보기</Link>
            </div>
            <div className="notice__content">
                <ul className='notice__list'>
                {
                    notices.map(notice => {
                        return(
                            <li>
                                <Link className='notice__link' to={notice.to}>
                                    <i className='notice__icon'></i>
                                    <span className='notice__title'>{notice.title}</span>
                                    <span className='notice__date'>{notice.date}</span>
                                </Link>
                            </li>
                        );
                    })
                }
                </ul>
            </div>
        </div>
    );
}

export default IntroNotice;