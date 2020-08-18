import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { systemPackagesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changeSystemPackagesParams, fetchApplicableSystemPackages, selectSystemPackagesRow } from '../../store/Actions/Actions';
import { fetchApplicablePackagesApi } from '../../Utilities/api';
import { createSystemPackagesRows } from '../../Utilities/DataMappers';
import { createSortBy } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useSortColumn } from '../../Utilities/Hooks';

const SystemPackages = () => {
    const dispatch = useDispatch();
    const entity = useSelector(({ entityDetails }) => entityDetails.entity);
    const packages = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.rows
    );
    const queryParams = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.queryParams
    );
    const selectedRows = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.selectedRows
    );
    const metadata = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.metadata
    );
    const status = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.status
    );/*
    const error = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.error
    );*/
    const rows = React.useMemo(
        () =>
            createSystemPackagesRows(packages, selectedRows),
        [packages,  selectedRows]
    );

    React.useEffect(()=> {
        dispatch(fetchApplicableSystemPackages({ id: entity.id, ...queryParams }));
    }, [queryParams]);

    const onSelect = React.useCallback((event, selected, rowId) => {
        const toSelect = [];
        switch (event) {
            case 'none': {
                Object.keys(selectedRows).forEach(id=>{
                    toSelect.push(
                        {
                            id,
                            selected: false
                        }
                    );
                });
                dispatch(
                    selectSystemPackagesRow(toSelect)
                );
                break;
            }

            case 'page': {
                packages.forEach(({ id })=>{
                    toSelect.push(
                        {
                            id,
                            selected: true
                        }
                    );});
                dispatch(
                    selectSystemPackagesRow(toSelect)
                );
                break;
            }

            case 'all': {
                const fetchCallback = (res) => {
                    res.data.forEach((pkg)=>{
                        toSelect.push(
                            {
                                id: pkg.name,
                                selected: true
                            }
                        );});
                    dispatch(
                        selectSystemPackagesRow(toSelect)
                    );
                };

                fetchApplicablePackagesApi({ id: entity.id, limit: 999999 }).then(fetchCallback);

                break;
            }

            default: {
                toSelect.push({
                    id: packages[rowId].name,
                    selected
                });
                dispatch(
                    selectSystemPackagesRow(toSelect)
                );
            }}

    }
    );

    function apply(params) {
        dispatch(changeSystemPackagesParams({ id: entity.id, ...params }));
    }

    const onSort = useSortColumn(systemPackagesColumns, apply, 1);
    const sortBy = React.useMemo(
        () => createSortBy(systemPackagesColumns, metadata.sort, 1),
        [metadata.sort]
    );
    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    return (
        <React.Fragment>
            <TableView
                columns={systemPackagesColumns}
                store={{ rows, metadata, status, queryParams }}
                onSelect={onSelect}
                selectedRows={selectedRows}
                onSort={onSort}
                sortBy={sortBy}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                apply={apply}
                filterConfig={{
                    items: [
                        searchFilter(apply, queryParams.search, 'Search packages')
                    ]
                }}
            />
        </React.Fragment>
    );
};

export default SystemPackages;
