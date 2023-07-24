import moment from 'moment'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { customerStatusApi } from '~/api/configs/customer-status'
import appConfigs from '~/appConfig'
import ConsultationStatusForm from '~/common/components/ConsultationStatus/ConsultationStatusForm'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setCustomerStatus } from '~/store/customerStatusReducer'

const ConsultationStatus = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const listParamsDefault = { pageSize: PAGE_SIZE, pageIndex: currentPage }
	const [totalPage, setTotalPage] = useState(null)
	const [params, setParams] = useState(listParamsDefault)
	const [isLoading, setIsLoading] = useState(false)
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()

	const columns = [
		{
			title: 'Trạng thái',
			dataIndex: 'Name',
			render: (text, item) => {
				return (
					<div className="flex justify-start">
						<div
							className="px-[8px] py-[2px] rounded-[4px] in-1-line font-[500]"
							style={{ background: item?.ColorCode, color: item?.ColorCode == '#FBC02D' || !item?.ColorCode ? '#000' : '#fff' }}
						>
							{text || 'Trạng thái'}
						</div>
					</div>
				)
			}
		},
		{
			title: 'Người tạo',
			dataIndex: 'ModifiedBy'
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Chức năng',
			render: (data) => {
				return (
					<>
						<ConsultationStatusForm infoDetail={data} getDataConsultationStatus={getDataConsultationStatus} />
						<DeleteTableRow
							disable={data.Type != 2}
							title={data.Type != 2 ? 'Mặc định, không thể xoá' : 'Xoá'}
							text={`trạng thái ${data.Name}`}
							handleDelete={() => handleDelete(data.Id)}
						/>
					</>
				)
			}
		}
	]

	const handleDelete = async (id) => {
		try {
			const res = await customerStatusApi.delete(id)
			if (res.status === 200) {
				getDataConsultationStatus(1)
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getDataConsultationStatus = async (page: any) => {
		setIsLoading(true)
		try {
			let res = await customerStatusApi.getAll({ ...params, pageIndex: page })
			if (res.status == 200) {
				setTotalPage(res.data.totalRow)
				dispatch(setCustomerStatus(res.data.data))
			} else {
				setCurrentPage(1)
				dispatch(setCustomerStatus([]))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getDataConsultationStatus(currentPage)
	}, [params])

	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Trạng thái khách hàng</title>
			</Head>
			<PrimaryTable
				loading={isLoading}
				total={totalPage && totalPage}
				TitleCard="Danh sách trạng thái"
				Extra={<ConsultationStatusForm getDataConsultationStatus={getDataConsultationStatus} />}
				data={state.customerStatus.CustomerStatus}
				columns={columns}
				onChangePage={(event: number) => setParams({ ...params, pageIndex: event })}
			/>
		</>
	)
}

export default ConsultationStatus
