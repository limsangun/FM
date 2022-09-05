import styled, { css } from "styled-components";

function isCurrent(to) {
  return window.location.pathname.startsWith(to);
}

const Link = styled.a`
  display: block;
  margin: 0 calc(20px * -1);
  padding: 8px 20px;
  color: black;
  text-decoration: none;
  cursor: pointer;

  ${(p) =>
    p.active &&
    css`
      font-weight: bold;
    `}

  // &:hover {
  //   transform: translateY(-2px);
  //   transition: 0.5s;
  // }
  &:hover {
    color: black;
    font-weight: bold;
  }
`;

function NavLink({ children, to, active = false, onClick}) {
  return (
    <Link
      href={to}
      active={active}
      aria-current={isCurrent(to) ? "page" : null}
      onClick = {onClick}
    >
      {children}
    </Link>
  );
}

export default NavLink;