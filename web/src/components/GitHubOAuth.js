import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { showError } from '../helpers';
import { toast } from 'react-toastify';
import { toastConstants } from '../constants';
import { UserContext } from '../context/User';

const GitHubOAuth = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [userState, userDispatch] = useContext(UserContext);

  let navigate = useNavigate();

  const sendCode = async (code) => {
    const res = await axios.get(`/api/oauth/github?code=${code}`);
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
      toast.success('登录成功！', { autoClose: toastConstants.SUCCESS_TIMEOUT });
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    let code = searchParams.get('code');
    sendCode(code).then();
  }, []);


  return (
    <Segment style={{ minHeight: '300px' }}>
      <Dimmer active inverted>
        <Loader size='large'>Processing</Loader>
      </Dimmer>
    </Segment>
  );
};


export default GitHubOAuth;