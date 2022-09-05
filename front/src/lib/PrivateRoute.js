import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ component: Component }) {
    return localStorage.getItem('accessToken') ?
        (Component) : (<Navigate to="/" {...alert('로그인 후 이용가능 합니다.')} />);
}

export default PrivateRoute;
