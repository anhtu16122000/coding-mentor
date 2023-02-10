import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Popover, Spin } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { Filter } from 'react-feather'
import { MdOutlineRestore, MdSearch } from 'react-icons/md'
import * as yup from 'yup'
import DatePickerField from '~/common/components/FormControl/DatePickerField'

const DayOffFilterForm = (props) => {
	const { handleFilter, handleResetFilter } = props

	const [showFilter, showFilterSet] = useState(false)

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true)
	}
	// const schema = yup.object().shape({
	// 	fromDate: yup.date().required('Bạn không được để trống'),
	// 	toDate: yup
	// 		.date()
	// 		.required('Bạn không được để trống')
	// 		.when('fromDate', (startDate, schema) => startDate && schema.min(startDate, `Ngày không hợp lệ`))
	// })

	// const defaultValuesInit = {
	// 	fromDate: null,
	// 	toDate: null
	// }
	// const form = useForm({
	// 	defaultValues: defaultValuesInit,
	// 	resolver: yupResolver(schema)
	// })

	const [form] = Form.useForm()
	const checkHandleFilterDayOff = (createdBy) => {
		if (!handleFilter) return
		handleFilter(createdBy)
		funcShowFilter()
	}
	const checkHandleResetFilterDayOff = () => {
		if (!handleResetFilter) return
		handleResetFilter()
		funcShowFilter()
		form.resetFields()
	}
	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={checkHandleFilterDayOff}>
				<div className="row">
					<div className="col-md-12">
						<DatePickerField mode="single" name="fromDate" label="Ngày khởi tạo từ" placeholder="Chọn ngày" />
					</div>
					<div className="col-md-12">
						<DatePickerField mode="single" name="toDate" label="Đến ngày" placeholder="Chọn ngày" />
					</div>
					<div className="col-md-12 mt-3">
						<button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
							<MdSearch size={18} className="mr-1" />
							Tìm kiếm
							{/* {isLoading.type === 'FILTER_CREATED' && isLoading.status && (
								<Spin className="loading-base" />
							)} */}
						</button>
						<button type="button" className="light btn btn-secondary" onClick={checkHandleResetFilterDayOff}>
							<MdOutlineRestore size={18} className="mr-1" />
							Khôi phục
						</button>
					</div>
				</div>
			</Form>
		</div>
	)

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover
					placement="bottomRight"
					content={content}
					trigger="click"
					visible={showFilter}
					onVisibleChange={funcShowFilter}
					overlayClassName="filter-popover"
				>
					<button className="btn btn-secondary light btn-filter">
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	)
}
export default DayOffFilterForm
