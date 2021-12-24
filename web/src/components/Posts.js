import React, { Component } from 'react';
import {
  Table,
  Tag,
  Button,
  message as Message,
  Tooltip,
  Space,
  Popconfirm,
  Input,
  Select,
  Row,
  Col,
} from 'antd';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import axios from 'axios';

import { PAGE_OPTIONS } from './Editor';
import { getDate } from '../utils';

const { Search } = Input;

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      loading: false,
      searchTypingTimeout: 0,
      searchOption: -1,
      keyword: '',
      activeItem: '',
      direction: 'up',
      status: 0,
    };
    this.columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: (a, b) => a.title > b.title,
        sortDirections: ['descend', 'ascend'],
        render: (value, record) => (
          <Tooltip
            title={`Posted on ${record.createdAt}\nEdited on ${record.updatedAt}`}
          >
            <span>
              <a href={'/page/' + record.link}>{value ? value : 'No title'}</a>
            </span>
          </Tooltip>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        render: (value) => (
          <Tag color={PAGE_OPTIONS[value + 1].key}>
            {PAGE_OPTIONS[value + 1].label}
          </Tag>
        ),
      },
      {
        title: 'Views',
        dataIndex: 'view',
        sorter: (a, b) => parseInt(a.view) > parseInt(b.view),
        sortDirections: ['descend', 'ascend'],
        render: (value) => <Tag color={'blue'}>{value}</Tag>,
      },
      {
        title: 'Tag',
        dataIndex: 'tag',
        render: (tags) => (
          <>
            {tags.split(' ').map((tag) => {
              return (
                <Tag color={'cyan'} key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: 'Page status',
        dataIndex: 'pageStatus',
        sorter: (a, b) => parseInt(a.pageStatus) > parseInt(b.pageStatus),
        sortDirections: ['descend', 'ascend'],
        render: (value, record) => {
          if (value === 0) {
            return (
              <Tag
                icon={<MinusCircleOutlined />}
                color="default"
                onClick={() => this.switchStatus(record.id, 'pageStatus')}
              >
                recalled
              </Tag>
            );
          } else if (value === 1) {
            return (
              <Tag
                icon={<CheckCircleOutlined />}
                color="success"
                onClick={() => this.switchStatus(record.id, 'pageStatus')}
              >
                published
              </Tag>
            );
          } else {
            return (
              <Tag
                icon={<CheckCircleOutlined />}
                color="orange"
                onClick={() => this.switchStatus(record.id, 'pageStatus')}
              >
                stay on top
              </Tag>
            );
          }
        },
      },
      {
        title: 'Comment status',
        dataIndex: 'commentStatus',
        sorter: (a, b) => parseInt(a.commentStatus) > parseInt(b.commentStatus),
        sortDirections: ['descend', 'ascend'],
        render: (value, record) =>
          value === 1 ? (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              onClick={() => this.switchStatus(record.id, 'commentStatus')}
            >
              enabled
            </Tag>
          ) : (
            <Tag
              icon={<MinusCircleOutlined />}
              color="default"
              onClick={() => this.switchStatus(record.id, 'commentStatus')}
            >
              disabled
            </Tag>
          ),
      },
      {
        title: 'Operation',
        render: (record) => (
          <Space>
            <Button type="primary" onClick={() => this.editPage(record.id)}>
              Edit
            </Button>
            <Button onClick={() => this.exportPage(record.id)}>Export</Button>
            <Popconfirm
              placement="rightTop"
              title={'Are your sure to delete this page?'}
              onConfirm={() => this.deletePage(record.id)}
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
    await this.loadPagesFromServer();
  }

  onSearchOptionChange = (e, { value }) => {
    this.setState({ searchOption: value }, () => {
      this.search();
    });
  };

  searchPages = (e) => {
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
    const that = this;
    axios
      .post(`/api/page/search`, {
        // TODO
        type: this.state.searchOption,
        keyword: this.state.keyword,
      })
      .then(async function (res) {
        const { status, message, pages } = res.data;
        if (status) {
          that.setState({ pages });
        } else {
          Message.error(message);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  async loadPagesFromServer() {
    try {
      this.setState({ loading: true });
      const res = await axios.get('/api/page');
      let { status, message, pages } = res.data;
      if (status) {
        pages.forEach((page) => {
          page.createdAt = getDate(page.createdAt);
          page.updatedAt = getDate(page.updatedAt);
        });
        this.setState({ pages });
        Message.success('Loading done.');
      } else {
        Message.error(message);
      }
      this.setState({ loading: false });
    } catch (e) {
      Message.error(e.message);
    }
  }

  editPage = (id) => {
    this.props.history.push(`/editor/${id}`);
  };

  viewPage = (link) => {
    window.location = `//${window.location.href.split('/')[2]}/page/${link}`;
  };

  exportPage = (id) => {
    window.location = `//${
      window.location.href.split('/')[2]
    }/api/page/export/${id}`;
  };

  getPageById = (id) => {
    for (let i = 0; i < this.state.pages.length; i++) {
      if (this.state.pages[i].id === id) {
        return [i, this.state.pages[i]];
      }
    }
    return [-1, undefined];
  };

  updateTargetPage = (index, page) => {
    if (index === -1) {
      return;
    }
    let pages = { ...this.state.pages };
    pages[index] = page;
    this.setState({ page });
  };

  deletePage = (id) => {
    const that = this;
    axios.delete(`/api/page/${id}`).then(async function (res) {
      const { status, message } = res.data;
      if (status) {
        let [i, page] = that.getPageById(id);
        if (i !== -1) {
          page.deleted = true;
          that.updateTargetPage(i, page);
          Message.success('Your page has been deleted.');
        } else {
          Message.error('Something went wrong.');
          console.error(id, i, page, that.state.pages);
        }
      } else {
        Message.error(message);
      }
    });
  };

  switchStatus = (id, key) => {
    const that = this;
    let pages = this.state.pages;
    let page = pages.find((x) => x.id === id);
    let base = 2;
    if (key === 'pageStatus') {
      base = 3;
    }
    page[key] = (page[key] + 1) % base;
    page.id = id;
    axios
      .put('/api/page/', page)
      .then(async function (res) {
        if (res.data.status) {
          let i = that.getPageById(id)[0];
          that.updateTargetPage(i, page);
          Message.success('Your page has been updated.');
        } else {
          Message.error(res.data.message);
        }
      })
      .catch(function (e) {
        Message.error(e.message);
      });
  };

  render() {
    return (
      <div className={'content-area'}>
        <h1>Posts</h1>
        <Row justify="end" align="middle">
          <Col span={2} style={{ marginRight: '8px' }}>
            <Select
              options={PAGE_OPTIONS}
              defaultValue={-1}
              value={this.state.searchOption}
              onChange={this.onSearchOptionChange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <Search
              placeholder='Press "Enter" to search...'
              size={'large'}
              value={this.state.keyword}
              onChange={this.searchPages}
              enterButton
            />
          </Col>
        </Row>

        <Table
          columns={this.columns}
          dataSource={this.state.pages}
          rowKey={'id'}
          style={{ marginTop: '16px' }}
          loading={this.state.loading}
          rowClassName={(record) => record.deleted && 'disabled-row'}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Posts);
