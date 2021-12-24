import React from 'react';
import {
  Layout,
  Menu,
  Dropdown,
  Space,
  Button,
  message as Message,
} from 'antd';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  PoweroffOutlined,
  FileTextOutlined,
  CommentOutlined,
  CloudUploadOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  CodeOutlined,
} from '@ant-design/icons';

import { Link, Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';
import { logout, getStatus } from '../actions';

import Editor from './Editor';
import Posts from './Posts';
import Settings from './Settings';
import Users from './Users';
import Files from './Files';
import Comments from './Comments';
import Login from './Login';
import EditUser from './EditUser';

import './App.css';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

class App extends React.Component {
  state = {
    collapsed: true,
  };

  componentDidMount = () => {
    this.props.getStatus();
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  static getDerivedStateFromProps({ status }) {
    return { status };
  }

  logout = async () => {
    let { status, message } = await this.props.logout();
    if (status) {
      Message.success(message);
      this.setState({ status: 0 });
    } else {
      Message.error(message);
    }
  };

  shutdownServer = async () => {
    const res = await axios.get('/api/option/shutdown');
    const { message } = res.data;
    Message.error(message);
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to={'/users'}>Account</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<SettingOutlined />}>
          <Link to={'/settings'}>Settings</Link>
        </Menu.Item>
        <Menu.Divider />
        {this.state.status === 1 ? (
          <Menu.Item key="3" icon={<LogoutOutlined />}>
            <Link
              to={'/login'}
              onClick={() => {
                this.logout().then((r) => {});
              }}
            >
              Logout
            </Link>
          </Menu.Item>
        ) : (
          <Menu.Item key="4" icon={<LoginOutlined />}>
            <Link to={'/login'}>Login</Link>
          </Menu.Item>
        )}
        <Menu.Item key="5" icon={<PoweroffOutlined />}>
          <Link to={'/login'} onClick={() => this.shutdownServer()}>
            Shutdown
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout style={{ height: '100%' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo">
            <h1>System Admin</h1>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
            <Menu.Item key="3" icon={<FileTextOutlined />}>
              <Link to={'/posts'}>Posts</Link>
            </Menu.Item>
            <Menu.Item key="1" icon={<CodeOutlined />}>
              <Link to={'/editor'}>Editor</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<CommentOutlined />}>
              <Link to={'/comments'}>Comments</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<CloudUploadOutlined />}>
              <Link to={'/files'}>Files</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<UserOutlined />}>
              <Link to={'/users'}>Users</Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<SettingOutlined />}>
              <Link to={'/settings'}>Settings</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: this.toggle,
              }
            )}
            <Space style={{ float: 'right', marginRight: '16px' }}>
              <Dropdown overlay={menu} placement="bottomCenter">
                <Button type={'text'} icon={<UserOutlined />} size={'large'}>
                  Admin
                </Button>
              </Dropdown>
            </Space>
          </Header>
          <Content>
            <Switch>
              <Route path="/editor" exact component={Editor} />
              <Route path="/editor/:id" exact component={Editor} />
              <Route path="/" exact component={Posts} />
              <Route path="/users" exact component={Users} />
              <Route path="/users/new" exact component={EditUser} />
              <Route path="/users/:id" exact component={EditUser} />
              <Route path="/settings" exact component={Settings} />
              <Route path="/files" exact component={Files} />
              <Route path="/comments" exact component={Comments} />
              <Route path="/posts" exact component={Posts} />
              <Route path="/login" exact component={Login} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, { logout, getStatus })(App);
