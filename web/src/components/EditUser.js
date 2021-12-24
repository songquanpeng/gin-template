import React, { Component } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import { Button, message as Message, Input, Switch, Form } from 'antd';

class EditUser extends Component {
  constructor(props) {
    super(props);
    const createNew = this.props.match.path === '/users/new';
    this.state = {
      loading: !createNew,
      isCreatingNewUser: createNew,
      user: {
        id: this.props.match.params.id,
        username: '',
        displayName: '',
        isAdmin: false,
        isModerator: false,
        isBlocked: false,
        email: '',
        url: '',
        avatar: '',
        password: '',
      },
    };

    this.formRef = React.createRef();
  }

  componentDidMount() {
    const that = this;
    if (!that.state.isCreatingNewUser) {
      axios
        .get('/api/user/' + that.state.user.id)
        .then(function (res) {
          if (res.data.status) {
            res.data.user.isAdmin = res.data.user.isAdmin === 1;
            res.data.user.isModerator = res.data.user.isModerator === 1;
            res.data.user.isBlocked = res.data.user.isBlocked === 1;
            console.log(res.data.user);
            that.setState(
              {
                user: res.data.user,
              },
              () => {
                that.formRef.current.resetFields();
              }
            );
          } else {
            Message.error(res.data.message);
          }
        })
        .catch(function (err) {
          Message.error(err.message);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  }

  onValuesChange = (changedValues, allValues) => {
    let user = { ...this.state.user };
    for (let key in changedValues) {
      if (changedValues.hasOwnProperty(key)) {
        user[key] = changedValues[key];
      }
    }
    this.setState({ user });
  };

  submitData = async () => {
    const user = this.state.user;
    console.log(user);
    const res = this.state.isCreatingNewUser
      ? await axios.post(`/api/user`, user)
      : await axios.put(`/api/user`, user);
    const { status, message } = res.data;
    if (status) {
      Message.success('Successfully processed.');
      this.props.history.goBack();
    } else {
      Message.error(message);
    }
  };

  render() {
    return (
      <div className={'content-area'}>
        <h1>Edit User</h1>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          layout="horizontal"
          onValuesChange={this.onValuesChange}
          ref={this.formRef}
          initialValues={this.state.user}
        >
          <Form.Item label="Username" name="username" required>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" required>
            <Input />
          </Form.Item>
          <Form.Item label="Display Name" name="displayName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" type="email">
            <Input />
          </Form.Item>
          <Form.Item label="Avatar" name="avatar" type="link">
            <Input />
          </Form.Item>
          <Form.Item label="Url" name="url" type="url">
            <Input />
          </Form.Item>
          <Form.Item label="Admin" name="isAdmin">
            <Switch checked={this.state.user.isAdmin} />
          </Form.Item>
          <Form.Item label="Moderator" name="isModerator">
            <Switch checked={this.state.user.isModerator} />
          </Form.Item>
          <Form.Item label="Blocked" name="isBlocked">
            <Switch checked={this.state.user.isBlocked} />
          </Form.Item>
          <Form.Item label="Action">
            <Button onClick={this.submitData}>Submit</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(EditUser);
