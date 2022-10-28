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
      toast.info('The two entered passwords do not match.', { autoClose: toastConstants.INFO_TIMEOUT });
      return;
    }
    if (username && password) {
      const res = await axios.post('/api/user/register', {
        username,
        password
      });
      const { success, message } = res.data;
      if (success) {
        navigate('/login');
        toast.success('Register successfully!', { autoClose: toastConstants.SUCCESS_TIMEOUT });
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
          <Image src='/logo.png' /> Register a new account
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Username'
              onChange={handleChange}
              name='username'
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Input a new password'
              onChange={handleChange}
              name='password'
              type='password'
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Input your password again'
              onChange={handleChange}
              name='password2'
              type='password'
            />
            <Button color='teal' fluid size='large' onClick={handleSubmit}>
              Register
            </Button>
          </Segment>
        </Form>
        <Message>
          Already has an account? <Link to='/login' className='btn btn-link'>Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default RegisterForm;