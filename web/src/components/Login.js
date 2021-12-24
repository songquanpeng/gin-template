import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login, getStatus } from '../actions';

import { Form, Input, Button, Checkbox, Space, message as Message } from 'antd';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '', remember: true };
  }

  componentDidMount() {
    if (this.props.isLogin) {
      this.props.history.push('/');
    }
  }

  onValuesChange = (changedValues, allValues) => {
    for (let key in changedValues) {
      if (changedValues.hasOwnProperty(key)) {
        this.setState({ [key]: changedValues[key] });
      }
    }
  };

  onSubmit = async () => {
    try {
      let { status, message } = await this.props.login(
        this.state.username,
        this.state.password
      );
      if (status) {
        this.props.getStatus();
        Message.success('Login successfully!');
        this.props.history.push('/');
      } else {
        Message.error(message);
      }
    } catch (e) {
      Message.error(e.message);
    }
  };

  render() {
    const layout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 4 },
    };
    const tailLayout = {
      wrapperCol: { offset: 10, span: 16 },
    };
    return (
      <div className={'content-area'}>
        {' '}
        <Form
          {...layout}
          name="basic"
          initialValues={this.state}
          onValuesChange={this.onValuesChange}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit" onClick={this.onSubmit}>
                Submit
              </Button>
              <Button>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, { login, getStatus })(Login);
