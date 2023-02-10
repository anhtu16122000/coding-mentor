import { DatePicker, Form, Popover, Select } from 'antd'
import React, { useState } from 'react'
import { Filter } from 'react-feather'
import { MdOutlineRestore, MdSearch } from 'react-icons/md'

const dateFormat = 'YYYY/MM/DD'

const { RangePicker } = DatePicker

const { Option } = Select

const status = [
	{
		value: 1,
		title: 'Đang diễn ra'
	},
	{
		value: 2,
		title: 'Đã kết thúc'
	}
]

const FilterDiscountTable = (props: any) => {
	const [showFilter, showFilterSet] = useState(false)

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true)
	}
	const [form] = Form.useForm()

	const onSubmit = (data: any) => {
		props._onFilter(data)
		showFilterSet(false)
	}

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
						<Form.Item label="Trạng thái" name="Status">
							<Select className="style-input" placeholder="" allowClear={true} onChange={(value) => form.setFieldValue('Status', value)}>
								{status &&
									status.map((item) => (
										<Option key={item.value} value={item.value}>
											{item.title}
										</Option>
									))}
							</Select>
						</Form.Item>
					</div>

					<div className="col-md-12">
						<Form.Item label="Thời gian" name="Time">
							<RangePicker
								placeholder={['Bắt đầu', 'Kết thúc']}
								format={dateFormat}
								allowClear={true}
								className="style-input"
								onChange={(value, dateStrings) => {
									form.setFieldValue('fromDate', dateStrings[0])
									form.setFieldValue('toDate', dateStrings[1])
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
	)
}

export default FilterDiscountTable
