import { Popconfirm } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { tuitionPackageApi } from '~/api/configs/tuition-package'
import { PrimaryTooltip } from '~/common/components'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { is, parseToMoney } from '~/common/utils/common'
import { RootState } from '~/store'
import FormTuition from './Form'

function TuitionPackage() {
	const [dataTags, setdataTags] = useState<any>([])
	const [isLoading, setIsLoading] = useState(false)
	const [totalRow, setTotalRow] = useState(1)

	const [todoApi, setTodoApi] = useState({ pageSize: PAGE_SIZE, pageIndex: 1 })

	const userInfo = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		if (is(userInfo).admin || is(userInfo).manager) {
			getData()
		}
	}, [todoApi, userInfo])

	function handleRefresh() {
		if (todoApi.pageIndex !== 1) {
			setTodoApi({ ...todoApi, pageIndex: 1 })
		} else {
			getData()
		}
	}

	const getData = async () => {
		try {
			setIsLoading(true)
			const response = await tuitionPackageApi.getAll(todoApi)
			if (response.status == 200) {
				const { data, totalRow } = response.data
				setdataTags(data)
				setTotalRow(totalRow)
			} else {
				setdataTags([])
			}
		} catch (error) {
			ShowNostis.error(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const delThis = async (item) => {
		try {
			const res = await tuitionPackageApi.delete(item?.Id)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				handleRefresh()
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const columns = [
		{
			title: 'Mã',
			dataIndex: 'Code',
			render: (value) => <p className="font-[600]">{value}</p>
		},
		{
			title: 'Thời gian',
			dataIndex: 'Months',
			render: (value) => <p className="font-[600]">{value} tháng</p>
		},
		{
			title: 'Loại',
			dataIndex: 'DiscountType',
			render: (value, item) => {
				if (value == 1) {
					return <span className="tag blue !ml-[-1px]">{item?.DiscountTypeName}</span>
				}
				if (value == 2) {
					return <span className="tag green !ml-[-1px]">{item?.DiscountTypeName}</span>
				}
				return <span className="tag gray !ml-[-1px]">{item?.DiscountTypeName}</span>
			}
		},
		,
		{
			title: 'Giảm giá',
			dataIndex: 'DiscountType',
			render: (value, item) => {
				if (value == 1) {
					return <div className="font-[600] mb-[4px]">{parseToMoney(item?.Discount)}</div>
				}
				if (value == 2) {
					return <div className="font-[600] mb-[4px]">{item?.Discount}%</div>
				}
				return <div className="font-[600] mb-[4px]">{item?.Discount}</div>
			}
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy'
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('HH:mm DD/MM/YYYY')
		},
		{
			title: '',
			render: (valuue, item) => {
				return (
					<div className="flex items-center">
						<PrimaryTooltip id={`upd-${item?.Id}`} content="Cập nhật" place="left">
							<FormTuition onRefresh={handleRefresh} isEdit defaultData={item} />
						</PrimaryTooltip>

						<PrimaryTooltip id={`del-${item?.Id}`} content="Xoá" place="left">
							<Popconfirm placement="left" onConfirm={() => delThis(item)} title={`Xoá #${item?.Code}`}>
								<div className="ml-[16px]">
									<MdClose size={22} color="#e21b1b" />
								</div>
							</Popconfirm>
						</PrimaryTooltip>
					</div>
				)
			}
		}
	]

	return (
		<div className="max-w-[1200px] w-full">
			<ExpandTable
				loading={isLoading}
				total={totalRow}
				onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
				Extra={<FormTuition onRefresh={handleRefresh} />}
				dataSource={dataTags}
				columns={columns}
				pageSize={PAGE_SIZE}
				TitleCard="Danh sách gói học phí"
			/>
		</div>
	)
}

export default TuitionPackage
