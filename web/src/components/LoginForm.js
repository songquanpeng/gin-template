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
      const res = await axios.post('/api/user/login', {
        username,
        password
      });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/user');
        toast.success('Login successfully!', { autoClose: toastConstants.SUCCESS_TIMEOUT });
      } else {
        toast.error('Error: ' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
        console.error(message);
      }
    }
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/logo.png' /> Login to your account
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Username'
              name='username'
              value={username}
              onChange={handleChange} />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              name='password'
              type='password'
              value={password}
              onChange={handleChange}
            />
            <Button color='teal' fluid size='large' onClick={handleSubmit}>
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <Link to='/register' className='btn btn-link'>Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};


export default LoginForm;