import "../css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer_inner">
        <div className="logo_foot">
          <img src="./img/HeaderLogo.png" alt="bizplay" />
          <span style={{ position: 'relative', top: '-7px', left: '4px', fontSize: '16px', fontWeight: 'bold' }}>Franchise</span>
          <span style={{ position: 'relative', top: '8px', left: '-68px', fontSize: '16px', fontWeight: 'bold' }}>Management</span>
        </div>
        <div className="footer_info">
          <p>
            상호 : 비즈플레이㈜&nbsp;&nbsp;
            대표이사 : 김홍기
          </p>
          <p>주소 : 서울시 영등포구 영신로 220 KnK디지털타워 19층</p>
          <p>
            사업자등록번호 : 107-88-36127
            <span>통신판매신고번호 : 2015-서울영등포-0113호</span>
          </p>
          <p>TEL : 1566-7235</p>
          <p className="foot_copyright">Copyright(c) <strong>bizplay</strong> All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
