import { Form, Popover } from 'antd'
import { useState } from 'react'
import { Filter } from 'react-feather'
import DatePickerField from '../FormControl/DatePickerField'
import InputTextField from '../FormControl/InputTextField'
import SelectFieldSearch from '../FormControl/SelectFieldSearch'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

type IProps = {
	dataFilter: {
		name: string
		title: string
		type: 'select' | 'date-range' | 'date-single' | 'text' | string
		col?: string
		mode?: 'multiple' | 'tag'
		optionList?: { title: string; value: any }[]
		value?: number
		handleScroll: Function
		handleSearch: Function
	}[]
	handleFilter: Function
	handleReset: Function
	width?: number
	setTodoApiOption?: any
	todoApiOption?: any
}

export default function FilterBaseVer2(props: IProps) {
	const { dataFilter, handleFilter, handleReset, width, setTodoApiOption, todoApiOption } = props
	const [listFilter, setListFilter] = useState(dataFilter)
	const [visible, setVisible] = useState(false)
	const [form] = Form.useForm()

	// ------------ RESET FILTER -------------
	const resetFilter = () => {
		let newFilter = listFilter.map((item) => {
			item.value = null
			return item
		})
		setListFilter(newFilter)
	}

	// ------------- ON SUBMIT -----------------
	const onSubmit = (data) => {
		handleFilter(data)
		setVisible(false)
	}

	const handleChangeFilter = (visible) => {
		setVisible(visible)
	}

	const onReset = () => {
		handleReset()
		resetFilter()
		form.resetFields()
	}

	const fieldOfFilter = (item, index) => {
		switch (item.type) {
			case 'select':
				return (
					<div key={index} className={item.col}>
						<SelectFieldSearch
							name={item.name}
							mode={item.mode ? item.mode : null}
							optionList={item.optionList}
							label={item.title}
							placeholder={item.title}
							onSearch={item.handleSearch && item.handleSearch}
							onScroll={item.handleScroll && item.handleScroll}
						/>
					</div>
				)
			case 'text':
				return (
					<div key={index} className={item.col}>
						<InputTextField name={item.name} label={item.title} placeholder={item.title} />
					</div>
				)
			case 'date-range':
				return (
					<div key={index} className={item.col}>
						<DatePickerField mode="range" allowClear format="DD/MM/YYYY" name={item.name} label={item.title} placeholder={item.title} />
					</div>
				)
			case 'date-single':
				return (
					<div key={index} className={item.col}>
						<DatePickerField mode="single" allowClear format="DD/MM/YYYY" name={item.name} label={item.title} placeholder={item.title} />
					</div>
				)
			default:
				break
		}
	}

	const content = (
		<div className={`wrap-filter small`}>
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				<div className="grid grid-cols-2 gap-x-2 antd-custom-wrap">
					{dataFilter.map((item, index) => fieldOfFilter(item, index))}

					<div className="col-span-2 flex justify-end">
						<Form.Item className="mb-0">
							<PrimaryButton
								className="mr-2"
								background="disabled"
								type="button"
								children={<span>Đặt lại</span>}
								icon="reset"
								onClick={onReset}
							/>

							<PrimaryButton background="blue" type="submit" children={<span>Tìm kiếm</span>} icon="search" />
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	)

	return (
		<>
			<Popover
				open={visible}
				placement="bottomLeft"
				content={content}
				trigger="click"
				overlayClassName={`filter-popover`}
				onOpenChange={handleChangeFilter}
			>
				{/* <IconButton
					type="button"
					icon={'filter'}
					color="white"
					background="disabled"
					className="p-2 h-[34px] w768:h-[38px] w-[34px] w768:w-[38px] "
					tooltip="Bộ Lọc"
				/> */}
				<button className="btn btn-secondary light btn-filter">
					<Filter />
				</button>
			</Popover>
		</>
	)
}
