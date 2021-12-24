import React, { Component } from 'react';

import { connect } from 'react-redux';

import axios from 'axios';
import {
  Table,
  Tag,
  Button,
  message as Message,
  Tooltip,
  Space,
  Popconfirm,
} from 'antd';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: -1,
      users: [],
      user: {},
      loading: false,
      loadingUserStatus: true,
    };
    this.columns = [
      {
        title: 'Username',
        dataIndex: 'username',
        render: (value, record) => (
          <Tooltip title={record.displayName}>
            <a href={record.url}>{value}</a>
          </Tooltip>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        render: (value) => <>{value ? value : 'no email'}</>,
      },
      {
        title: 'Admin',
        dataIndex: 'isAdmin',
        render: (value) => (
          <Tag color={value ? 'green' : ''}>{value ? 'Yes' : 'No'}</Tag>
        ),
      },
      {
        title: 'Moderator',
        dataIndex: 'isModerator',
        render: (value) => (
          <Tag color={value ? 'green' : ''}>{value ? 'Yes' : 'No'}</Tag>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'isBlocked',
        render: (value) => (
          <Tag color={value ? 'red' : 'green'}>
            {value ? 'Blocked' : 'Normal'}
          </Tag>
        ),
      },
      {
        title: 'Operation',
        render: (record) => (
          <Space>
            <Button onClick={() => this.editUser(record.id)}>Edit</Button>
            <Popconfirm
              placement="rightTop"
              title={'Are your sure to delete this user?'}
              onConfirm={() => this.deleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  }

  static getDerivedStateFromProps({ status }) {
    return { status };
  }

  async componentDidMount() {
    if (this.state.status === 0) {
      Message.error('Access denied.');
      this.props.history.push('/login');
      return;
    }
    await this.fetchData();
    await this.fetchUserStatus();
  }

  fetchUserStatus = async () => {
    try {
      const res = await axios.get(`/api/user/status`);
      const { status, message, user } = res.data;
      if (status) {
        this.setState({ user });
      } else {
        Message.config(message);
      }
      this.setState({ loadingUserStatus: false });
    } catch (e) {
      Message.error(e.message);
    }
  };

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(`/api/user`);
      const { status, message, users } = res.data;
      if (status) {
        this.setState({ users });
      } else {
        Message.error(message);
      }
      this.setState({ loading: false });
    } catch (e) {
      Message.error(e.message);
    }
  };

  addUser = () => {
    this.props.history.push('/users/new');
  };

  deleteUser = (id) => {
    const that = this;
    axios.delete(`/api/user/${id}`).then(async function (res) {
      const { status, message } = res.data;
      if (status) {
        Message.success('User has been deleted.');
        await that.fetchData();
      } else {
        Message.error(message);
      }
    });
  };

  editUser = (id) => {
    this.props.history.push(`/users/${id}`);
  };

  render() {
    return (
      <div className={'content-area'}>
        <h1>Users</h1>
        <Button
          onClick={() => {
            this.addUser();
          }}
        >
          New account
        </Button>
        <Table
          columns={this.columns}
          dataSource={this.state.users}
          rowKey={'id'}
          style={{ marginTop: '16px' }}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Users);
