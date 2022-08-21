import React from 'react';
import { Segment, Header } from 'semantic-ui-react';

const Home = () => (
  <>
    <Header
      block
      as="h4"
      content="Demo Block"
      attached="top"
      icon="info"
      className="small-icon"
    />
    <Segment attached="bottom">
      <h4>Time to conquer the world!</h4>
    </Segment>
  </>
);

export default Home;
