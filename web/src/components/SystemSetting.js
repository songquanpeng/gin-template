import React, { useEffect, useState } from 'react';
import { Form, Grid, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { showError } from '../helpers';

const SystemSetting = () => {
  let [inputs, setInputs] = useState({
    PasswordLoginEnabled: '',
    RegisterEnabled: '',
    EmailVerificationEnabled: '',
    Notice: '',
    SMTPServer: '',
    SMTPAccount: '',
    SMTPToken: '',
    ServerAddress: ''
  });
  let originInputs = {};
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
      originInputs = newInputs;
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
    if (name === 'Notice' || name.startsWith('SMTP') || name === 'ServerAddress') {
      setInputs(inputs => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const submitNotice = async () => {
    await updateOption('Notice', inputs.Notice);
  };

  const submitServerAddress = async () => {
    let ServerAddress = inputs.ServerAddress;
    if (ServerAddress.endsWith('/')) {
      ServerAddress = ServerAddress.slice(0, ServerAddress.length - 1);
    }
    await updateOption('ServerAddress', ServerAddress);
  };

  const submitSMTP = async () => {
    if (originInputs['SMTPServer'] !== inputs.SMTPServer) {
      await updateOption('SMTPServer', inputs.SMTPServer);
    }
    if (originInputs['SMTPAccount'] !== inputs.SMTPAccount) {
      await updateOption('SMTPAccount', inputs.SMTPAccount);
    }
    if (originInputs['SMTPToken'] !== inputs.SMTPToken && inputs.SMTPToken !== '') {
      await updateOption('SMTPToken', inputs.SMTPToken);
    }
  };

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form as={Segment} loading={loading}>
          <Form.Group widths='equal'>
            <Form.Input label='服务器地址' placeholder='例如：https://yourdomain.com' value={inputs.ServerAddress}
                        name='ServerAddress'
                        onChange={handleInputChange} />
          </Form.Group>
          <Form.Button onClick={submitServerAddress}>更新服务器地址</Form.Button>
          <Form.Group widths='equal'>
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
          <Form.Group widths={3}>
            <Form.Input
              label='SMTP 服务器地址'
              name='SMTPServer'
              onChange={handleInputChange}
              autoComplete='off'
              value={inputs.SMTPServer}
            />
            <Form.Input
              label='SMTP 账户'
              name='SMTPAccount'
              onChange={handleInputChange}
              autoComplete='off'
              value={inputs.SMTPAccount}
            />
            <Form.Input
              label='SMTP 访问凭证'
              name='SMTPToken'
              onChange={handleInputChange}
              type='password'
              autoComplete='off'
              value={inputs.SMTPToken}
            />
          </Form.Group>
          <Form.Button onClick={submitSMTP}>保存 SMTP 设置</Form.Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};


export default SystemSetting;