import React, { Component } from 'react';
import {
  message as Message,
  Button,
  Space,
  Select,
  Switch,
  Input,
  InputNumber,
  Popconfirm,
  Layout,
} from 'antd';

import AceEditor from 'react-ace';
import { connect } from 'react-redux';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/snippets/markdown';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/snippets/java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/snippets/python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/snippets/c_cpp';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/snippets/html';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/snippets/sh';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/snippets/typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/snippets/css';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/snippets/sql';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/snippets/golang';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/snippets/csharp';

import axios from 'axios';

const modes = [
  'markdown',
  'html',
  'java',
  'python',
  'c_cpp',
  'javascript',
  'sh',
  'typescript',
  'css',
  'sql',
  'golang',
  'csharp',
];

const { Sider, Content } = Layout;

let languages = [];
modes.forEach((lang) => {
  languages.push({ key: lang, text: lang, value: lang });
});

const editorThemes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal',
];

editorThemes.forEach((theme) =>
  require(`ace-builds/src-noconflict/theme-${theme}`)
);

let themes = [];
editorThemes.forEach((theme) => {
  themes.push({ key: theme, text: theme, value: theme });
});

export const PAGE_OPTIONS = [
  { key: 'grey', label: 'ALL Types', value: -1 },
  { key: 'volcano', label: 'Article', value: 0 },
  { key: 'geekblue', label: 'Code', value: 1 },
  { key: 'orange', label: 'Bulletin', value: 2 },
  { key: 'olive', label: 'Discuss', value: 3 },
  { key: 'green', label: 'Links', value: 4 },
  { key: 'pink', label: 'Raw', value: 5 },
  { key: 'gold', label: 'Media', value: 6 },
  { key: 'violet', label: 'Timeline', value: 7 },
];

