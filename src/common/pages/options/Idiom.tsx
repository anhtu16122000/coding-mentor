import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { idiomApi } from '~/api/idiom'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import IdiomsForm from '~/common/components/Idiom/IdiomsForm'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

const Idioms = () => {
	const [totalPage, setTotalPage] = useState(null)
	const [idioms, setIdioms] = useState<IIdioms[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const listParamsDefault = {
		pageSize: PAGE_SIZE,
		pageIndex: 1,
		search: null
	}
	const [params, setParams] = useState(listParamsDefault)

	const columns = [
		{
			title: 'Câu thành ngữ',
			dataIndex: 'Content',
			render: (text) => ReactHtmlParser(text)
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (value) => <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			render: (value) => <div>{value}</div>
		},
		{
			title: 'Ngày sửa',
			dataIndex: 'ModifiedOn',
			render: (value) => <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
		},
		{
			title: 'Người sửa',
			dataIndex: 'ModifiedBy',
			render: (value) => <div>{value}</div>
		},
		{
			fixed: 'right',
			title: '',
			render: (data) => (
				<>
					<IdiomsForm rowData={data} getDataIdiom={getDataIdiom} />
					<DeleteTableRow handleDelete={() => handleDelete(data.Id)} />
				</>
			)
		}
	]

	const handleDelete = async (id) => {
		try {
			const res = await idiomApi.delete(id)
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				setParams(listParamsDefault)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getDataIdiom = async () => {
		setIsLoading(true)
		try {
			let res = await idiomApi.getAll({ ...params })
			if (res.status === 200) {
				setIdioms(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				setIdioms([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getDataIdiom()
	}, [params])

	return (
		<PrimaryTable
			loading={isLoading}
			total={totalPage && totalPage}
			Extra={<IdiomsForm getDataIdiom={getDataIdiom} />}
			data={idioms}
			columns={columns}
			onChangePage={(event: number) => setParams({ ...params, pageIndex: event })}
		/>
	)
}
export default Idioms
