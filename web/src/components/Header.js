import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';

import { Container, Icon, Menu } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastConstants } from '../constants';

// Header Buttons
const headerButtons = [
  {
    name: '首页',
    to: '/',
    icon: 'home'
  },
  {
    name: '用户',
    to: '/user',
    icon: 'user'
  },
  {
    name: '设置',
    to: '/setting',
    icon: 'setting'
  },
  {
    name: '关于',
    to: '/about',
    icon: 'info circle'
  }
];

const Header = () => {
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  async function logout() {
    await axios.get('/api/user/logout');
    toast.success('注销成功!', { autoClose: toastConstants.SUCCESS_TIMEOUT });
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/user');
  }

  return (
    <>
      <Menu fixed='top' borderless>
        <Container>
          <Menu.Item as={Link} to='/'>
            <img src='/logo.png' alt='logo' style={{ marginRight: '0.75em' }} />
            <div style={{ fontSize: '20px' }}>
              <b>项目模板</b>
            </div>
          </Menu.Item>
          {headerButtons.map((button) => (
            <Menu.Item key={button.name} as={Link} to={button.to}>
              <Icon name={button.icon} />
              {button.name}
            </Menu.Item>
          ))}
          <Menu.Menu position='right'>
            {userState.user ?
              <Menu.Item name='注销' onClick={logout} className='btn btn-link' /> :
              <Menu.Item name='登录' as={Link} to='/login' className='btn btn-link' />}
          </Menu.Menu>
        </Container>
      </Menu>
    </>
  );
};


export default Header;
