import React, { useState } from 'react';
import { Form, Grid, Segment } from 'semantic-ui-react';

const DemoSetting = () => {
  let [inputs, setInputs] = useState({
    activePage: 5,
    boundaryRange: 1,
    siblingRange: 1,
    showEllipsis: true,
    showFirstAndLastNav: true,
    showPreviousAndNextNav: true,
    totalPages: 50
  });

  const handleInputChange = (e, { name, value }) => {
    setInputs(inputs => ({ ...inputs, [name]: value }));
  };

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form as={Segment}>
          <Form.Group widths={2}>
            <Form.Input
              label='Active page'
              name='activePage'
              min={1}
              onChange={handleInputChange}
              type='number'
              value={inputs.activePage}
            />
            <Form.Input
              label='Total pages'
              name='totalPages'
              min={1}
              onChange={handleInputChange}
              type='number'
              value={inputs.totalPages}
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input
              label='Boundary pages range'
              name='boundaryRange'
              min={0}
              onChange={handleInputChange}
              type='number'
              value={inputs.boundaryRange}
            />
            <Form.Input
              label='Sibling pages range'
              name='siblingRange'
              min={0}
              onChange={handleInputChange}
              type='number'
              value={inputs.siblingRange}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.showEllipsis}
              label='Show ellipsis'
              name='showEllipsis'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.showFirstAndLastNav}
              label='Show first and last nav pages'
              name='showFirstAndLastNav'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.showPreviousAndNextNav}
              label='Show previous and next nav pages'
              name='showPreviousAndNextNav'
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Grid.Column>
    </Grid>
  );
};


export default DemoSetting;