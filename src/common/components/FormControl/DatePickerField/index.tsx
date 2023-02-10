import { DatePicker, Form } from 'antd'
import React from 'react'

export default function DatePickerField(props: IDatePickerField) {
	const { placeholder, allowClear, placement, placeholderRange, disabled, rules } = props
	const { name, label, mode, format, picker, isRequired, className, form, showTime, onChange } = props

	const handleChange = (data) => {
		!!onChange && onChange(data)
	}

	return (
		<Form.Item name={name} label={label} className={`${className} w-full`} required={isRequired} rules={rules}>
			{mode == 'range' ? (
				picker == 'showTime' ? (
					<DatePicker.RangePicker
						disabled={disabled}
						className="primary-input"
						placeholder={placeholderRange}
						onChange={handleChange}
						showTime={{ format: showTime }}
						placement={placement}
						allowClear={allowClear}
						format={format}
						disabledDate={props?.disabledDate}
					/>
				) : (
					<DatePicker.RangePicker
						disabled={disabled}
						className="primary-input"
						placeholder={placeholderRange}
						onChange={handleChange}
						picker={picker}
						placement={placement}
						allowClear={allowClear}
						format={format}
						disabledDate={props?.disabledDate}
					/>
				)
			) : picker == 'showTime' ? (
				<DatePicker
					disabled={disabled}
					className="primary-input"
					placeholder={placeholder}
					onChange={handleChange}
					showTime={{ format: showTime }}
					placement={placement}
					allowClear={allowClear}
					format={format}
					disabledDate={props?.disabledDate}
				/>
			) : (
				<DatePicker
					disabled={disabled}
					className="primary-input"
					placeholder={placeholder}
					onChange={handleChange}
					picker={picker}
					placement={placement}
					allowClear={allowClear}
					format={format}
					disabledDate={props?.disabledDate}
				/>
			)}
		</Form.Item>
	)
}
