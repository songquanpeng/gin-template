import React, { Component } from 'react';

import { connect } from 'react-redux';

import axios from 'axios';
import { message as Message, Button, Tabs, Form, Input } from 'antd';

const { TabPane } = Tabs;

const tabs = [
  {
    label: 'System',
    settings: [
      {
        key: 'domain',
        description: 'Notice domain only.',
      },
      {
        key: 'language',
        description: 'Something like : en, zh.',
      },
      {
        key: 'copyright',
        description: 'HTML text, attached to the end of the article.',
      },
      {
        key: 'allow_comments',
        description: 'true or false',
      },
    ],
  },
  {
    label: 'Customize',
    settings: [
      {
        key: 'theme',
        description:
          "The theme folder's name, you should download and put it in the themes folder. Restart required.",
      },
      {
        key: 'code_theme',
        description:
          'Choose one from here: https://www.jsdelivr.com/package/npm/highlight.js?path=styles',
      },
      {
        key: 'site_name',
        description: "Your website's name.",
      },
      {
        key: 'description',
        description: 'Description for this website.',
      },
      {
        key: 'nav_links',
        description: 'Should be a valid json, the format must be correct.',
        isBlock: true,
      },
      {
        key: 'author',
        description: 'Your name.',
      },
      {
        key: 'motto',
        description: 'Your motto.',
      },
      {
        key: 'favicon',
        description: 'An image link.',
      },
      {
        key: 'brand_image',
        description: 'An image link.',
      },
    ],
  },
  {
    label: 'Third Party',
    settings: [
      {
        key: 'ad',
        description: 'Ad code',
        isBlock: true,
      },
      {
        key: 'extra_header_code',
        description: 'For example you can insert google analytics code here.',
        isBlock: true,
      },
      {
        key: 'extra_footer_code',
        description: 'This code will be inserted into the body tag.',
      },
      {
        key: 'disqus',
        description: 'Your disqus identifier.',
      },
      {
        key: 'extra_footer_text',
        description: 'Add some text in the footer.',
      },
      {
        key: 'message_push_api',
        description:
          'Check this out: https://github.com/songquanpeng/message-pusher.',
      },
    ],
  },
];

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      submitLoading: false,
      language: 'javascript',
      options: {},
      optionIndex: 0,
    };
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
      const res = await axios.get(`/api/option/`);
      let { status, message, options } = res.data;
      let temp = {};
      if (status) {
        options.forEach((option) => {
          temp[option.key] = option.value;
        });
        options = temp;
        console.log(options);
        this.setState({ options });
      } else {
        Message.error(message);
      }
      this.setState({ loading: false });
    } catch (e) {
      Message.error(e.message);
    }
  };

  updateOption = (key, value) => {
    let options = this.state.options;
    options[key] = value;
    this.setState({ options });
  };

  submit = async () => {
    let options = this.state.options;
    try {
      const res = await axios.put(`/api/option/`, options);
      const { status, message } = res.data;
      if (status) {
        Message.success('Setting updated.');
      } else {
        Message.error(message);
      }
      this.setState({ loading: false });
    } catch (e) {
      Message.error(e.message);
    } finally {
      this.setState({ submitLoading: false });
    }
  };

  render() {
    return (
      <div className={'content-area'}>
        <h1>Settings</h1>
        <div style={{ background: '#fff', padding: 16 }}>
          <Tabs tabPosition={'left'}>
            {tabs.map((tab) => {
              tab.settings.sort((a, b) => {
                if (a.key < b.key) {
                  return -1;
                }
                if (a.key > b.key) {
                  return 1;
                }
                return 0;
              });
              return (
                <TabPane tab={tab.label} key={tab.label}>
                  <Form layout={'vertical'}>
                    {tab.settings.map((setting) => {
                      setting.label = setting.key
                        .replaceAll('_', ' ')
                        .toUpperCase();
                      return (
                        <Form.Item
                          label={setting.label ? setting.label : setting.key}
                        >
                          {setting.isBlock ? (
                            <Input.TextArea
                              placeholder={setting.description}
                              value={this.state.options[setting.key]}
                              onChange={(e) => {
                                this.updateOption(setting.key, e.target.value);
                              }}
                              rows={10}
                            />
                          ) : (
                            <Input
                              placeholder={setting.description}
                              value={this.state.options[setting.key]}
                              onChange={(e) => {
                                this.updateOption(setting.key, e.target.value);
                              }}
                            />
                          )}
                        </Form.Item>
                      );
                    })}
                    <Button type="primary" onClick={() => this.submit()}>
                      Save
                    </Button>
                  </Form>
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Settings);
