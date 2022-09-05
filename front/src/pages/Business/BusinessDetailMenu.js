import React, { useEffect, useState } from 'react'
import "../../css/Business/BusinessDetailMenu.css"
import { TbBoxOff } from "react-icons/tb";
import { instance } from '../../template/AxiosConfig/AxiosInterceptor';
import { AddMenuModal } from '../MenuModal';
import { DelMenuModals } from '../DelMenuModals';

export const BusinessDetailMenu = (businessNumber) => {
    //메뉴 추가 모달 띄우기
    const [menuModalshow, setMenuModalshow] = useState(false);
    //메뉴 삭제 모달 띄우기
    const [menuDelModalshow, setMenuDelModalShow] = useState(false);
    //각각의 메뉴 데이터
    const [oneMenu, setOneMenu] = useState();

    //가맹점 메뉴 조회
    const [menuList, setMenuList] = useState([
        {
            image: {
                path: '',
            },
        },
    ]);
    useEffect(() => {
        instance({
            method: "get",
            url: `/franchisee/` + businessNumber.businessNumber + `/menus`,
        })
            .then(function (res) {
                setMenuList(res.data);
                // menuList.map((ele,idx)=>{
                //     setMenuList({...menuList, })
                // })
                // setOneMenu({ ...oneMenu, price: (oneMenu.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') })
            })
            .catch(function (err) {
                if (err.response.status === 404) {
                    // 메뉴가 없을 때
                }
                setMenuList([]);
            });
    }, []);

    return (
        <div className='businessDetailMenu'>
            <div className='businessDetailMenu--MenuInput'>
                <div>
                    <span className='businessDetailInfo--InfoInput-text'>메뉴를 추가해주세요.</span><span className='businessDetailInfo--essential'>*필수</span>
                </div >
            </div >
            <div>
                <button className="businessDetailMenu--MenuAddBtn" onClick={() => { setMenuModalshow(true); }}>
                    + 메뉴 추가
                </button>
            </div>
            {menuList.length > 0 ? (menuList[0].price !== undefined ?

                <>{menuList.map((ele, idx) => {
                    return (
                        <div className='businessDetailMenu--MenuZone' key={idx}>
                            <div className='businessDetailMenu--MenuImgZone' >
                                <img className='businessDetailMenu--MenuImgZone-MenuImg' alt={menuList[idx].image.path} src={`${process.env.REACT_APP_SERVER_URL}${menuList[idx].image.path}`} />
                                <div className="businessDetailMenu--MenuZone-name ">
                                    <span>{menuList[idx].name}</span>
                                </div>
                                <span style={{ float: 'right' }} className="businessDetailMenu--MenuImgZone-useBtn">
                                    <span role="button" className="EventText" onClick={() => { setMenuModalshow(true); setOneMenu(ele); }}>수정</span>
                                    <span id="menulistBtn--middle">ㅣ</span>
                                    <span role="button" className="EventText" onClick={() => { setMenuDelModalShow(true); setOneMenu(ele); }}>삭제</span>
                                </span>
                                <div className="businessDetailMenu--MenuZone-price">
                                    {`${menuList[idx].price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                </div>
                                <div className="businessDetailMenu--MenuZone-description">
                                    {menuList[idx].description}
                                </div>
                            </div>
                        </div >
                    );
                })}</> : null) : (<><div className="businessDetailMenu--defaultMenuZone">
                    <h1>
                        <TbBoxOff style={{ color: "#4187f5", }} />
                    </h1>
                    <div>
                        <p>가맹점에 등록된 메뉴가 없습니다</p>
                        <p>우측 상단의 메뉴추가 버튼을 통해 메뉴를 추가해주세요</p>
                    </div>
                </div></>)}
            {menuModalshow ? <AddMenuModal menuModalshow={menuModalshow} setMenuModalshow={setMenuModalshow} businessNumber={businessNumber} setMenuList={setMenuList} menuList={menuList} oneMenu={oneMenu} setOneMenu={setOneMenu} /> : null}
            {menuDelModalshow ? <DelMenuModals menuDelModalshow={menuDelModalshow} setMenuDelModalShow={setMenuDelModalShow} oneMenu={oneMenu} setOneMenu={setOneMenu} menuList={menuList} setMenuList={setMenuList} /> : null}
        </div >
    )
}