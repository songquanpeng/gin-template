import React, { Component } from 'react';
import { message as Message } from 'antd';
import { connect } from 'react-redux';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps({ status }) {
    return { status };
  }

  async componentDidMount() {
    if (this.state.status === 0) {
      Message.error('Access denied.');
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <div className={'content-area'}>
        <h1>Comments</h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Comments);