const PAGE_TYPE = {
  ARTICLE: 0,
  CODE: 1,
  BULLETIN: 2,
  DISCUSS: 3,
  LINKS: 4,
  RAW: 5,
  MEDIA: 6,
};

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      theme: 'tomorrow',
      language: 'markdown',
      pasteWithFormatting: false,
      fontSize: 18,
      // fontSize: this.loadEditorFontSize(),
      saveInterval: 60,
      isNewPage: this.props.match.path === '/editor',
      originPage: undefined,
      page: {
        id: this.props.match.params.id,
        type: PAGE_TYPE.ARTICLE,
        link: '',
        pageStatus: 1,
        commentStatus: 1,
        title: '',
        content: '---\ntitle: \ndescription: \ntags: \n- Others\n---\n',
        tag: '',
        password: '',
        description: '',
      },
      showDrawer: false,
    };
    this.onChange = this.onChange.bind(this);
    // setInterval(this.onSubmit, this.state.saveInterval);
    window.showCloseHint = false;
    window.onbeforeunload = (e) => {
      if (window.showCloseHint) {
        return 'Unsaved changes detected.';
      }
    };
  }

  static getDerivedStateFromProps({ status }) {
    return { status };
  }

  async componentDidMount() {
    let editorContent = localStorage.getItem('editorContent');
    if (editorContent !== null && editorContent !== '') {
      if (this.state.isNewPage) {
        let page = { ...this.state.page };
        page.content = editorContent;
        this.setState({ page });
      } else {
        this.setState({ showRestoreConfirm: true });
      }
    }
    if (this.state.status === 0) {
      Message.error('Access denied.');
      this.props.history.push('/login');
      return;
    }
    this.setState({ originPage: this.state.page });
    this.loadEditorConfig();
    if (!this.state.isNewPage) {
      await this.fetchData();
      this.adjustEditorLanguage(this.state.page.type);
    }

    // TODO: Register event, not working
    // document.addEventListener('keydown', (e) => {
    //   console.log('fuck ', document.isKeyDownEventRegistered);
    //   if (!document.isKeyDownEventRegistered) {
    //     document.isKeyDownEventRegistered = true;
    //     if (e.ctrlKey && e.key === 's') {
    //       e.preventDefault();
    //       this.onSubmit();
    //     }
    //   }
    // });
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(`/api/page/${this.props.match.params.id}`);
      const { status, message, page } = res.data;
      if (status) {
        this.setState({ originPage: page, page });
      } else {
        Message.error(message);
      }
      this.setState({ loading: false });
    } catch (e) {
      Message.error(e.message);
    }
  };

  loadEditorFontSize() {
    let fontSize = localStorage.getItem('fontSize');
    fontSize = parseInt(fontSize);
    if (!fontSize) {
      fontSize = 18;
    }
    return fontSize;
  }

  loadEditorConfig() {
    let theme = localStorage.getItem('theme');
    if (theme === null) {
      theme = this.state.theme;
    }
    let fontSize = this.loadEditorFontSize();
    let saveInterval = localStorage.getItem('saveInterval');
    if (saveInterval == null) {
      saveInterval = this.state.saveInterval;
    }
    this.setState({
      theme,
      fontSize: parseInt(fontSize),
      saveInterval: parseInt(saveInterval),
    });
  }

  saveEditorConfig() {
    localStorage.setItem('theme', this.state.theme);
    localStorage.setItem('fontSize', this.state.fontSize);
    localStorage.setItem('saveInterval', this.state.saveInterval);
  }

  onChange(newValue) {
    window.showCloseHint = true;
    let page = { ...this.state.page };
    page.content = newValue;
    localStorage.setItem('editorContent', page.content);
    let noUserInputContent = false;
    this.setState({ page, noUserInputContent });
  }

  onPaste = (e) => {
    const clipboard = e.clipboardData;
    e.text = this.state.pasteWithFormatting
      ? clipboard.getData('text/html')
      : clipboard.getData('text/plain');
    e.preventDefault();
  };

  onEditorBlur = () => {
    let page = { ...this.state.page };
    let content = page.content;
    let title = '';
    let tag = '';
    let description = '';
    let hasGetTitle = false;
    let readyToGetTags = false;
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; ++i) {
      let line = lines[i];
      if (line.startsWith('description')) {
        description = line.substring(12).trim();
        continue;
      }
      if (!hasGetTitle && line.startsWith('title')) {
        title = line.substring(6).trim();
        hasGetTitle = true;
        continue;
      }
      if (!hasGetTitle) continue;
      if (!line.startsWith('tag') && !readyToGetTags) continue;
      if (!readyToGetTags) {
        readyToGetTags = true;
        continue;
      }

      if (line.startsWith('-') && !line.trim().endsWith('-')) {
        tag += ` ${line.trim().substring(1).trim()}`;
      } else {
        break;
      }
    }
    page.tag = tag.trim();
    page.title = title.trim();
    page.description = description;
    if (page.link === '') page.link = this.getValidLink(page.title);
    this.setState({ page });
  };

  onInputChange = (e) => {
    const { name, value } = e.target;
    let page = { ...this.state.page };
    if (name === 'link') {
      page[name] = this.getValidLink(value);
    } else {
      page[name] = value;
    }
    this.setState({ page });
  };

  onThemeChange = (e, { value }) => {
    this.setState({ theme: value }, () => {
      this.saveEditorConfig();
    });
  };

  onFontSizeChange = (value) => {
    this.setState({ fontSize: value }, () => {
      this.saveEditorConfig();
    });
  };

  onTypeChange = (e, { value }) => {
    let page = { ...this.state.page };
    page.type = value;
    this.setState({ page }, () => {
      this.adjustEditorLanguage(value);
    });
  };

  adjustEditorLanguage(pageType) {
    let language = this.state.language;
    switch (pageType) {
      case PAGE_TYPE.ARTICLE:
        language = 'markdown';
        break;
      case PAGE_TYPE.RAW:
        language = 'html';
        break;
      default:
        break;
    }
    this.languageChangeHelper(language);
  }

  onLanguageChange = (e, { value }) => {
    this.languageChangeHelper(value);
  };

  languageChangeHelper = (value) => {
    this.setState({ language: value });
    if (this.state.noUserInputContent && this.state.isNewPage) {
      let page = { ...this.state.page };
      let content = '---\ntitle: \ndescription: \ntags: \n- Others\n---\n';
      if (
        [
          'java',
          'c_cpp',
          'javascript',
          'typescript',
          'css',
          'csharp',
          'golang',
          'sql',
        ].includes(value)
      ) {
        content = '/*\ntitle: \ndescription: \ntags: \n- Others\n*/\n';
      } else if (['html', 'ejs'].includes(value)) {
        content = '<!--\ntitle: \ndescription: \ntags: \n- Others\n\n-->\n';
      } else if (['python'].includes(value)) {
        content = '"""\ntitle: \ndescription: \ntags: \n- Others\n"""\n';
      } else if (['ruby'].includes(value)) {
        content = '=begin\ntitle: \ndescription: \ntags: \n- Others\n=end\n';
      }
      page.content = content;
      this.setState({ page });
    }
  };

  onCommentStatusChange = () => {
    let page = { ...this.state.page };
    page.commentStatus = page.commentStatus === 0 ? 1 : 0;
    this.setState({ page });
  };

  onPublishStatusChange = () => {
    let page = { ...this.state.page };
    page.pageStatus = page.pageStatus === 0 ? 1 : 0;
    this.setState({ page });
  };

  onStayOnTopStatusChange = () => {
    let page = { ...this.state.page };
    page.pageStatus = page.pageStatus === 2 ? 1 : 2;
    this.setState({ page });
  };

  onPasteWithFormattingChange = () => {
    let pasteWithFormatting = !this.state.pasteWithFormatting;
    this.setState({ pasteWithFormatting });
    if (this.state.noUserInputContent) {
      let page = { ...this.state.page };
      page.type = PAGE_TYPE.RAW;
      this.setState({ page }, () => {
        this.adjustEditorLanguage(page.type);
      });
    }
  };

  onSubmit = (e) => {
    window.showCloseHint = false;
    this.onEditorBlur();
    if (this.state.page.link === '') {
      let page = { ...this.state.page };
      page.link = this.getValidLink();
      if (!page.title) {
        page.title = 'No title';
      }
      this.setState({ page }, () => {
        this.state.isNewPage ? this.postNewPage() : this.updatePage();
      });
    } else {
      this.state.isNewPage ? this.postNewPage() : this.updatePage();
    }
  };

  getDate(format) {
    if (format === undefined) format = 'yyyy-MM-dd hh-mm-ss';
    const date = new Date();
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      S: date.getMilliseconds(),
    };

    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    }

    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        );
      }
    }
    return format;
  }

  getValidLink(origin) {
    if (origin === undefined) {
      origin = this.getDate();
    }
    return origin
      .trim()
      .toLowerCase()
      .replace(/[\s#%+/&=?`]+/g, '-');
  }

  reset = (e) => {
    let page = this.state.originPage;
    this.setState({ page });
  };

  deletePage = () => {
    this.setState({ deleteConfirm: false });
    const that = this;
    let id = this.props.match.params.id;
    if (!id) {
      id = this.state.page.id;
    }
    axios.delete(`/api/page/${id}`).then(async function (res) {
      const { status, message } = res.data;
      if (status) {
        Message.success('Your page has been deleted.');
        that.props.history.push('/editor');
      } else {
        Message.error(message);
      }
    });
  };

  cancelDelete = () => {
    this.setState({ deleteConfirm: false });
  };

  clearEditorStorage() {
    localStorage.setItem('editorContent', '');
  }

  updatePage() {
    const that = this;
    axios.put('/api/page', this.state.page).then(async function (res) {
      const { status, message } = res.data;
      if (status) {
        Message.success('Your page has been updated.');
        that.clearEditorStorage();
      } else {
        Message.error(message);
      }
    });
  }

  postNewPage() {
    const that = this;
    axios.post('/api/page', this.state.page).then(async function (res) {
      const { status, message, id } = res.data;
      if (status) {
        let page = { ...that.state.page };
        page.id = id;
        that.setState({ isNewPage: false, page });
        Message.success('Your page has been submitted.');
        that.clearEditorStorage();
      } else {
        Message.error(message);
      }
    });
  }

  renderEditor() {
    return (
      <>
        <AceEditor
          style={{ width: '100%', height: '100%' }}
          mode={this.state.language}
          theme={this.state.theme}
          name={'editor'}
          onChange={this.onChange}
          value={this.state.page.content}
          fontSize={this.state.fontSize}
          onBlur={this.onEditorBlur}
          setOptions={{ useWorker: false }}
        />
      </>
    );
  }

  renderPanel() {
    return (
      <div>
        <Space direction="vertical">
          Link
          <Input
            placeholder="Article link"
            name="link"
            value={this.state.page.link}
            onChange={this.onInputChange}
          />
          Password
          <Input
            placeholder="Password"
            name="password"
            value={this.state.page.password}
            onChange={this.onInputChange}
          />
          Page Type
          <Select
            style={{ width: '100%' }}
            label="Page Type"
            name="type"
            options={PAGE_OPTIONS}
            value={this.state.page.type}
            placeholder="Type"
            onChange={this.onTypeChange}
          />
          <br />
          <Space>
            <Switch
              name="commentStatus"
              label="Allow comment"
              checked={this.state.page.commentStatus === 1}
              onChange={this.onCommentStatusChange}
            />{' '}
            Allow comment
          </Space>
          <Space>
            <Switch
              name="pageStatus"
              label="Publish page"
              checked={this.state.page.pageStatus !== 0}
              onChange={this.onPublishStatusChange}
            />{' '}
            Publish page
          </Space>
          <Space>
            <Switch
              name="pageStatus"
              label="Stay on top"
              checked={this.state.page.pageStatus === 2}
              onChange={this.onStayOnTopStatusChange}
            />{' '}
            Stay on top
          </Space>
          {/*<Space>*/}
          {/*  <Switch*/}
          {/*    name="paste_with_formatting"*/}
          {/*    label="Paste with formatting"*/}
          {/*    checked={this.state.pasteWithFormatting}*/}
          {/*    onChange={this.onPasteWithFormattingChange}*/}
          {/*  />{' '}*/}
          {/*  Paste with formatting*/}
          {/*</Space>*/}
          <br />
          <Space>
            <Popconfirm
              title={'Are your sure?'}
              onConfirm={() => {
                this.deletePage();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                size={'small'}
                disabled={this.state.isNewPage}
              >
                Delete
              </Button>
            </Popconfirm>
            <Popconfirm
              title={'Are your sure?'}
              onConfirm={() => {
                this.reset();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button size={'small'}>Reset</Button>
            </Popconfirm>

            <Button type="primary" size={'small'} onClick={this.onSubmit}>
              Submit
            </Button>
          </Space>
          <br />
          Code Language
          <Select
            style={{ width: '100%' }}
            label="Code Language"
            name="language"
            options={languages}
            value={this.state.language}
            placeholder="Language"
            onChange={this.onLanguageChange}
          />
          Editor Theme
          <Select
            style={{ width: '100%' }}
            label="Editor Theme"
            name="theme"
            options={themes}
            value={this.state.theme}
            placeholder="Theme"
            onChange={this.onThemeChange}
          />
          Font Size
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Font size"
            name="font_size"
            type="number"
            min="1"
            value={this.state.fontSize}
            onChange={this.onFontSizeChange}
          />
        </Space>
      </div>
    );
  }

  render() {
    return (
      <Layout
        style={{
          height: '100%',
          borderTop: 'solid 1px #bfbfbf',
          backgroundColor: '#fff',
        }}
      >
        <Sider
          style={{
            backgroundColor: '#fff',
            padding: '16px',
            marginRight: '10px',
          }}
        >
          {this.renderPanel()}
        </Sider>
        <Layout>
          <Content>{this.renderEditor()}</Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Editor);
