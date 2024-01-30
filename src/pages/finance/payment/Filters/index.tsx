import React, { FC, useEffect, useState } from 'react'
import { ShowNostis } from '~/common/utils'
import { Select } from 'antd'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { branchApi } from '~/api/manage/branch'
import { userInformationApi } from '~/api/user/user'

type TProps = {
	filters: any
	statusSelected?: any
	billStatus: Array<any>

	setFilter: Function
	handleSelecStatus: Function
}

const PaymentFilter: FC<TProps> = (props) => {
	const { filters, setFilter, statusSelected, handleSelecStatus, billStatus } = props

	const user = useSelector((state: RootState) => state.user.information)
	const router = useRouter()

	// --
	const [branches, setBranches] = useState([])
	const [students, setStudents] = useState([])

	useEffect(() => {
		getBranchs()
		getStudents()
	}, [])

	const getBranchs = async () => {
		try {
			const response = await branchApi.getAll({ pageIndex: 1, pageSize: 99999 })
			if (response.status == 200) {
				setBranches(response.data.data)
			} else {
				setBranches([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const getStudents = async () => {
		try {
			const response = await userInformationApi.getByRole(3)
			if (response.status == 200) {
				setStudents(response.data.data)
			} else {
				setStudents([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	return (
		<div className="grid grid-cols-2 w900:grid-cols-4 gap-[12px] w400:gap-[16px] w-full">
			<div className="col-span-2 w600:col-span-1 flex flex-col">
				<div className="mb-[4px] mt-[-3px] font-[600]">Loại thanh toán</div>
				<Select
					className="primay-input w-full !h-[36px]"
					placeholder="Loại thanh toán"
					value={statusSelected}
					optionLabelProp="children"
					onChange={(e) => handleSelecStatus(e)}
				>
					{billStatus.map((item, index) => {
						return (
							<Select.Option key={item?.id} value={item?.id}>
								{item?.title}
							</Select.Option>
						)
					})}
				</Select>
			</div>

			<div className="col-span-2 w600:col-span-1 flex flex-col">
				<div className="mb-[4px] mt-[-3px] font-[600]">Học viên</div>
				<Select
					value={filters.studentIds}
					showSearch
					placeholder="Chọn học viên"
					className="primay-input !h-[36px] w-full"
					optionFilterProp="children"
					onChange={(e) => setFilter({ ...filters, studentIds: e })}
				>
					<Select.Option key={null} value={null}>
						Tất cả
					</Select.Option>
					{students.map((item) => {
						return (
							<Select.Option key={item.UserInformationId} value={item.UserInformationId}>
								[{item?.UserCode}] - {item?.FullName}
							</Select.Option>
						)
					})}
				</Select>
			</div>

			<div className="col-span-1 flex flex-col">
				<div className="mb-[4px] mt-[-3px] font-[600]">Trung tâm</div>
				<Select
					value={filters.branchIds}
					placeholder="Trung tâm"
					className="primay-input !h-[36px] w-full"
					optionLabelProp="children"
					onChange={(e) => setFilter({ ...filters, branchIds: e })}
				>
					<Select.Option key={null} value={null}>
						Tất cả
					</Select.Option>
					{branches.map((item) => {
						return (
							<Select.Option key={item.Id} value={item.Id}>
								{item?.Name}
							</Select.Option>
						)
					})}
				</Select>
			</div>

			<div className="col-span-1 flex flex-col">
				<div className="mb-[4px] mt-[-3px] font-[600]">Trạng thái</div>
				<Select
					value={filters.status}
					placeholder="Chọn trạng thái"
					className="primay-input !h-[36px] w-full"
					onChange={(e) => setFilter({ ...filters, status: e })}
				>
					<Select.Option key={null} value={null}>
						Tất cả
					</Select.Option>
					<Select.Option key="1" value={1}>
						Chưa thanh toán hết
					</Select.Option>
					<Select.Option key="2" value={2}>
						Đã thanh toán hết
					</Select.Option>
				</Select>
			</div>
		</div>
	)
}

export default PaymentFilter
