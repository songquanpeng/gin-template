import React from 'react';
import { Header, Segment } from 'semantic-ui-react';

const About = () => (
  <>
    <Segment>
      <Header as="h3">关于</Header>
      GitHub:{' '}
      <a href="https://github.com/songquanpeng/gin-template">
        https://github.com/songquanpeng/gin-template
      </a>
    </Segment>
  </>
);

export default About;
