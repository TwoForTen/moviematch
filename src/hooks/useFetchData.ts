import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

interface FetchData {
  loading: boolean;
  response: any;
  error: string;
}

const useFetchData = (config: AxiosRequestConfig): FetchData => {
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<any>();
  const [error, setError] = useState<string>('');

  const { url, method, params, data } = config;

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axiosInstance({
      url,
      method,
      params,
      data,
      cancelToken: source.token,
    })
      .then(({ data }) => {
        setResponse(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error: ${err.response.data}`);
        setLoading(false);
      });

    return () => source.cancel('');
  }, [config.url]);

  return {
    loading,
    response,
    error,
  };
};

export default useFetchData;
