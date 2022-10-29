import React, { useState } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastConstants } from '../constants';

const RegisterForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: ''
  });
  const { username, password, password2 } = inputs;
  let navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (password !== password2) {
      toast.info('两次输入的密码不一致', { autoClose: toastConstants.INFO_TIMEOUT });
      return;
    }
    if (username && password) {
      try {
        const res = await axios.post('/api/user/register', {
          username,
          password
        });
        const { success, message } = res.data;
        if (success) {
          navigate('/login');
          toast.success('注册成功！', { autoClose: toastConstants.SUCCESS_TIMEOUT });
        } else {
          toast.error('错误：' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
          console.error(message);
        }
      } catch (e) {
        toast.error('错误：' + e, { autoClose: toastConstants.ERROR_TIMEOUT });
        console.error(e);
      }
    }
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/logo.png' /> 新用户注册
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='输入用户名'
              onChange={handleChange}
              name='username'
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='输入密码'
              onChange={handleChange}
              name='password'
              type='password'
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='再次输入密码'
              onChange={handleChange}
              name='password2'
              type='password'
            />
            <Button color='teal' fluid size='large' onClick={handleSubmit}>
              注册
            </Button>
          </Segment>
        </Form>
        <Message>
          已有有账户了？<Link to='/login' className='btn btn-link'>点击登录</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default RegisterForm;