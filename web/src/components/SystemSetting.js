import React, { useEffect, useState } from 'react';
import { Form, Grid, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { showError } from '../helpers';

const SystemSetting = () => {
  let [inputs, setInputs] = useState({
    PasswordLoginEnabled: '',
    RegisterEnabled: '',
    EmailVerificationEnabled: '',
    Notice: ''
  });
  let [loading, setLoading] = useState(false);

  const getOptions = async () => {
    const res = await axios.get('/api/option');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach(item => {
        newInputs[item.key] = item.value;
      });
      setInputs(newInputs);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions().then();
  }, []);

  const updateOption = async (key, value) => {
    setLoading(true);
    switch (key) {
      case 'PasswordLoginEnabled':
      case 'RegisterEnabled':
      case 'EmailVerificationEnabled':
        value = inputs[key] === 'true' ? 'false' : 'true';
        break;
    }
    const res = await axios.put('/api/option', {
      key, value
    });
    const { success, message } = res.data;
    if (success) {
      setInputs(inputs => ({ ...inputs, [key]: value }));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (e, { name, value }) => {
    if (name === 'Notice') {
      setInputs(inputs => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const submitNotice = async () => {
    await updateOption('Notice', inputs.Notice);
  };

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form as={Segment} loading={loading}>
          <Form.Group widths='equal'>
            {/*<TextArea placeholder='Tell us more' style={{ minHeight: 100 }}  />*/}
            <Form.TextArea label='公告' placeholder='在此输入新的公告' value={inputs.Notice} name='Notice'
                           onChange={handleInputChange}
                           style={{ minHeight: 150, fontFamily: 'JetBrains Mono, Consolas' }} />
          </Form.Group>
          <Form.Button onClick={submitNotice}>保存公告</Form.Button>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.PasswordLoginEnabled === 'true'}
              label='允许密码登录'
              name='PasswordLoginEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.RegisterEnabled === 'true'}
              label='允许新用户注册'
              name='RegisterEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.EmailVerificationEnabled === 'true'}
              label='用户注册时必须通过邮箱验证'
              name='EmailVerificationEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Grid.Column>
    </Grid>
  );
};


export default SystemSetting;