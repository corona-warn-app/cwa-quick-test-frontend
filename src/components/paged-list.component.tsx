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
import { Form, ListGroup, ListGroupItem, Pagination } from 'react-bootstrap'

import '../i18n';
import { useTranslation } from 'react-i18next';

import CwaSpinner from './spinner/spinner.component';
import IQTArchiv from '../misc/qt-archiv';
import utils from '../misc/utils';

const PagedList = (props: any) => {

    const displayItemCount = 12;
    const { t } = useTranslation();

    const [data, setData] = React.useState<IQTArchiv[]>();
    const [dataToFilter, setDataToFilter] = React.useState<IQTArchiv[]>([]);
    const [dataToShow, setDataToShow] = React.useState<IQTArchiv[]>([]);
    const [pages, setPages] = React.useState(0);
    const [pageinationItems, setPageinationItems] = React.useState<JSX.Element[]>();
    const [curPage, setCurPage] = React.useState(1);
    const [filter, setFilter] = React.useState<string>('');

    React.useEffect(() => {
        setData(undefined);
        setDataToShow([]);
        setPages(0);
        setFilter('');
        props.onSelected('');

        if (props && props.data) {
            setData(props.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data])

    React.useEffect(() => {
        if (data) {
            setDataToFilter(data);
        }
    }, [data])

    React.useEffect(() => {
        if (pages) {
            setCurPage(1);
        }
        else {
            setCurPage(0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages])

    React.useEffect(() => {
        let _pages = 0;

        if (dataToFilter) {
            _pages = Math.ceil(dataToFilter.length / displayItemCount);
            setPages(_pages);
        }

        if (curPage && curPage > 0 && curPage <= _pages && dataToFilter) {

            const startIndex = (curPage - 1) * displayItemCount;
            const endIndex = (curPage === _pages)
                ? dataToFilter.length
                : (curPage * displayItemCount)

            setDataToShow(dataToFilter.slice(startIndex, endIndex));


            // pagination
            const p: JSX.Element[] = [];
            let index = (curPage === 1)
                ? curPage
                : curPage - 1;

            let max = (curPage + 1 < _pages)
                ? curPage + 1
                : curPage;

            let useBeginElipsis: boolean = (index > 2);
            let useEndElipsis: boolean = (max + 1 < _pages);

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

            if (_pages > max) {
                p.push(<Pagination.Item
                    key={_pages}
                    active={curPage === _pages}
                    onClick={(evt: any) => handleClick(parseInt(evt.target.text))
                    }>
                    {_pages}
                </Pagination.Item>);
            }

            setPageinationItems(p);
        }
        else {
            setDataToShow([]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curPage, dataToFilter])

    React.useEffect(() => {

        let filterData = data;
        
        if (filter && data) {
            filterData = data.filter((item) => item.hashedGuid.startsWith(filter));
        }

        if (!filterData) {
            filterData = [];
        }

        setDataToFilter(filterData);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

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
        if (!isNaN(num)) {
            setCurPage(num);
        }
    }

    return (dataToShow === undefined
        ? <CwaSpinner background='#eeeeee' />
        :
        <>
            <Form.Control
                className='qt-input'
                value={filter}
                onChange={(evt) => setFilter(evt.currentTarget.value)}
                placeholder={t('translation:search')}
                type='text'
                maxLength={utils.shortHashLen}
            />
            { dataToShow.length === 0 ? <></> : <>
                <hr />
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
            </>}
            <hr />
        </>

    )
}

export default PagedList;