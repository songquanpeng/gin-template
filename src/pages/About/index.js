import React from 'react';
import { Segment, Header } from 'semantic-ui-react';

const About = () => (
  <>
    <Header
      block
      as="h4"
      content="About"
      attached="top"
      icon="info"
      className="small-icon"
    />
    <Segment attached="bottom">
      GitHub:{' '}
      <a href="https://github.com/songquanpeng/react-template">
        https://github.com/songquanpeng/react-template
      </a>
    </Segment>
  </>
);

export default About;
