import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common/index'
import PayForm from '~/common/components/Finance/Payment/pay'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import { decode, is, parseToMoney } from '~/common/utils/common'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import PaymentForm from '~/common/components/Finance/Payment/Create'
import { TabCompData } from '~/common/custom/TabComp/type'

import { Select } from 'antd'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import PrimaryButton from '~/common/components/Primary/Button'
import DeletePayment from '~/common/components/Finance/Payment/DeletePayment'
import DateFilter from '~/common/primary-components/DateFilter'
import SuperFilter from '~/common/primary-components/SuperFilter'
import { branchApi } from '~/api/manage/branch'
import { userInformationApi } from '~/api/user/user'

type TProps = {
	filters: any

	setFilter: Function
}

const CashFlowFilter: FC<TProps> = (props) => {
	const { filters, setFilter } = props

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
		<div className="grid grid-cols-1 w900:grid-cols-2 gap-[12px] w400:gap-[16px] w-full">
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

			<div className="col-span-2 w600:col-span-1 flex flex-col">
				<div className="mb-[4px] mt-[-3px] font-[600]">Loại</div>
				<Select
					className="primay-input w-full !h-[36px]"
					placeholder="Loại"
					value={filters.Type}
					optionLabelProp="children"
					onChange={(e) => setFilter({ ...filters, Type: e })}
				>
					{[
						{ title: 'Tất cả', value: null },
						{ title: 'Thu', value: 1 },
						{ title: 'Chi', value: 2 }
					].map((item, index) => {
						return (
							<Select.Option key={item?.value} value={item?.value}>
								{item?.title}
							</Select.Option>
						)
					})}
				</Select>
			</div>
		</div>
	)
}

export default CashFlowFilter
