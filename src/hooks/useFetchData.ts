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
  const [response, setResponse] = useState<any>({ results: [] });
  const [error, setError] = useState<string>('');

  const { url, params, data } = config;

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axiosInstance({
      url,
      method: 'get',
      params,
      data,
      cancelToken: source.token,
    })
      .then(({ data }) => {
        setResponse(data);
        setLoading(false);
        source.cancel('');
      })
      .catch((err) => {
        setError(`Error`);
        setLoading(false);
        source.cancel('');
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
