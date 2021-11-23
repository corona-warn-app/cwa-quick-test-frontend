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

import React from 'react';
import { Image, Toast, ToastHeader } from 'react-bootstrap'

import '../../i18n';
import { useTranslation } from 'react-i18next';

import successIcon from '../../assets/images/icon_success.svg';


const NotificationToast = (props: any) => {

    const { t } = useTranslation();

    return (
        <div className='toast-container'>
            <Toast className='qt-notification'
                show={props.show}
                delay={3000}
                autohide
                onClose={() => props.setNotificationShow(false)}
            >
                <ToastHeader closeButton={false} className='qt-notification-header'>
                    <Image src={successIcon} className='mr-3 my-3' />
                    <p className='qt-notification-text my-auto mx-1'>
                        {t('translation:successfull-transferred')}
                    </p>
                </ToastHeader>
            </Toast>
        </div>
    )
}

export default NotificationToast;