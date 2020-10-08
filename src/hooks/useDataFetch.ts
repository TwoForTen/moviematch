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
    let isMounted: boolean = true;

    const fetchData = async () => {
      setLoading(true);
      await fetcher
        .then((data: any) => {
          setResponse(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchData();

    return () => {
      source.cancel();
      isMounted = false;
    };
  }, [...dependencies]);

  return {
    loading,
    response,
  };
};

export default useDataFetch;
