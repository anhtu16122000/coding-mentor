import { List } from 'antd'
import React, { useEffect, useState } from 'react'
import { studentInClassApi } from '~/api/student-in-class'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'

type ITabClassListHistory = {
	StudentDetail: IUserResponse
}
export const TabClassListHistory: React.FC<ITabClassListHistory> = ({ StudentDetail }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const initParameters = { studentIds: StudentDetail?.UserInformationId, pageIndex: 1, pageSize: PAGE_SIZE, disable: true }
	const [apiParameters, setApiParameters] = useState(initParameters)

	const getPagination = (page) => {
		setApiParameters({ ...apiParameters, pageIndex: page })
	}

	const getData = async (params) => {
		try {
			setIsLoading(true)
			const res = await studentInClassApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
			}
		} catch (error) {
			setIsLoading(true)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (StudentDetail?.UserInformationId) {
			getData(apiParameters)
		}
	}, [StudentDetail])

	return (
		<>
			<List
				loading={isLoading}
				pagination={{
					onChange: getPagination,
					total: totalRow,
					size: 'small',
					pageSize: 30,
					showTotal: () => totalRow && <div className="font-weight-black">Tổng cộng: {totalRow}</div>
				}}
				itemLayout="horizontal"
				dataSource={dataTable}
				renderItem={(item) => (
					<List.Item>
						<List.Item.Meta
							title={
								<>
									<p className="font-medium text-[#1b73e8]">{item?.ClassName}</p>
								</>
							}
							description={
								<>
									<p>
										<span className="font-semibold">Hình thức: </span> <span>{item.TypeName || 'Trống'}</span>
									</p>
								</>
							}
						></List.Item.Meta>
					</List.Item>
				)}
			/>
		</>
	)
}
