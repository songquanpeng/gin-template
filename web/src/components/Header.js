import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';

import { Container, Icon, Menu } from 'semantic-ui-react';
import { API, isAdmin, isMobile, showSuccess } from '../helpers';
import '../index.css';

// Header Buttons
const headerButtons = [
  {
    name: '首页',
    to: '/',
    icon: 'home',
  },
  {
    name: '用户',
    to: '/user',
    icon: 'user',
    admin: true,
  },
  {
    name: '设置',
    to: '/setting',
    icon: 'setting',
  },
  {
    name: '关于',
    to: '/about',
    icon: 'info circle',
  },
];

const Header = () => {
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();
  let size = isMobile() ? 'large' : '';

  async function logout() {
    await API.get('/api/user/logout');
    showSuccess('注销成功!');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <>
      <Menu borderless size={size} style={{ borderTop: 'none' }}>
        <Container>
          <Menu.Item as={Link} to="/" className={'hide-on-mobile'}>
            <img src="/logo.png" alt="logo" style={{ marginRight: '0.75em' }} />
            <div style={{ fontSize: '20px' }}>
              <b>项目模板</b>
            </div>
          </Menu.Item>
          {headerButtons.map((button) => {
            if (button.admin && !isAdmin()) return <></>;
            return (
              <Menu.Item key={button.name} as={Link} to={button.to}>
                <Icon name={button.icon} />
                {button.name}
              </Menu.Item>
            );
          })}
          <Menu.Menu position="right">
            {userState.user ? (
              <Menu.Item
                name="注销"
                onClick={logout}
                className="btn btn-link"
              />
            ) : (
              <Menu.Item
                name="登录"
                as={Link}
                to="/login"
                className="btn btn-link"
              />
            )}
          </Menu.Menu>
        </Container>
      </Menu>
    </>
  );
};

export default Header;
