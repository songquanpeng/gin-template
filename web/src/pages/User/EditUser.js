import React, { useEffect, useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastConstants } from '../../constants';

const EditUser = () => {
  const params = useParams();
  const userId = params.id;
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({
    display_name: '',
    password: ''
  });
  const { display_name, password } = inputs;
  const handleInputChange = (e, { name, value }) => {
    setInputs(inputs => ({ ...inputs, [name]: value }));
  };

  const loadUser = async () => {
    let res = undefined;
    if (userId) {
      res = await axios.get(`/api/user/${userId}`);
    } else {
      res = await axios.get(`/api/user/self`);
    }
    const { success, message, data } = res.data;
    if (success) {
      data.password = '';
      setInputs(data);
    } else {
      toast.error('错误：' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
      console.error(message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadUser().then().catch(reason => {
      console.error(reason);
      toast.error('错误：' + reason, { autoClose: toastConstants.ERROR_TIMEOUT });
    });
  }, []);

  const submit = async () => {
    let res = undefined;
    if (userId) {
      res = await axios.put(`/api/user/`, { ...inputs, id: parseInt(userId) });
    } else {
      res = await axios.put(`/api/user/self`, inputs);
    }
    const { success, message } = res.data;
    if (success) {
      toast.success('用户信息更新成功！', { autoClose: toastConstants.SUCCESS_TIMEOUT });
    } else {
      toast.error('错误：' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
      console.error(message);
    }
  };

  return <>
    <Segment loading={loading}>
      <Header as='h3'>更新用户信息</Header>
      <Form autocomplete='off'>
        <Form.Field>
          <Form.Input
            label='显示名称'
            name='display_name'
            placeholder={'请输入新的显示名称'}
            onChange={handleInputChange}
            value={display_name}
            autocomplete='off'
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label='密码'
            name='password'
            type={'password'}
            placeholder={'请输入新的密码'}
            onChange={handleInputChange}
            value={password}
            autocomplete='off'
          />
        </Form.Field>
        <Button onClick={submit}>提交</Button>
      </Form>
    </Segment>
  </>;
};

export default EditUser;