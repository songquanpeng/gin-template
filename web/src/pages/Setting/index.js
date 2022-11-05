import React, { useEffect, useState } from 'react';
import { Button, Form, Image, Modal, Segment, Tab } from 'semantic-ui-react';
import SystemSetting from '../../components/SystemSetting';
import { Link } from 'react-router-dom';
import { API, copy, isRoot, showError, showSuccess } from '../../helpers';
import { marked } from 'marked';

const Setting = () => {
  const [inputs, setInputs] = useState({
    wechat_verification_code: '',
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    tag_name: '',
    content: '',
  });
  const [status, setStatus] = useState({});
  const [showWeChatBindModal, setShowWeChatBindModal] = useState(false);

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
    }
  }, []);

  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const generateToken = async () => {
    const res = await API.get('/api/user/token');
    const { success, message, data } = res.data;
    if (success) {
      await copy(data);
      showSuccess(`令牌已重置并已复制到剪切板：${data}`);
    } else {
      showError(message);
    }
  };

  const bindWeChat = async () => {
    if (inputs.wechat_verification_code === '') return;
    const res = await API.get(
      `/api/oauth/wechat/bind?code=${inputs.wechat_verification_code}`
    );
    const { success, message, data } = res.data;
    if (success) {
      showSuccess('微信账户绑定成功！');
      setShowWeChatBindModal(false);
    } else {
      showError(message);
    }
  };

  const openGitHubRelease = () => {
    window.location =
      'https://github.com/songquanpeng/gin-template/releases/latest';
  };

  const checkUpdate = async () => {
    const res = await API.get(
      'https://api.github.com/repos/songquanpeng/gin-template/releases/latest'
    );
    const { tag_name, body } = res.data;
    if (tag_name === process.env.REACT_APP_VERSION) {
      showSuccess(`已是最新版本：${tag_name}`);
    } else {
      setUpdateData({
        tag_name: tag_name,
        content: marked.parse(body),
      });
      setShowUpdateModal(true);
    }
  };

  let panes = [
    {
      menuItem: '个人设置',
      render: () => (
        <Tab.Pane attached={true}>
          <Button as={Link} to={`/user/edit/`}>
            更新个人信息
          </Button>
          <Button onClick={generateToken}>生成访问令牌</Button>
          <Button
            onClick={() => {
              setShowWeChatBindModal(true);
            }}
          >
            绑定微信账号
          </Button>
        </Tab.Pane>
      ),
    },
  ];

  if (isRoot()) {
    panes.push({
      menuItem: '系统设置',
      render: () => (
        <Tab.Pane attached={false}>
          <SystemSetting />
        </Tab.Pane>
      ),
    });
    panes.push({
      menuItem: '其他设置',
      render: () => (
        <Tab.Pane attached={false}>
          <Button onClick={checkUpdate}>检查更新</Button>
          <Modal
            onClose={() => setShowUpdateModal(false)}
            onOpen={() => setShowUpdateModal(true)}
            open={showUpdateModal}
          >
            <Modal.Header>新版本：{updateData.tag_name}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <div
                  dangerouslySetInnerHTML={{ __html: updateData.content }}
                ></div>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setShowUpdateModal(false)}>关闭</Button>
              <Button
                content="详情"
                onClick={() => {
                  setShowUpdateModal(false);
                  openGitHubRelease();
                }}
              />
            </Modal.Actions>
          </Modal>
        </Tab.Pane>
      ),
    });
  }

  return (
    <Segment>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      <Modal
        onClose={() => setShowWeChatBindModal(false)}
        onOpen={() => setShowWeChatBindModal(true)}
        open={showWeChatBindModal}
        size={'mini'}
      >
        <Modal.Content>
          <Modal.Description>
            <Image src={status.wechat_qrcode} wrapped />
            <div style={{ textAlign: 'center' }}>
              <p>
                微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）
              </p>
            </div>
            <Form size="large">
              <Form.Input
                fluid
                placeholder="验证码"
                name="wechat_verification_code"
                value={inputs.wechat_verification_code}
                onChange={handleInputChange}
              />
              <Button color="teal" fluid size="large" onClick={bindWeChat}>
                绑定
              </Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </Segment>
  );
};

export default Setting;
