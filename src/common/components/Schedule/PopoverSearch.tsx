import { Form, Popover, Select, Spin } from 'antd'
import React, { useRef } from 'react'
import { MdOutlineRestore, MdSearch } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { AiOutlineCalendar } from 'react-icons/ai'

const PopoverSearch = (props) => {
	const { setParamsSearch, teachers, isLoading } = props
	const branch = useSelector((state: RootState) => state.branch.Branch)
	const refPopover = useRef(null)
	const [form] = Form.useForm()

	const onSubmit = (data) => {
		const DATA_GET = {
			branchIds: !!data.branchIds ? data.branchIds.join(',') : '',
			teacherIds: !!data.teacherIds ? data.teacherIds.join(',') : ''
		}
		setParamsSearch((prev) => ({ ...prev, ...DATA_GET }))
		refPopover.current.close()
	}

	const onReset = () => {
		setParamsSearch((prev) => ({ ...prev, branchIds: '', teacherIds: '' }))
		form.resetFields()
		refPopover.current.close()
	}

	const content = (
		<div className="wrap-filter small">
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				<div className="grid grid-cols-2 gap-x-4">
					<div className="col-span-2">
						<Form.Item label="Trung tâm" name="branchIds">
							<Select allowClear mode="multiple" className="primary-input" placeholder="Chọn trung tâm">
								{branch.map((item) => {
									return (
										<Select.Option value={item.Id} key={item.Id}>
											{item.Name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
					</div>
					<div className="col-span-2">
						<Form.Item label="Giáo viên" name="teacherIds">
							<Select allowClear mode="multiple" className="primary-input" placeholder="Chọn giáo viên">
								{!!teachers &&
									teachers.map((item) => {
										return (
											<Select.Option value={item.UserInformationId} key={item.UserInformationId}>
												{item.FullName} - {item.UserCode}
											</Select.Option>
										)
									})}
							</Select>
						</Form.Item>
					</div>
					<div className="col-span-2 mt-2">
						<button disabled={isLoading} type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
							<MdSearch size={18} className="mr-1" />
							Kiểm tra {isLoading && <Spin className="loading-base ml-2" />}
						</button>
						<button type="button" className="light btn btn-secondary" style={{ marginRight: '10px' }} onClick={onReset}>
							<MdOutlineRestore size={18} className="mr-1" />
							Khôi phục
						</button>
					</div>
				</div>
			</Form>
		</div>
	)
	return (
		<Popover ref={refPopover} content={content} title={null} trigger="click" placement="bottomLeft">
			<button className="btn btn-schedule-branch">
				<AiOutlineCalendar className="mr-2" />
				Kiểm tra lịch
			</button>
		</Popover>
	)
}

export default PopoverSearch
