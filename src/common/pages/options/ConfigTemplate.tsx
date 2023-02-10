import React, { useEffect, useState } from 'react'
import { configTemplateApi } from '~/api/config-example'
import ReactHtmlParser from 'react-html-parser'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { ShowNoti } from '~/common/utils'
import IconButton from '~/common/components/Primary/IconButton'
import Link from 'next/link'
import { Tooltip } from 'antd'
import PrimaryTable from '~/common/components/Primary/Table'

const ConfigTemplate = () => {
	const [dataTable, setDataTable] = useState<IConfigExample[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)

	const getDataTable = async () => {
		setIsLoading(true)
		try {
			let res = await configTemplateApi.getAll()
			if (res.status === 200) {
				setDataTable(res.data.data)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getDataTable()
	}, [])

	const columns = [
		{
			title: 'Mẫu',
			dataIndex: 'TypeName'
		},
		{
			title: 'Chức năng',
			width: 100,
			align: 'center',
			render: (record: IConfigExample, _, idx: number) => (
				<>
					<Link
						href={{
							pathname: '/options/config-template/detail',
							query: { slug: record.Type }
						}}
					>
						<IconButton icon="eye" color="blue" type="button" tooltip="Xem chi tiết" />
					</Link>
				</>
			)
		}
	]

	const expandedRowRender = (text) => {
		return <p className="invoice-content pt-5">{ReactHtmlParser(text.Content)}</p>
	}

	return (
		<>
			{/* <TitlePage title="Mẫu" /> */}
			<PrimaryTable
				loading={isLoading}
				data={dataTable}
				columns={columns}
				// currentPage={filters.pageIndex}
				total={totalPage}
				// getPagination={getPagination}
			/>
		</>
	)
}
export default ConfigTemplate
