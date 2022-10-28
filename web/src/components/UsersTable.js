import React, { useEffect, useState } from 'react';
import { Button, Label, Pagination, Table } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastConstants } from '../constants';
import { Link } from 'react-router-dom';

const itemsPerPage = 10;

function renderRole(role) {
  switch (role) {
    case 1:
      return <Label>Common User</Label>;
    case 10:
      return <Label color='yellow'>Administrator</Label>;
    case 100:
      return <Label color='orange'>Root User</Label>;
    default:
      return <Label color='red'>Unknown Role</Label>;
  }
}

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);

  const loadUsers = async () => {
    const res = await axios.get('/api/user');
    const { success, message, data } = res.data;
    if (success) {
      setUsers(data);
    } else {
      toast.error('Error: ' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
    }
    setLoading(false);
  };

  const onPaginationChange = (e, { activePage }) => {
    setActivePage(activePage);
  };

  useEffect(() => {
    loadUsers().then();
  }, []);

  const manageUser = (username, action) => {
    (async () => {
      const res = await axios.post('/api/user/manage', {
        username, action
      });
      const { success, message } = res.data;
      if (success) {
        await loadUsers();
      } else {
        toast.error('Error: ' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
      }
    })();
  };

  const renderStatus = (status, id) => {
    switch (status) {
      case 1:
        return 'Active';
      case 2:
        return 'Banned';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <>
      <Table basic loading={loading}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Display Name</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            users.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage).map((user, idx) => {
              return (
                <Table.Row id={user.id}>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.display_name}</Table.Cell>
                  <Table.Cell>{renderRole(user.role)}</Table.Cell>
                  <Table.Cell>{renderStatus(user.status, user.id)}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Button size={'small'} positive onClick={() => {
                        manageUser(user.username, 'promote');
                      }}>Promote</Button>
                      <Button size={'small'} color={'yellow'} onClick={() => {
                        manageUser(user.username, 'demote');
                      }}>Demote</Button>
                      <Button size={'small'} negative onClick={() => {
                        manageUser(user.username, 'delete');
                      }}>Delete</Button>
                      <Button size={'small'} onClick={() => {
                        manageUser(user.username, user.status === 1 ? 'disable' : 'enable');
                      }}>{user.status === 1 ? 'Disable' : 'Enable'}</Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })
          }
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='5'>
              <Button size='small' as={Link} to='/user/add'>Add User</Button>
              <Pagination
                floated='right'
                activePage={activePage}
                onPageChange={onPaginationChange}
                size='small'
                siblingRange={1}
                totalPages={Math.ceil(users.length / itemsPerPage)}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default UsersTable;