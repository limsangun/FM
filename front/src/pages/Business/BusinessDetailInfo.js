import React, { useState, useEffect, useContext } from 'react'
import "../../css/Business/BusinessDetailInfo.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { instance } from "../../template/AxiosConfig/AxiosInterceptor";
import { BusinessContext } from './BusinessDetail';

export const BusinessDetailInfo = ({ franBackImg, setFranBackImg }) => {
    const { businessDetailInfo, setBusinessDetailInfo } = useContext(BusinessContext);

    let [changeInput, setChangeInput] = useState({
        tel: '',
        intro: ''
    });
    useEffect(() => {
        setChangeInput({
            tel: businessDetailInfo.tel,
            intro: businessDetailInfo.intro
        })
        setFirstImgsrc(businessDetailInfo.firstImg)
    }, [businessDetailInfo])

    //토스트 디폴트 옵션

    //외관 이미지 10개추가
    const [detailBackImg, setDetailBackImg] = useState([]);
    const onLoadBackImg = (e) => {
        var frm = new FormData();
        frm.append("files", e.target.files[0]);
        if (e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== "image/gif" && e.target.files[0].type !== "image/jpg") {
            toast.error('이미지 형식의 파일을 올려주세요.', toast.toastdefaultOption);
            return;
        }

        instance({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "post",
            url: `/file`,
            data: frm,
        }).then(function (res) {
            if (franBackImg.length + detailBackImg.length < 10) {
                setDetailBackImg([...detailBackImg, res.data]);
            } else {
                toast.error("외관사진은 최대10개까지만 등록가능합니다.", toast.toastdefaultOption);
            }
        });
    };

    //대표 이미지 1개
    const [firstImgsrc, setFirstImgsrc] = useState('');
    const onLoadprofile = (e) => {
        var frm = new FormData();
        frm.append("files", e.target.files[0]);
        if (e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== "image/gif" && e.target.files[0].type !== "image/jpg") {
            toast.error('이미지 형식의 파일을 올려주세요.', toast.toastdefaultOption);
            return;
        }

        instance({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "post",
            url: `/file`,
            data: frm,
        }).then(function (res) {
            //가맹점 대표이미지 src 설정
            setFirstImgsrc(res.data[0].path);
        });
    };

    //가맹점리스트 정보 수정 함수
    function FranUpdate() {
        // 수정 통신
        const editAxios = (dataset) => {
            instance({
                method: "put",
                url: `/franchisee/` + businessDetailInfo.businessNumber,
                data: dataset,
            }).then(function (res) {
                setChangeInput({
                    tel: res.data.tel,
                    intro: res.data.intro
                })
                setBusinessDetailInfo(res.data);
                if (detailBackImg && franBackImg.length + detailBackImg.length < 11) {
                    instance({
                        method: "post",
                        url: `/franchisee/` + businessDetailInfo.businessNumber + '/images',
                        // data: backImgsrc,
                        data: detailBackImg.map((ele) => {
                            return ele[0].id
                        })
                    }).then(function (res) {
                        detailBackImg.map((ele) => {
                            franBackImg.push(ele[0]);
                        });
                        setDetailBackImg([]);
                        // setFranBackImg({ ...franBackImg, detailBackImg })
                    }).catch(function (err) {
                    });
                }
            }).catch(function (error) {
            });
        }
        if (document.getElementById('tel').value.length === 0) {
            toast.error('전화 번호를 다시 확인하고 입력하여 주십시오 ', toast.toastdefaultOption);
        }
        else if (businessDetailInfo.firstImg === firstImgsrc && businessDetailInfo.tel === changeInput.tel && businessDetailInfo.intro === changeInput.intro && detailBackImg.length === 0) {
            toast.error('변경된 값이 없습니다', toast.toastdefaultOption);
        } else {
            if (document.getElementById('tel').value.length > 11) {
                const dataset = {
                    firstImg: firstImgsrc,
                    tel: changeInput.tel,
                    intro: changeInput.intro
                }
                editAxios(dataset);
                toast.success('가맹점 정보가 수정되었습니다.', toast.toastdefaultOption);
            } else {
                toast.error('전화 번호를 다시 확인하고 입력하여 주십시오', toast.toastdefaultOption);
            }
        }
    }

    function backImgDel(imageId) {
        instance({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "delete",
            url: `/franchisee/` + businessDetailInfo.businessNumber + "/image/" + imageId,
        }).then(function (res) {
            setFranBackImg((franBackImg).filter((ele) => ele.id !== imageId));
            toast.success('가맹점 이미지가 삭제되었습니다.', toast.toastdefaultOption);
        });
    }

    function detailBackImgDel(imageId) {
        setDetailBackImg((detailBackImg).filter((ele) => ele[0].id !== imageId[0].id));
    }

    const BusinessTelChange = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-");
        if (changeInput.tel.length === 8) {
            setChangeInput({ ...changeInput, [e.target.name]: e.target.value.split("-")[0] + e.target.value.split("-")[1] });
        } else {
            setChangeInput({ ...changeInput, [e.target.name]: e.target.value.split("-")[0] + e.target.value.split("-")[1] + e.target.value.split("-")[2] });
        }
    }

    return (
        <>
            <div className='businessDetailInfo'>
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <span className='businessDetailInfo--InfoInput-text'>가맹점 대표이미지를 설정해주세요.</span><span className='businessDetailInfo--essential'>*필수</span>
                    </div>
                    <div className='businessDetailInfo--InfoInputImg' onChange={onLoadprofile}>
                        <span className="businessDetailInfo--InfoInput-filebox">
                            <label id="businessDetailInfo--InfoInput-label" htmlFor="file-input" style={{ backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}${firstImgsrc})` }}>
                                <div className='businessDetailInfo--InfoInput-label-text' id="fileCircle">+</div>
                                <div className='businessDetailInfo--InfoInput-label-text'>사진 업로드</div>
                            </label>
                            <input accept=".gif, .jpg, .png" id="file-input" type="file" />
                        </span>
                    </div>
                </div>
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <span className='businessDetailInfo--InfoInput-text'>가맹점 명</span>
                    </div>
                    <div>
                        <input className='businessDetailInfo--InfoInput-input unablezone' readOnly defaultValue={businessDetailInfo.name} />
                    </div>
                </div>
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <span className='businessDetailInfo--InfoInput-text'>사업자등록번호</span>
                    </div>
                    <div>
                        <input className='businessDetailInfo--InfoInput-input unablezone' readOnly defaultValue={businessDetailInfo.businessNumber} />
                    </div>
                    <div className='businessDetailInfo--InfoInput-explan'>
                        (등록하신 사업자등록정보를 통해 확인한 사업자등록번호입니다.)
                    </div>
                </div>
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <span className='businessDetailInfo--InfoInput-text'>주소</span>
                    </div>
                    <div>
                        <input className='businessDetailInfo--InfoInput-input unablezone' type='text' id='postcode--Address' readOnly value={businessDetailInfo.address.road + businessDetailInfo.address.detail} placeholder='주소' />
                    </div>
                </div>
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <span className='businessDetailInfo--InfoInput-text'>전화번호를 입력해주세요.</span>
                    </div>
                    <div>
                        <input name='tel' className='businessDetailInfo--InfoInput-input' id='tel' maxLength={13}
                            defaultValue={changeInput.tel.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-")}
                            onChange={(e) => { BusinessTelChange(e) }}
                        />

                    </div>
                </div>
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <span className='businessDetailInfo--InfoInput-text'>가게 사진을 추가해주세요.</span>
                        <span className='businessDetailInfo--InfoInput-text' id="businessDetailInfo--InfoInput-plusCount" style={franBackImg.length + detailBackImg.length === 10 ? { color: 'red' } : null}>({franBackImg.length + detailBackImg.length}/10)</span>
                    </div >
                    <div className='businessDetailInfo--InfoInputImg' >
                        <span className="businessDetailInfo--InfoInput-filebox" onChange={onLoadBackImg}>
                            <label id="businessDetailInfo--InfoInput-label" htmlFor="ex_filename">
                                <div className='businessDetailInfo--InfoInput-label-text' id="fileCircle">+</div>
                                <div className='businessDetailInfo--InfoInput-label-text'>사진 추가</div>
                            </label>
                            <input accept=".gif, .jpg, .png" type="file" id="ex_filename" className="upload-hidden" />
                        </span>
                        {franBackImg ? (franBackImg.map((ele, idx) => {
                            return (
                                <span key={idx}><button className='businessDetailInfo-DelBtn' onClick={() => backImgDel(ele.id)}>x</button><img className='businessDetailInfo--InfoInput-businessImg' alt="가게이미지" src={`${process.env.REACT_APP_SERVER_URL}${ele.path}`} /></span>
                            )
                        })) : null}
                        {detailBackImg ? (detailBackImg.map((ele, idx) => {
                            return (
                                <span key={idx}>
                                    <button className='businessDetailInfo-DelBtn' onClick={() => { detailBackImgDel(ele) }}>x</button>
                                    <img className='businessDetailInfo--InfoInput-businessImg' alt="가게이미지" src={`${process.env.REACT_APP_SERVER_URL}${ele[0].path}`} />
                                </span>
                            )
                        })) : null}
                    </div>
                    <div className='businessDetailInfo--InfoInput-explan' id="businessDetailInfo--InfoInput-explan-text">
                        (최대 10개까지)
                    </div>
                </div >
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <span className='businessDetailInfo--InfoInput-text'>가게소개글</span>
                    </div>
                    <div>
                        {/* <input name='intro' className='businessDetailInfo--InfoInput-input' id='intro' value={changeInput.intro} onChange={(e) => { setChangeInput({ ...changeInput, [e.target.name]: e.target.value }) }} /> */}
                        <textarea name='intro' className='businessDetailInfo--InfoInput-input' id='intro' value={changeInput.intro} style={{ height: '200px' }} onChange={(e) => { setChangeInput({ ...changeInput, [e.target.name]: e.target.value }) }} />
                    </div>
                </div>
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <button className='businessDetailInfo--InfoInput-SaveBtn' onClick={() => { FranUpdate(); }}>저장하기</button>
                    </div>
                </div>
            </div >
        </>
    )
}

