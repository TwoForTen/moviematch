import { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import { AxiosRequestConfig } from 'axios';

interface FetchData {
  loading: boolean;
  data: any[];
  error: string;
}

const useFetchData = (config: AxiosRequestConfig): FetchData => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {}, []);

  return {
    loading,
    data,
    error,
  };
};

export default useFetchData;
