import { toast } from 'react-toastify';
import { toastConstants } from '../constants';

export function isAdmin() {
  let user = localStorage.getItem('user');
  if (!user) return false;
  user = JSON.parse(user);
  return user.role >= 10;
}

export function isRoot() {
  let user = localStorage.getItem('user');
  if (!user) return false;
  user = JSON.parse(user);
  return user.role >= 100;
}

export async function copy(text) {
  let okay = true;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    okay = false;
    console.error(e);
  }
  return okay;
}

export function showError(message) {
  toast.error('错误：' + message, { autoClose: toastConstants.ERROR_TIMEOUT });
  console.error(message);
}

export function showSuccess(message) {
  toast.success(message, { autoClose: toastConstants.SUCCESS_TIMEOUT });
}