import styled from "styled-components";

const Navigation = styled.nav`
  min-width: 200px;
  padding-top : 50px;
  padding-right: 20px;
  padding-left: 32px;
  position: fixed;
`;

function Nav({ children }) {
  return <Navigation>{children}</Navigation>;
}

export default Nav;