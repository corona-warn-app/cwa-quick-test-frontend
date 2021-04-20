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
import { Button, Card, Col, ListGroup, ListGroupItem, Pagination, Row } from 'react-bootstrap'
import QrReader from 'react-qr-reader'
import Patient from '../misc/patient'

import '../i18n';
import { useTranslation } from 'react-i18next';

import useNavigation from '../misc/navigation';
import { getPatientFromScan } from '../misc/qr-code-value';
import CwaSpinner from './spinner/spinner.component';
import IQTArchiv from '../misc/qt-archiv';
import utils from '../misc/utils';

//const testFull = 'https://s.coronwarn.app?v=1#eyJmbiI6IkdvcmRvbiIsImxuIjoiR3J1bmQiLCJkb2IiOiIxOTkwLTAxLTAzIiwiZ3VpZCI6ImQ3ZWM2MDU4LWUyMzEtNGU4Yy1hNDFmLTViZjg1ZDdmZTI3MiIsInRpbWVzdGFtcCI6MTYxNzk3ODg4NDY4NX0=';

const PagedList = (props: any) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const displayItemCount = 12;

    const [data, setData] = React.useState<IQTArchiv[]>();
    const [dataToShow, setDataToShow] = React.useState<IQTArchiv[]>();
    const [pages, setPages] = React.useState(0);
    const [pageinationItems, setPageinationItems] = React.useState<JSX.Element[]>();
    const [curPage, setCurPage] = React.useState(1);
    const [isInit, setIsInit] = React.useState(false)

    React.useEffect(() => {


        setData(undefined);
        setDataToShow(undefined);
        setPages(0);
        props.onSelected('');

        if (props && props.data) {
            setData(props.data);
        }
    }, [props.data])

    React.useEffect(() => {
        console.log('dataChange');
        if (data && data.length > 0) {
            setPages(Math.ceil(data.length / displayItemCount));
        }
    }, [data])

    React.useEffect(() => {
        console.log('pagesChange');
        if (pages) {
            setCurPage(1);
        }
        else {
            setCurPage(0)
        }
    }, [pages])

    React.useEffect(() => {
        console.log('curPageChange');
        if (curPage && curPage > 0 && curPage <= pages && data) {

            // (1-1)*10=0; (3-1)*10=20
            const startIndex = (curPage - 1) * displayItemCount;
            // (1*10)-1=9; (3*10)-1=29
            const endIndex = (curPage === pages)
                ? data.length
                : (curPage * displayItemCount)

            setDataToShow(data.slice(startIndex, endIndex));


            // pagination
            const p: JSX.Element[] = [];
            let index = (curPage === 1)
                ? curPage
                : curPage - 1;

            let max = (curPage + 1 < pages)
                ? curPage + 1
                : curPage;

            let useBeginElipsis: boolean = (index > 2);
            let useEndElipsis: boolean = (max + 1 < pages);

            if (1 < index) {
                p.push(<Pagination.Item
                    key={1}
                    active={curPage === 1}
                    onClick={(evt: any) => handleClick(parseInt(evt.target.text))
                    }>
                    {1}
                </Pagination.Item>);
            }

            if (useBeginElipsis) {
                p.push(<Pagination.Ellipsis
                    key='eb' />);
            }

            for (index; index <= max; index++) {
                p.push(<Pagination.Item
                    key={index}
                    active={curPage === index}
                    onClick={(evt: any) => handleClick(parseInt(evt.target.text))
                    }>
                    {index}
                </Pagination.Item>);
            }

            if (useEndElipsis) {
                p.push(<Pagination.Ellipsis
                    key='ee' />);
            }

            if (pages > max) {
                p.push(<Pagination.Item
                    key={pages}
                    active={curPage === pages}
                    onClick={(evt: any) => handleClick(parseInt(evt.target.text))
                    }>
                    {pages}
                </Pagination.Item>);
            }

            setPageinationItems(p);
        }
        else {
            setDataToShow(undefined);
        }

    }, [curPage])

    React.useEffect(() => {
        if (navigation && data)
            setIsInit(true);
    }, [navigation, data])


    const handleListSelect = (evt: any) => {
        try {
            const hash = evt.target.dataset['rbEventKey'];

            if (hash) {
                props.onSelected(hash);
            }
        } catch (error) {

        }
    }

    const handleClick = (num: number) => {
        console.log(num);
        if (!isNaN(num)) {
            setCurPage(num);
        }
    }

    return (!dataToShow ? <CwaSpinner background='#eeeeee' /> :
        <>
            <ListGroup>
                {dataToShow.map((archiv, index) => (
                    <ListGroupItem
                        onClick={handleListSelect}
                        action
                        eventKey={archiv.hashedGuid}
                        key={archiv.hashedGuid}
                    >
                        {archiv.hashedGuid.substring(0, utils.shortHashLen)}
                    </ListGroupItem>
                ))}
                {pages > 1 && (<>
                    <hr />
                    <Pagination size='sm' className='mb-0 justify-content-center' >
                        <Pagination.Prev disabled={curPage === 1} onClick={() => handleClick(curPage - 1)} />

                        {pageinationItems}

                        <Pagination.Next disabled={curPage === pages} onClick={() => handleClick(curPage + 1)} />
                    </Pagination>
                </>)}
            </ListGroup>
        </>
    )
}

export default PagedList;