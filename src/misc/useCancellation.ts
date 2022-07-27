import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { api } from '../api';
import { AxiosResponse } from 'axios';

export interface ICancellationResponse {
  status: number;
  cancellation?: ICancellation;
}

export interface ICancellation {
  partnerId: string;
  createdAt: Date;
  updatedAt: Date;
  finalDeletion: Date;
  downloadRequested: Date;
  movedToLongtermArchive: Date;
  csvCreated: Date;
  downloadLinkRequested: Date;
  dataDeleted: Date;
  bucketObjectId: string;
}

const useCancallation = (onError?: (error: any) => void) => {
  const { keycloak, initialized } = useKeycloak();
  const [result, setResult] = React.useState<ICancellationResponse>();

  const header = {
    Authorization: initialized ? `Bearer ${keycloak.token}` : '',
    'Content-Type': 'application/json',
  };

  const getCancellation = () => {
    const uri = '/api/cancellation/';

    api
      .get(uri, { headers: header })
      .then((response) => {
        setResult({
          cancellation: response.data,
          status: response.status,
        });
      })
      .catch((error) => {
        setResult({ status: error.response.status });
        if (onError) {
          onError(error);
        }
      });
  };

  const requestDownload = (
    onSuccess?: (response: AxiosResponse<any>) => void
  ) => {
    const uri = '/api/cancellation/requestDownload';

    api
      .post(uri, undefined, { headers: header })
      .then(onSuccess)
      .catch(onError);
  };

  const getDownloadLink = (onSuccess?: (link: string) => void) => {
    const uri = '/api/cancellation/download';

    api
      .get(uri, { headers: header })
      .then((response) => {
        onSuccess && onSuccess(response.data);
      })
      .catch(onError);
  };

  return [result, getCancellation, requestDownload, getDownloadLink] as const;
};

export default useCancallation;
