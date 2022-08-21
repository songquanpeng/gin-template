import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Icon, Menu } from 'semantic-ui-react';

// Header Buttons
const headerButtons = [
  {
    name: 'Home',
    to: '/',
    icon: 'home',
  },
  {
    name: 'User',
    to: '/user',
    icon: 'user',
  },
  {
    name: 'Setting',
    to: '/setting',
    icon: 'setting',
  },
  {
    name: 'About',
    to: '/about',
    icon: 'info circle',
  },
];

const Header = () => {
  return (
    <>
      <Menu fixed="top" borderless>
        <Container>
          <Menu.Item as={Link} to="/">
            <img src="/logo.png" alt="logo" style={{ marginRight: '0.75em' }} />
            <div style={{ fontSize: '20px' }}>
              <b>React Template</b>
            </div>
          </Menu.Item>
          {headerButtons.map((button) => (
            <Menu.Item key={button.name} as={Link} to={button.to}>
              <Icon name={button.icon} />
              {button.name}
            </Menu.Item>
          ))}
        </Container>
      </Menu>
    </>
  );
};

export default Header;
