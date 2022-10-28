import React, { useState } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import DemoSetting from '../../components/DemoSetting';
import { Link } from 'react-router-dom';

const Setting = () => {
  return <Segment>
    <Header as='h3'>个人设置</Header>
    <Button as={Link} to={`/user/edit/`}>更新个人信息</Button>
    <Header as='h3'>示例设置</Header>
    <DemoSetting/>
  </Segment>;
};

export default Setting;
