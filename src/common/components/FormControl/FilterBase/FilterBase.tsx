import { DatePicker, Form, Input, Popover, Select } from 'antd'
import moment from 'moment'
import { useState } from 'react'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../../Primary/Button'
import IconButton from '../../Primary/IconButton'

type Props = {
	dataFilter: {
		name: string
		title: string
		col: string //grid-cols-...
		type: string // 'select' | 'date-range' | 'date-single'
		optionList?: any
		value?: number
	}[]
	handleFilter: Function
	handleReset: Function
}

const FilterBase = (props: Props) => {
	const { dataFilter, handleFilter, handleReset } = props
	const { RangePicker } = DatePicker

	const [listFilter, setListFilter] = useState(dataFilter)
	const [visible, setVisible] = useState(false)
	const [form] = Form.useForm()
	const { Option } = Select
	const dateFormat = 'YYYY/MM/DD'

	// ------------ RESET FILTER -------------
	const resetFilter = () => {
		let newFilter = listFilter.map((item) => {
			item.value = null
			return item
		})
		setListFilter(newFilter)
	}

	// ------------- ON SUBMIT -----------------
	const onSubmit = () => {
		handleFilter(listFilter)
		setVisible(false)
	}

	// ------------- RETURN NAME FILTER --------------
	const returnListFilter = (value, nameFilter) => {
		listFilter.every((item, index) => {
			if (item.name == nameFilter) {
				item.value = value
				return false
			}
			return true
		})
		setListFilter([...listFilter])
	}

	// ------------- GET VALUE FILTER ----------------
	const getValueFilter = (value, typeFilter, nameFilter) => {
		switch (typeFilter) {
			case 'date-range':
				if (value.length > 1) {
					let fromDate = moment(value[0].toDate()).format('YYYY/DD/MM')
					let toDate = moment(value[1].toDate()).format('YYYY/DD/MM')
					let valueFromDate = {
						name: 'fromDate',
						value: fromDate
					}
					let valueToDate = {
						name: 'toDate',
						value: toDate
					}
					// listFilter.push(valueFromDate, valueToDate)
					let temp = [...listFilter, { ...valueFromDate }, { ...valueToDate }]
					// @ts-ignore
					setListFilter(temp)
				} else {
					ShowNoti('error', 'Chưa chọn đầy đủ ngày')
				}
				break
			case 'date-single':
				let formatValue = moment(value.toDate()).format('YYYY/MM/DD')
				returnListFilter(formatValue, nameFilter)
				break
			default:
				returnListFilter(value, nameFilter)
				break
		}
	}

	const handleChangeFilter = (visible) => {
		setVisible(visible)
	}

	const onReset = () => {
		handleReset()
		setVisible(false)
		resetFilter()
		form.resetFields()
	}

	const fieldOfFilter = (item, index) => {
		switch (item.type) {
			case 'select':
				return (
					<div key={index} className={item.col}>
						<Form.Item name={item.name} label={item.title}>
							<Select
								style={{ width: '100%' }}
								className="style-input"
								showSearch
								optionFilterProp="children"
								onChange={(value) => getValueFilter(value, 'select', item.name)}
							>
								{item.optionList?.map((item, index) => (
									<Option key={index} value={item.value}>
										{item.title}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
				)
				break
			case 'text':
				return (
					<div key={index} className={item.col}>
						<Form.Item name={item.name} label={item.title}>
							<Input
								placeholder=""
								className="style-input"
								onChange={(e) => getValueFilter(e.target.value, 'text', item.name)}
								allowClear={true}
							/>
						</Form.Item>
					</div>
				)
				break
			case 'date-range':
				return (
					<div key={index} className={item.col}>
						<Form.Item name={item.name} label={item.title}>
							<RangePicker
								className="style-input"
								format={dateFormat}
								onChange={(value) => getValueFilter(value, 'date-range', item.name)}
							/>
						</Form.Item>
					</div>
				)
				break
			case 'date-single':
				return (
					<div className={item.col}>
						<Form.Item name={item.name} label={item.title}>
							<DatePicker format={dateFormat} onChange={(value) => getValueFilter(value, 'date-single', item.name)} />
						</Form.Item>
					</div>
				)
				break
			default:
				break
		}
	}

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={onSubmit}>
				<div className="grid grid-flow-row antd-custom-wrap">
					{dataFilter.map((item, index) => fieldOfFilter(item, index))}

					<div className="grid-cols-1 flex justify-end">
						<Form.Item className="mb-0">
							<PrimaryButton
								className="mr-2"
								background="disabled"
								type="button"
								children={<span>Đặt lại</span>}
								icon="reset"
								onClick={onReset}
							/>

							<PrimaryButton background="blue" type="submit" children={<span>Tìm kiếm</span>} icon="search" onClick={onReset} />
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	)

	return (
		<>
			<Popover
				visible={visible}
				placement="bottomRight"
				content={content}
				trigger="click"
				overlayClassName="filter-popover"
				onVisibleChange={handleChangeFilter}
			>
				<IconButton
					type="button"
					icon={'filter'}
					color="disabled"
					onClick={() => {}}
					className="rounded-xl border-2 border-tw-gray p-2 hover:border-tw-disable"
					tooltip="Lọc"
				/>
			</Popover>
		</>
	)
}

export default FilterBase
