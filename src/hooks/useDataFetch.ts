import { useEffect, useState } from 'react';
import axios from 'axios';

interface FetchData {
  loading: boolean;
  response: any;
}

const useDataFetch = (key: string, fetcher: Promise<any>): FetchData => {
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<any>({ results: [] });

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
  }, [key]);

  return {
    loading,
    response,
  };
};

export default useDataFetch;
