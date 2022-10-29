import React, { useEffect, useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastConstants } from '../../constants';

const AddUser = () => {
  const originInputs = {
    username: '',
    display_name: '',
    password: ''
  };
  const [inputs, setInputs] = useState(originInputs);
  const { username, display_name, password } = inputs;

  const handleInputChange = (e, { name, value }) => {
    setInputs(inputs => ({ ...inputs, [name]: value }));
  };

  const submit = async () => {
    if (inputs.username === "" || inputs.password === "") return
    const res = await axios.post(`/api/user/`, inputs);
    const { success, message } = res.data;
    if (success) {
      toast.success('用户账户创建成功！', { autoClose: toastConstants.SUCCESS_TIMEOUT });
      setInputs(originInputs);
    } else {
      toast.error('错误：' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
      console.error(message);
    }
  };

  return <>
    <Segment>
      <Header as='h3'>创建新用户账户</Header>
      <Form autoComplete='off'>
        <Form.Field>
          <Form.Input
            label='用户名'
            name='username'
            placeholder={'请输入用户名'}
            onChange={handleInputChange}
            value={username}
            autoComplete='off'
            required
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label='显示名称'
            name='display_name'
            placeholder={'请输入显示名称'}
            onChange={handleInputChange}
            value={display_name}
            autoComplete='off'
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label='密码'
            name='password'
            type={'password'}
            placeholder={'请输入密码'}
            onChange={handleInputChange}
            value={password}
            autoComplete='off'
            required
          />
        </Form.Field>
        <Button type={'submit'} onClick={submit}>提交</Button>
      </Form>
    </Segment>
  </>;
};

export default AddUser;
