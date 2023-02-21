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

import InputGroupWithExtras from 'react-bootstrap/esm/InputGroup';

export interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roleCounter: boolean;
  roleLab: boolean;
  subGroup: string | null;
  password?: string;
}

export interface IDisplayUser extends IUser {
  displayGroup?: string | null;
  displayRole?: string | null;
}

export interface IGroup {
  name: string;
  id: string;
  path: string;
  children: IGroup[];
}

export interface IGroupNode {
  group: IGroup;
  parentGroup?: string;
  level: number;
}

export interface IGroupDetails {
  id?: string;
  // bsnr?: string,
  name: string;
  pocDetails: string;
  enablePcr: boolean;
  pocId: string;
  searchPortalConsent: boolean;
  website?: string;
  email?: string;
  openingHours?: string[];
  appointmentRequired?: boolean;
  parentGroup?: string;
}
