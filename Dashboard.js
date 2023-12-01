import { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';

const spinnerStyle = {
	width: '50px',
	height: '50px',
};

export const Dashboard = () => {
	const [ data, setData ] = useState([]);
	const [ selectedRows, setSelectedRows ] = useState([]);
	const [ globalFilterValue, setGlobalFilterValue ] = useState('');
	const [ filters, setFilters ] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		name: { value: null, matchMode: FilterMatchMode.CONTAINS },
		email: { value: null, matchMode: FilterMatchMode.CONTAINS },
		role: { value: null, matchMode: FilterMatchMode.CONTAINS }
	});

	const onRowEditComplete = (e) => {
		let _data = [...data];
		let { newData, index } = e;

		_data[index] = newData;
		setData(_data);
	};

	const textEditor = (options) => {
		return <InputText type={"text"} value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />
	};

	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = { ...filters };

		_filters['global'].value = value;

		setFilters(_filters);
		setGlobalFilterValue(value);
	};

	const deleteSelectedRows = () => {
		setData(data.filter((row) => !selectedRows.includes(row)));
		setSelectedRows([]);
	};

	const deleteOneButton = (row) => {
		return (
			<Button
				type="button"
				severity="danger"
				icon="pi pi-trash"
				style={{ marginLeft: '-100%' }}
				onClick={(e) => {
					setData(data.filter((curr) => curr !== row));
				}}
			/>
		);
	};

	const renderHeader = () => {
		return (
			<div className="flex justify-content-end">
				<InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by Keyword" style={{ padding: '8px' }} />
				<Button
					type="button"
					severity="danger"
					label="Delete Selected"
					icon="pi pi-trash"
					style={{ marginLeft: '20px' }}
					disabled={selectedRows.length === 0}
					onClick={deleteSelectedRows}
				/>
			</div>
		);
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
			const result = await response.json();

			setData(result);
		}

		fetchData();
	}, []);

	return (
		<div>
			{ !data && <ProgressSpinner style={spinnerStyle} strokeWidth={'8'} /> }

			{ data && (
					<DataTable
						header={ renderHeader() }
						globalFilterFields={[ 'name', 'email', 'role' ]}
						filters={ filters }
						value={ data }
						editMode={'row'}
						selectionMode={'checkbox'}
						selection={ selectedRows }
						selectionPageOnly
						onSelectionChange={(e) => setSelectedRows(e.value)}
						dataKey={'id'}
						onRowEditComplete={onRowEditComplete}
						tableStyle={{ minWidth: '50rem', maxWidth: '100vw' }}
						paginator
						paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
						currentPageReportTemplate={`Selected ${selectedRows.length} of ${data.length} rows`}
						rows={10}
						emptyMessage={"No such user found!"}
					>
						<Column selectionMode='multiple' headerStyle={{ width: '3rem' }} />
						<Column field='name' header='Name' editor={(options) => textEditor(options)} bodyStyle={{ paddingBottom: '8px' }} />
						<Column field='email' header='Email' editor={(options) => textEditor(options)} bodyStyle={{ paddingBottom: '8px' }} />
						<Column field='role' header='Role' editor={(options) => textEditor(options)} bodyStyle={{ paddingBottom: '8px' }} />
						<Column rowEditor header='Actions' bodyStyle={{ textAlign: 'left', paddingBottom: '8px' }} />
						<Column bodyStyle={{ textAlign: 'left', paddingBottom: '8px' }} body={(data, props) => deleteOneButton(data)} />
					</DataTable>
				)
			}
		</div>
	);
};