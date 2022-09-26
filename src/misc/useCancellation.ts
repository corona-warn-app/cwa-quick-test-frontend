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
  cancellationDate: Date;
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

  const getHeader = () => {
    return {
      Authorization: initialized ? `Bearer ${keycloak.token}` : '',
      'Content-Type': 'application/json',
    };
  };

  const getCancellation = () => {
    const uri = '/api/cancellation/';

    api
      .get(uri, { headers: getHeader() })
      .then((response) => {
        // if (response.data.downloadRequested) {
        //   console.log(response.data.downloadRequested);

        //   response.data.downloadRequested = new Date(
        //     response.data.downloadRequested.getTime() - 60 * 60 * 24 * 2 * 1000
        //   );
        // }
        setResult({
          cancellation: response.data,
          status: response.status,
        });
      })
      .catch((error) => {
        setResult({ status: error.response.status });
        if (onError && error.response.status !== 404) {
          onError(error);
        }
      });
  };

  const requestDownload = (onSuccess?: (response: AxiosResponse<any>) => void) => {
    const uri = '/api/cancellation/requestDownload';

    api.post(uri, undefined, { headers: getHeader() }).then(onSuccess).catch(onError);
  };

  const getDownloadLink = (onSuccess?: (link: string) => void) => {
    const uri = '/api/cancellation/download';

    api
      .get(uri, { headers: getHeader() })
      .then((response) => {
        onSuccess && onSuccess(response.data);
      })
      .catch(onError);
  };

  return [result, getCancellation, requestDownload, getDownloadLink] as const;
};

export default useCancallation;
