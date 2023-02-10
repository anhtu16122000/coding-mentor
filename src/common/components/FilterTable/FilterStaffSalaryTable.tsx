import { DatePicker, Form, Popover, Select } from 'antd'
import React, { useState } from 'react'
import { Filter } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdOutlineRestore, MdSearch } from 'react-icons/md'

const dateFormat = 'YYYY/MM/DD'

const { RangePicker } = DatePicker

const FilterStaffSalaryTable = (props: any) => {
	const { Option } = Select
	const [form] = Form.useForm()

	const [showFilter, showFilterSet] = useState(false)

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true)
	}

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm()

	const onSubmit = handleSubmit((data: any) => {
		props._onFilter(data)
		showFilterSet(false)
	})

	const handleReset = () => {
		form.resetFields()
		props._onHandleReset()
		showFilterSet(false)
	}

	const content = (
		<div className={`wrap-filter small`}>
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				<div className="row">
					<div className="col-md-12">
						<Form.Item label="Role" name="Role">
							<Select className="style-input" placeholder="Chọn role" onChange={(value) => setValue('RoleID', value)} allowClear={true}>
								{props.roles.map((item) => (
									<Option key={item.value} value={item.value}>
										{item.title}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
					<div className="col-md-12">
						<Form.Item label="Modified Date" name="Modified Date">
							<RangePicker
								format={dateFormat}
								className="style-input"
								allowClear={true}
								onChange={(value, dateStrings) => {
									setValue('fromDate', dateStrings[0])
									setValue('toDate', dateStrings[1])
								}}
							/>
						</Form.Item>
					</div>
					<div className="col-md-12">
						<Form.Item className="mb-0">
							<button className="btn btn-primary" style={{ marginRight: '10px' }} type="submit">
								<MdSearch size={18} className="mr-1" />
								Tìm kiếm
							</button>
							<span className="btn btn-light" onClick={handleReset}>
								<MdOutlineRestore size={18} className="mr-1" />
								Khôi phục
							</span>
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	)

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover
					visible={showFilter}
					placement="bottomRight"
					content={content}
					trigger="click"
					overlayClassName="filter-popover"
					onVisibleChange={funcShowFilter}
				>
					<button className="btn btn-secondary light btn-filter" onClick={funcShowFilter}>
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	)
}

export default FilterStaffSalaryTable
