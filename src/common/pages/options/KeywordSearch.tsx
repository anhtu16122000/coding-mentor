import { Form } from 'antd'
import React, { useRef, useState } from 'react'
import ModalKeywordSearch from '~/common/components/KeywordSearch/ModalKeywordSearch'
import ModalDeleteKeywordSearch from '~/common/components/KeywordSearch/ModalDeleteKeywordSearch'
import PrimaryTable from '~/common/components/Primary/Table'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'

const KeywordSearch = () => {
	const [form] = Form.useForm()
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		sort: 1,
		sortType: true
	}
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 30,
		sort: -1,
		sortType: false
	})
	const [activeColumnSearch, setActiveColumnSearch] = useState('')
	const [filters, setFilters] = useState(listFieldInit)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex)
		setFilters({ ...listFieldInit, ...refValue.current, pageIndex: 1, [dataIndex]: valueSearch })
	}
	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('')
		setFilters({ ...listFieldInit, pageSize: refValue.current.pageSize })
	}
	const onSubmit = (data) => {
		console.log('Data: ', data)
	}
	const onDelete = (data) => {
		console.log('Delete: ', data)
	}
	const columns = [
		{
			title: 'Từ khóa',
			dataIndex: 'Keyword',
			key: 'Keyword',
			width: 350,
			sorter: true,
			...FilterColumn('Keyword', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'Keyword' ? 'active-column-search' : '',
			render: (text) => <a>{text}</a>
		},
		{
			title: 'Thao tác',
			dataIndex: '',
			width: 100,
			render: (text, data) => (
				<>
					<ModalKeywordSearch dataRow={data} onSubmit={onSubmit} form={form} />
					<ModalDeleteKeywordSearch dataRow={data} onDelete={onDelete} />
				</>
			)
		}
	]

	const dataSource = [
		{
			Keyword: 'Demo'
		}
	]
	return (
		<div className="wrap-search-table">
			<PrimaryTable
				TitleCard={'Dánh sách từ khóa'}
				Extra={<ModalKeywordSearch onSubmit={onSubmit} form={form} />}
				columns={columns}
				data={dataSource}
			/>
		</div>
	)
}
export default KeywordSearch
