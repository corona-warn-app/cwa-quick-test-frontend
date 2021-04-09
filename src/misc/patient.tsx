/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2021, T-Systems International GmbH
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

import {Sex} from './enum';

export default interface Patient {
    firstName: string;
    name: string;
    dateOfBirth: Date;
    processingConsens?: boolean;
    uuId?: string;
    includePersData?: boolean;
    sex?:Sex;
    zip?:string;
    city?:string;
    street?:string;
    houseNumber?:string;
    phoneNumber?:string;
    emailAddress?:string;
    testId?:string;
}