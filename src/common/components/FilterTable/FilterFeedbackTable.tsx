import { Form, Popover, Select } from 'antd'
import React, { useState } from 'react'
import { Filter } from 'react-feather'
// import { Roles } from '~/src/lib/roles/listRoles'
// import { useForm } from 'react-hook-form'
import { MdSearch } from 'react-icons/md'

const Roles = [
	{
		id: 1,
		RoleName: 'Admin' //
	},
	{
		id: 2,
		RoleName: 'Giáo viên' //
	},
	{
		id: 3,
		RoleName: 'Học viên' //
	}
]

const FilterFeedbackTable = (props: any) => {
	const [showFilter, setShowFilter] = useState(false)
	const { Option } = Select

	// const {
	// 	handleSubmit,
	// 	setValue,
	// 	formState: { isSubmitting, errors, isSubmitted }
	// } = useForm()

	const [form] = Form.useForm()
	const onSubmit = (data: any) => {
		props._onFilter(data)
		setShowFilter(false)
	}

	const funcShowFilter = () => {
		setShowFilter(!showFilter)
	}

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={onSubmit}>
				<div className="row">
					<div className="col-md-12">
						<Form.Item label="Role">
							<Select
								className="style-input"
								placeholder="Chọn role"
								onChange={(value) => form.setFieldValue('RoleID', value)}
								allowClear={true}
							>
								{Roles.map((item) => (
									<Option key={item.id} value={item.id}>
										{item.RoleName}
									</Option>
								))}

								<Option value="disabled" disabled>
									Disabled
								</Option>
							</Select>
						</Form.Item>
					</div>
					<div className="col-md-12">
						<Form.Item className="mb-0">
							<button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={onSubmit}>
								<MdSearch size={18} className="mr-1" />
								Tìm kiếm
							</button>
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
					<button
						className="btn btn-secondary light btn-filter"
						onClick={() => {
							showFilter ? setShowFilter(false) : setShowFilter(true)
						}}
					>
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	)
}

export default FilterFeedbackTable
