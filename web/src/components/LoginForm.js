import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { toast } from 'react-toastify';
import { toastConstants } from '../constants';

const LoginForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    setSubmitted(true);
    if (username && password) {
      try {
        const res = await axios.post('/api/user/login', {
          username,
          password
        });
        const { success, message, data } = res.data;
        if (success) {
          userDispatch({ type: 'login', payload: data });
          localStorage.setItem('user', JSON.stringify(data));
          navigate('/');
          toast.success('登录成功！', { autoClose: toastConstants.SUCCESS_TIMEOUT });
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
          <Image src='/logo.png' /> 用户登录
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='用户名'
              name='username'
              value={username}
              onChange={handleChange} />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='密码'
              name='password'
              type='password'
              value={password}
              onChange={handleChange}
            />
            <Button color='teal' fluid size='large' onClick={handleSubmit}>
              登录
            </Button>
          </Segment>
        </Form>
        <Message>
          忘记密码？<Link to='/reset' className='btn btn-link'>点击重置</Link>；
          没有账户？<Link to='/register' className='btn btn-link'>点击注册</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};


export default LoginForm;