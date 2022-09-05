import { Dropdown, Row } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import '../../css/Business/BusinessDetailRunTime.css';
import { instance } from '../../template/AxiosConfig/AxiosInterceptor';
import { ToastContainer, toast } from 'react-toastify';
import { MenuItem, Select } from '@mui/material';
import { sizeHeight } from '@mui/system';
import $ from 'jquery';

function BusinessDetailRunTime({ businessNumber, businessDetailInfo, setBusinessDetailInfo }) {

    //영업 시간 통신
    const [runningTime, setRunningTime] = useState([{}]);

    useEffect(() => {
        instance({
            method: "get",
            url: `/franchisee/` + businessNumber + `/schedule`,
        }).then(function (res) {
            setRunningTime([
                {
                    id: 0,
                    name: "월",
                    time: res.data.monday,
                    fromHour: res.data.monday === "휴무" ? "00" : res.data.monday.split("~")[0].split(":")[0],
                    fromMinute: res.data.monday === "휴무" ? "00" : res.data.monday.split("~")[0].split(":")[1],
                    toHour: res.data.monday === "휴무" ? "00" : res.data.monday.split("~")[1].split(":")[0],
                    toMinute: res.data.monday === "휴무" ? "00" : res.data.monday.split("~")[1].split(":")[1],
                    dayOff: res.data.monday === "휴무" ? true : false,
                },

                {
                    id: 1,
                    name: "화",
                    time: res.data.tuesday,
                    fromHour: res.data.tuesday === "휴무" ? "00" : res.data.tuesday.split("~")[0].split(":")[0],
                    fromMinute: res.data.tuesday === "휴무" ? "00" : res.data.tuesday.split("~")[0].split(":")[1],
                    toHour: res.data.tuesday === "휴무" ? "00" : res.data.tuesday.split("~")[1].split(":")[0],
                    toMinute: res.data.tuesday === "휴무" ? "00" : res.data.tuesday.split("~")[1].split(":")[1],
                    dayOff: res.data.tuesday === "휴무" ? true : false,
                },
                {
                    id: 2,
                    name: "수",
                    time: res.data.wednesday,
                    fromHour: res.data.wednesday === "휴무" ? "00" : res.data.wednesday.split("~")[0].split(":")[0],
                    fromMinute: res.data.wednesday === "휴무" ? "00" : res.data.wednesday.split("~")[0].split(":")[1],
                    toHour: res.data.wednesday === "휴무" ? "00" : res.data.wednesday.split("~")[1].split(":")[0],
                    toMinute: res.data.wednesday === "휴무" ? "00" : res.data.wednesday.split("~")[1].split(":")[1],
                    dayOff: res.data.wednesday === "휴무" ? true : false,
                },
                {
                    id: 3,
                    name: "목",
                    time: res.data.thursday,
                    fromHour: res.data.thursday === "휴무" ? "00" : res.data.thursday.split("~")[0].split(":")[0],
                    fromMinute: res.data.thursday === "휴무" ? "00" : res.data.thursday.split("~")[0].split(":")[1],
                    toHour: res.data.thursday === "휴무" ? "00" : res.data.thursday.split("~")[1].split(":")[0],
                    toMinute: res.data.thursday === "휴무" ? "00" : res.data.thursday.split("~")[1].split(":")[1],
                    dayOff: res.data.thursday === "휴무" ? true : false,
                },
                {
                    id: 4,
                    name: "금",
                    time: res.data.friday,
                    fromHour: res.data.friday === "휴무" ? "00" : res.data.friday.split("~")[0].split(":")[0],
                    fromMinute: res.data.friday === "휴무" ? "00" : res.data.friday.split("~")[0].split(":")[1],
                    toHour: res.data.friday === "휴무" ? "00" : res.data.friday.split("~")[1].split(":")[0],
                    toMinute: res.data.friday === "휴무" ? "00" : res.data.friday.split("~")[1].split(":")[1],
                    dayOff: res.data.friday === "휴무" ? true : false,
                },
                {
                    id: 5,
                    name: "토",
                    time: res.data.saturday,
                    fromHour: res.data.saturday === "휴무" ? "00" : res.data.saturday.split("~")[0].split(":")[0],
                    fromMinute: res.data.saturday === "휴무" ? "00" : res.data.saturday.split("~")[0].split(":")[1],
                    toHour: res.data.saturday === "휴무" ? "00" : res.data.saturday.split("~")[1].split(":")[0],
                    toMinute: res.data.saturday === "휴무" ? "00" : res.data.saturday.split("~")[1].split(":")[1],
                    dayOff: res.data.saturday === "휴무" ? true : false,
                },
                {
                    id: 6,
                    name: "일",
                    time: res.data.sunday,
                    fromHour: res.data.sunday === "휴무" ? "00" : res.data.sunday.split("~")[0].split(":")[0],
                    fromMinute: res.data.sunday === "휴무" ? "00" : res.data.sunday.split("~")[0].split(":")[1],
                    toHour: res.data.sunday === "휴무" ? "00" : res.data.sunday.split("~")[1].split(":")[0],
                    toMinute: res.data.sunday === "휴무" ? "00" : res.data.sunday.split("~")[1].split(":")[1],
                    dayOff: res.data.sunday === "휴무" ? true : false,
                },
            ]);
        });
    }, []);

    // 가맹점 등록
    const addFranchiseeFunction = () => {
        let time = {
            monday: runningTime[0].dayOff === false ? runningTime[0].fromHour + ":" + runningTime[0].fromMinute + "~" + runningTime[0].toHour + ":" + runningTime[0].toMinute : "휴무",
            tuesday: runningTime[1].dayOff === false ? runningTime[1].fromHour + ":" + runningTime[1].fromMinute + "~" + runningTime[1].toHour + ":" + runningTime[1].toMinute : "휴무",
            wednesday: runningTime[2].dayOff === false ? runningTime[2].fromHour + ":" + runningTime[2].fromMinute + "~" + runningTime[2].toHour + ":" + runningTime[2].toMinute : "휴무",
            thursday: runningTime[3].dayOff === false ? runningTime[3].fromHour + ":" + runningTime[3].fromMinute + "~" + runningTime[3].toHour + ":" + runningTime[3].toMinute : "휴무",
            friday: runningTime[4].dayOff === false ? runningTime[4].fromHour + ":" + runningTime[4].fromMinute + "~" + runningTime[4].toHour + ":" + runningTime[4].toMinute : "휴무",
            saturday: runningTime[5].dayOff === false ? runningTime[5].fromHour + ":" + runningTime[5].fromMinute + "~" + runningTime[5].toHour + ":" + runningTime[5].toMinute : "휴무",
            sunday: runningTime[6].dayOff === false ? runningTime[6].fromHour + ":" + runningTime[6].fromMinute + "~" + runningTime[6].toHour + ":" + runningTime[6].toMinute : "휴무",
        };

        instance({
            method: "put",
            url: `/franchisee/` + businessNumber,
            data: {
                firstImg: businessDetailInfo.firstImgsrc,
                hours: time,
                intro: businessDetailInfo.intro,
                tel: businessDetailInfo.tel,
            },
        }).then(function (res) {
            toast.success("영업시간이 수정되었습니다.", toast.toastdefaultOption);
            setBusinessDetailInfo(res.data);
        });
    };

    //영업 시간 (시)
    const hours = [];
    for (let i = 0; i < 24; i++) {
        if (i < 10) hours.push("0" + i);
        else hours.push(i.toString());
    }

    //영업 시간 (분)
    const minute = ["00", "10", "20", "30", "40", "50"];

    //영업시간 변경
    const setTimeChange = (e, id) => {
        setRunningTime(runningTime.map((time) => time.id === id ? { ...time, [e.target.name]: e.target.value } : time));
    };

    //영업시간 휴무
    const onToggle = (id) => {
        setRunningTime(runningTime.map((time) => time.id === id ? { ...time, dayOff: !time.dayOff } : time));
    };

    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <>
            <div className='BusinessDetailRunTime'>
                <div className='BusinessDetailRunTime-timezone'>
                    <Row className='BusinessDetailRunTime-timezone__title'>
                        영업 시간을 알려주세요.
                    </Row>
                    <Row>
                        <>
                            {runningTime.map((ele, idx) => {
                                return (
                                    <div className="BusinessDetailRunTime-daycasezone" key={idx}>
                                        <div className='BusinessDetailRunTime-textzone'>
                                            <span>
                                                {ele.name}요일
                                            </span>
                                        </div>
                                        <div className='BusinessDetailRunTime-timezone--runningTime'>
                                            <select
                                                className="BusinessDetailRunTime-timezone__select"
                                                disabled={ele.dayOff}
                                                name="fromHour"
                                                value={ele.fromHour || ''}
                                                onChange={(e) => { setTimeChange(e, idx); }}
                                            >
                                                {hours.map((ele, idx) => {
                                                    return (
                                                        <option className="runningTime--Hours" key={idx}>
                                                            {ele}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <span>:</span>
                                            <select
                                                className="BusinessDetailRunTime-timezone__select"
                                                value={ele.fromMinute || ''}
                                                name="fromMinute"
                                                disabled={ele.dayOff}
                                                onChange={(e) => { setTimeChange(e, idx); }}
                                            >
                                                {minute.map((ele, idx) => {
                                                    return (
                                                        <option className="runningTime--Minute" key={idx}>
                                                            {ele}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <span className="runningTime--middle">
                                                ~
                                            </span>
                                            <select
                                                className="BusinessDetailRunTime-timezone__select"
                                                value={ele.toHour || ''}
                                                name="toHour"
                                                disabled={ele.dayOff}
                                                onChange={(e) => { setTimeChange(e, idx); }}
                                            >
                                                {hours.map((ele, idx) => {
                                                    return (
                                                        <option className="runningTime--Hours" key={idx}>
                                                            {ele}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <span>:</span>
                                            <select
                                                className="BusinessDetailRunTime-timezone__select"
                                                value={ele.toMinute || ''}
                                                name="toMinute"
                                                disabled={ele.dayOff}
                                                onChange={(e) => { setTimeChange(e, idx); }}
                                            >
                                                {minute.map((ele, idx) => {
                                                    return (
                                                        <option className="runningTime--Minute" key={idx}>
                                                            {ele}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <input
                                                className="runningTime--dayOff"
                                                type="checkbox"
                                                // value="휴무"
                                                checked={ele.dayOff || ""}
                                                id={`${ele.id}`}
                                                onChange={() => { onToggle(idx); }}
                                            />
                                            <label htmlFor={`${ele.id}`}>
                                                &nbsp;&nbsp;휴무
                                            </label>

                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    </Row>
                </div>
                <div className='businessDetailInfo--InfoInput'>
                    <div>
                        <button className='businessDetailInfo--InfoInput-SaveBtn' onClick={addFranchiseeFunction}>저장하기</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default BusinessDetailRunTime;