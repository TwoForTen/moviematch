import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

interface FetchData {
  loading: boolean;
  response: any;
}

const useFetchData = (config: AxiosRequestConfig): FetchData => {
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<any>({ results: [] });

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
      })
      .catch(() => {});

    return () => {
      source.cancel();
    };
  }, [config.url]);

  return {
    loading,
    response,
  };
};

export default useFetchData;
