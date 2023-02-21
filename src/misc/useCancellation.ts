/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2023, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
