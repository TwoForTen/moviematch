import { useEffect, useState } from 'react';
import axios from 'axios';
import { isArray } from 'lodash';

interface FetchData {
  loading: boolean;
  response: any;
}

const useDataFetch = (key: any, fetcher: Promise<any>): FetchData => {
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<any>({ results: [] });

  const dependencies = isArray(key) ? key : [key];

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    fetcher
      .then((data: any) => {
        setResponse(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      source.cancel();
    };
  }, [...dependencies]);

  return {
    loading,
    response,
  };
};

export default useDataFetch;
