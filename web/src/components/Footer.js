import React from 'react';

import { Container, Segment } from 'semantic-ui-react';

const Footer = () => (
  <Segment vertical>
    <Container textAlign="center">
      <div className="custom-footer"><a href="https://github.com/songquanpeng/gin-template" target='_blank'>项目模板 {process.env.REACT_APP_VERSION} </a>
        由 <a href="https://github.com/songquanpeng" target='_blank'>JustSong</a> 构建，源代码遵循 <a href="https://opensource.org/licenses/mit-license.php">MIT 协议</a></div>
    </Container>
  </Segment>
);

export default Footer;
