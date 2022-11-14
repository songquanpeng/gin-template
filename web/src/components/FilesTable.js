import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Header,
  Icon,
  Pagination,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import { API, showError, showSuccess } from '../helpers';
import { useDropzone } from 'react-dropzone';

const itemsPerPage = 10;

const FilesTable = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    const res = await API.get('/api/file');
    const { success, message, data } = res.data;
    if (success) {
      setFiles(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const onPaginationChange = (e, { activePage }) => {
    setActivePage(activePage);
  };

  useEffect(() => {
    loadFiles()
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, []);

  const downloadFile = (link, filename) => {
    let linkElement = document.createElement('a');
    linkElement.download = filename;
    linkElement.href = '/upload/' + link;
    linkElement.click();
  };

  const deleteFile = (id) => {
    (async () => {
      const res = await API.delete(`/api/file/${id}`);
      const { success, message } = res.data;
      if (success) {
        showSuccess('文件已删除！');
        await loadFiles();
      } else {
        showError(message);
      }
    })();
  };

  const searchFiles = async () => {
    setSearching(true);
    const res = await API.get(`/api/file/search?keyword=${searchKeyword}`);
    const { success, message, data } = res.data;
    if (success) {
      setFiles(data);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (e, { name, value }) => {
    setSearchKeyword(value);
  };

  const sortFile = (key) => {
    if (files.length === 0) return;
    setLoading(true);
    let sortedUsers = [...files];
    sortedUsers.sort((a, b) => {
      return ('' + a[key]).localeCompare(b[key]);
    });
    if (sortedUsers[0].id === files[0].id) {
      sortedUsers.reverse();
    }
    setFiles(sortedUsers);
    setLoading(false);
  };

  const uploadFiles = async () => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    let formData = new FormData();
    for (let i = 0; i < acceptedFiles.length; i++) {
      formData.append('file', acceptedFiles[i]);
    }
    const res = await API.post(`/api/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess(`${acceptedFiles.length} 个文件上传成功！`);
    } else {
      showError(message);
    }
    setUploading(false);
    setSearchKeyword('');
    loadFiles().then();
  };

  useEffect(() => {
    uploadFiles().then();
  }, [acceptedFiles]);

  return (
    <>
      <Segment
        placeholder
        {...getRootProps({ className: 'dropzone' })}
        loading={uploading || loading}
      >
        <Header icon>
          <Icon name='file outline' />
          拖拽上传或点击上传
          <input {...getInputProps()} />
        </Header>
      </Segment>
      <Form onSubmit={searchFiles}>
        <Form.Input
          icon='search'
          fluid
          iconPosition='left'
          placeholder='搜索文件的名称，上传者以及描述信息 ...'
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
      </Form>

      <Table basic>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortFile('filename');
              }}
            >
              文件名
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortFile('uploader_id');
              }}
            >
              上传者
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortFile('email');
              }}
            >
              上传时间
            </Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {files
            .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
            .map((file, idx) => {
              return (
                <Table.Row key={file.id}>
                  <Table.Cell>{file.filename}</Table.Cell>
                  <Popup
                    content={'上传者 ID：' + file.uploader_id}
                    trigger={<Table.Cell>{file.uploader}</Table.Cell>}
                  />
                  <Table.Cell>{file.upload_time}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Button
                        size={'small'}
                        positive
                        onClick={() => {
                          downloadFile(file.link, file.filename);
                        }}
                      >
                        下载
                      </Button>
                      <Button
                        size={'small'}
                        negative
                        onClick={() => {
                          deleteFile(file.id);
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='6'>
              <Pagination
                floated='right'
                activePage={activePage}
                onPageChange={onPaginationChange}
                size='small'
                siblingRange={1}
                totalPages={Math.ceil(files.length / itemsPerPage)}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default FilesTable;
