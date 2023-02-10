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
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			render: (CreatedBy) => <div style={{ width: '120px' }}>{CreatedBy}</div>
		},
		{
			title: 'Câu thành ngữ',
			dataIndex: 'Content',
			render: (text) => ReactHtmlParser(text)
		},
		{
			fixed: 'right',
			title: 'Chức năng',
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
			// currentPage={currentPage}
			loading={isLoading}
			total={totalPage && totalPage}
			// getPagination={(pageNumber: number) => getPagination(pageNumber)}
			// addClass="basic-header"
			// TitlePage="Thành ngữ lịch"
			Extra={<IdiomsForm getDataIdiom={getDataIdiom} />}
			data={idioms}
			columns={columns}
			onChangePage={(event: number) => setParams({ ...params, pageIndex: event })}
		/>
	)
}
export default Idioms
