import axios from 'axios';
import {encode} from 'base-64';

export const login = async (username, password) => {
  const credentials = `${username}:${password}`;
  const encodedCredentials = encode(credentials);
  const authHeader = `maxauth ${encodedCredentials}`;

  try {
    const response = await axios.post(
      'http://training.smartech-tn.com:9219/maximo/oslc/login',
      {},
      {
        headers: {
          Authorization: authHeader,
        },
        params: {
          _lid: username,
          _lpwd: password,
        },
        timeout: 1000,
      },
    );
    if (response.status === 200) {
      return {success: true, data: response.data};
    }
  } catch (error) {
    return {success: false, error: error};
  }
};

export const getWoDetail = async () => {
  try {
    const response = await axios.get(
      'http://training.smartech-tn.com:9219/maximo/oslc/os/mxwodetail?oslc.select=*&oslc.where=status="wappr" and siteid="bedford"&_lid=maxadmin&_lpwd=maxadmin123&lean=1',
    );

    const data = response.data.member;
    return data;
  } catch (error) {
    return error;
  }
};
