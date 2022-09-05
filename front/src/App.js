
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Map from "./pages/Map";
import Mypage from "./pages/Mypage";
import BusinessList from "./pages/BusinessList";
import PrivateRoute from "./lib/PrivateRoute";
import Home from "./pages/Home";
import Application from "./pages/Application";
import AppDetail from "./pages/AppDetail";
import FindPassword from "./pages/FindPassword";
import ApiGettingStarted from "./pages/ApiGettingStarted";
import { BusinessDetail } from "./pages/Business/BusinessDetail";
import FranchiseeFind from "./pages/FranchiseeFind";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
      <Routes>
        {/* index 페이지 */}
        <Route path="/" element={<Home />} />
        {/* 지도 페이지 */}
        <Route path="/map" element={<Map />} />
        {/* Api 시작 페이지 */}
        <Route path="/docs" element={<ApiGettingStarted />} />
        {/* 가맹점 검색 페이지 */}
        <Route path="/franchiseeFind" element={<FranchiseeFind />} />

        <Route // 마이페이지
          path="/mypage"
          element={<PrivateRoute component={<Mypage />} />}
        />
        <Route // 가맹점 디테일 페이지
          path="/businessDetail"
          element={<PrivateRoute component={<BusinessDetail />} />}
        />
        <Route // 가맹점 관리 페이지
          path="/businessList"
          element={<PrivateRoute component={<BusinessList />} />}
        />
        <Route // Application List
          path="/application"
          element={<PrivateRoute component={<Application />} />}
        />
        {/* {localStorage.getItem('userName') ?
          <Route path="/application" element={<Application />} /> :
          <Route // Application List
            path="/application"
            element={<PrivateRoute component={<Application />} />}
          />
        } */}
        <Route // Application 관리 페이지
          path="/appDetail"
          element={<PrivateRoute component={<AppDetail />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;