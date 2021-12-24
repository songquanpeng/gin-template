import React, { Component } from 'react';

import { connect } from 'react-redux';
import axios from 'axios';

import {
  message as Message,
  Button,
  Divider,
  Upload,
  Table,
  Space,
  Popconfirm,
  Input,
} from 'antd';

import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Search } = Input;

class Files extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      uploading: true,
      files: [],
      message: {
        visible: false,
        color: 'red',
        header: '',
        content: '',
      },
      searchTypingTimeout: 0,
    };
    const protocol = window.location.href.split('/')[0];
    const domain = window.location.href.split('/')[2];
    this.filePrefix = `${protocol}//${domain}`;
    this.columns = [
      {
        title: 'File name',
        dataIndex: 'filename',
        render: (value, record) => (
          <a href={this.filePrefix + record.path} download={value}>
            {value}
          </a>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        render: (value) => <p>{value}</p>,
      },
      {
        title: 'Operation',
        render: (record) => (
          <Space>
            <Button onClick={() => this.copyFilePath(record.path)}>
              Copy file path
            </Button>
            <Popconfirm
              placement="rightTop"
              title={'Are your sure to delete this page?'}
              onConfirm={() => this.deleteFile(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  }

  static getDerivedStateFromProps({ status }) {
    return { status };
  }

  async componentDidMount() {
    if (this.state.status === 0) {
      Message.error('Access denied.');
      this.props.history.push('/login');
      return;
    }
    await this.fetchData();
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(`/api/file/`);
      const { status, message, files } = res.data;
      if (status) {
        this.setState({ files });
      } else {
        Message.error(message);
      }
      this.setState({ loading: false });
    } catch (e) {
      Message.error(e.message);
    }
  };

  onInputChange = (e) => {
    this.setState({ keyword: e.target.value });
    if (this.state.searchTypingTimeout) {
      clearTimeout(this.state.searchTypingTimeout);
    }
    this.setState({
      searchTypingTimeout: setTimeout(() => {
        this.search();
      }, 500),
    });
  };

  search = () => {
    this.setState({ loading: true });
    axios
      .post('/api/file/search', {
        keyword: this.state.keyword,
      })
      .then(async (res) => {
        this.setState({ loading: false });
        this.setState({ files: res.data.files });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
        Message.error(err.message);
      });
  };

  downloadFile = (id) => {
    window.location = `//${window.location.href.split('/')[2]}/upload/${id}`;
  };

  copyFilePath = (path) => {
    let fullPath = window.location.href.split('/').slice(0, 3).join('/') + path;
    navigator.clipboard
      .writeText(fullPath)
      .then((r) => {
        Message.success('Copied: ' + fullPath);
      })
      .catch((e) => {
        Message.error(e.message);
      });
  };

  deleteFile = (id) => {
    axios
      .delete(`/api/file/${id}`)
      .then((res) => {
        if (res.data.status) {
          Message.success('You files have been deleted');
          this.fetchData().then((r) => {});
        } else {
          Message.error('Failed to delete file: ', res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        Message.error(err.message);
      });
  };

  render() {
    const { loading } = this.state;
    const that = this;
    const props = {
      name: 'file',
      multiple: true,
      action: '/api/file/',
      onChange(info) {
        const { status } = info.file;
        if (status === 'done') {
          Message.success(`${info.file.name} file uploaded successfully.`);
          that.fetchData().then((r) => {});
        } else if (status === 'error') {
          Message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div className={'content-area'}>
        <h1>Files</h1>
        <div>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload.
            </p>
          </Dragger>
        </div>
        <Divider />
        <Search
          placeholder="Search files..."
          size={'large'}
          onChange={this.onInputChange}
          enterButton
          loading={loading}
        />
        <Table
          columns={this.columns}
          dataSource={this.state.files}
          rowKey={'id'}
          style={{ marginTop: '16px' }}
          loading={this.state.loading}
          size={'small'}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Files);
