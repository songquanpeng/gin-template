import React, { useEffect } from 'react';
import { Grid, Placeholder, Segment, Header } from 'semantic-ui-react';
import axios from 'axios';
import { showError } from '../../helpers';
import { toast } from 'react-toastify';

const Home = () => {
  const showNotice = async () => {
    const res = await axios.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      let oldNotice = localStorage.getItem('notice');
      if (data !== oldNotice) {
        toast.info(data, { autoClose: false });
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    showNotice().then();
  }, []);
  return <>
    <Segment>
      <Header as='h3'>示例标题</Header>
      <Grid columns={3} stackable>
        <Grid.Column>
          <Segment raised>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment raised>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment raised>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  </>;
};

export default Home;
