import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { customerStatusApi } from '~/api/customer-status'
import ConsultationStatusForm from '~/common/components/ConsultationStatus/ConsultationStatusForm'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setCustomerStatus } from '~/store/customerStatusReducer'

const ConsultationStatus = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const listParamsDefault = {
		pageSize: PAGE_SIZE,
		pageIndex: currentPage
	}
	const [totalPage, setTotalPage] = useState(null)
	const [params, setParams] = useState(listParamsDefault)
	const [isLoading, setIsLoading] = useState(false)
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()
	const columns = [
		{
			title: 'Trạng thái khách hàng',
			dataIndex: 'Name',
			render: (text) => <p className="font-weight-primary">{text}</p>
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
						{data.Type === 2 && (
							<>
								<ConsultationStatusForm infoDetail={data} getDataConsultationStatus={getDataConsultationStatus} />
								<DeleteTableRow text={`trạng thái ${data.Name}`} handleDelete={() => handleDelete(data.Id)} />
							</>
						)}
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
			let res = await customerStatusApi.getAll({
				...params,
				pageIndex: page
			})
			if (res.status === 200) {
				setTotalPage(res.data.totalRow)
				dispatch(setCustomerStatus(res.data.data))
			}
			if (res.status === 204) {
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
		<PrimaryTable
			// currentPage={currentPage}
			loading={isLoading}
			total={totalPage && totalPage}
			// getPagination={(pageNumber: number) => getPagination(pageNumber)}
			// addClass="basic-header"
			// TitlePage="Tình trạng tư vấn khách hàng"
			Extra={<ConsultationStatusForm getDataConsultationStatus={getDataConsultationStatus} />}
			data={state.customerStatus.CustomerStatus}
			columns={columns}
			onChangePage={(event: number) => setParams({ ...params, pageIndex: event })}
		/>
	)
}
export default ConsultationStatus
