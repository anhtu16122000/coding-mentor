import { DatePicker, Form, Popover, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { formNoneRequired } from '~/common/libs/others/form'
import { Filter } from 'react-feather'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { branchApi } from '~/api/manage/branch'
import { useDispatch } from 'react-redux'
import { setFilterBranchs } from '~/store/filterReducer'
import FooterFilters from '~/common/components/Footer/Filters'
import { PrimaryTooltip } from '~/common/components'
import { userInformationApi } from '~/api/user/user'
import moment from 'moment'

const { RangePicker } = DatePicker

const dateFormat = 'YYYY/MM/DD'

const Filters: FC<{ filters: any; onSubmit: Function; onReset: Function }> = (props) => {
	const { filters, onSubmit, onReset } = props

	const [form] = Form.useForm()

	const dispatch = useDispatch()

	const [visible, setVisible] = useState(false)
	const branches = useSelector((state: RootState) => state.filter.Branchs)
	const [listFilter, setListFilter] = useState([
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'grid-cols-1',
			type: 'date-range'
		}
	])

	const [students, setStudents] = useState([])

	useEffect(() => {
		if (visible) {
			getBranchs()
			getStudents()
		}
	}, [visible])

	const getBranchs = async () => {
		try {
			const response = await branchApi.getAll({ pageIndex: 1, pageSize: 99999 })
			if (response.status == 200) {
				dispatch(setFilterBranchs(response.data.data))
			} else {
				dispatch(setFilterBranchs([]))
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

	function toggle() {
		setVisible(!visible)
	}

	function convertToString(arr) {
		if (!arr) return ''
		return arr.join(',')
	}

	function onFinish(params) {
		const DATA_SUBMIT = {
			...filters,
			...params,
			sort: 1,
			tags: convertToString(checkedKeys),
			fromDate: params?.['date-range'] ? new Date(params?.['date-range'][0]).toISOString() : null,
			toDate: params?.['date-range'] ? new Date(params?.['date-range'][1]).toISOString() : null
		}

		!!onSubmit && onSubmit(DATA_SUBMIT)

		toggle()
	}

	function submitForm() {
		form.submit()
	}

	function resetForm() {
		form.resetFields()
		if (!!onReset) onReset()
		setCheckedKeys([])
		toggle()
	}

	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])

	const getValueFilter = (value, typeFilter, nameFilter) => {
		switch (typeFilter) {
			case 'date-range':
				if (value.length > 1) {
					let fromDate = moment(value[0].toDate()).format('YYYY/MM/DD')
					let toDate = moment(value[1].toDate()).format('YYYY/MM/DD')
					let valueFromDate = {
						name: 'fromDate',
						value: fromDate
					}
					let valueToDate = {
						name: 'toDate',
						value: toDate
					}
					// @ts-ignore
					listFilter.push(valueFromDate, valueToDate)
					setListFilter([...listFilter])
				} else {
					ShowNoti('error', 'Chưa chọn đầy đủ ngày')
				}
				break
		}
	}

	const content = (
		<div className="w-[300px] p-[8px]">
			<Form
				form={form}
				className="grid grid-cols-2 gap-x-4"
				layout="vertical"
				initialValues={{ remember: true }}
				onFinish={onFinish}
				autoComplete="on"
			>
				<Form.Item className="col-span-2" name="branchIds" label="Trung tâm" rules={formNoneRequired}>
					<Select placeholder="Chọn trung tâm" allowClear>
						{branches.map((item) => {
							return (
								<Select.Option key={item.Id} value={item.Id}>
									{item?.Name}
								</Select.Option>
							)
						})}
					</Select>
				</Form.Item>

				<Form.Item className="col-span-2" name="studentIds" label="Học viên" rules={formNoneRequired}>
					<Select placeholder="Chọn học viên" allowClear>
						{students.map((item) => {
							return (
								<Select.Option key={item.UserInformationId} value={item.UserInformationId}>
									[{item?.UserCode}] - {item?.FullName}
								</Select.Option>
							)
						})}
					</Select>
				</Form.Item>

				<Form.Item className="col-span-2" name="status" label="Trạng thái" rules={formNoneRequired}>
					<Select placeholder="Chọn trạng thái" allowClear>
						<Select.Option key="1" value={1}>
							Chưa thanh toán hết
						</Select.Option>

						<Select.Option key="2" value={2}>
							Đã thanh toán hết
						</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item className="col-span-2" name={'date-range'} label="Ngày">
					<RangePicker
						placeholder={['Bắt đầu', 'Kết thúc']}
						className="primary-input"
						format={dateFormat}
						onChange={(value) => getValueFilter(value, 'date-range', 'date-range')}
					/>
				</Form.Item>
			</Form>

			<FooterFilters onSubmit={submitForm} onReset={resetForm} />
		</div>
	)

	return (
		<>
			<Popover
				placement="bottomLeft"
				content={content}
				trigger="click"
				open={visible}
				onOpenChange={toggle}
				showArrow={true}
				overlayClassName="show-arrow"
			>
				<PrimaryTooltip id={`filters-api`} place="right" content="Bộ lọc">
					<div
						onClick={toggle}
						className="w-[36px] h-[36px] cursor-pointer bg-[#edf1f8] all-center rounded-[6px] hover:bg-[#dee2ea] active:bg-[#edf1f8]"
					>
						<Filter size={16} />
					</div>
				</PrimaryTooltip>
			</Popover>
		</>
	)
}

export default Filters
