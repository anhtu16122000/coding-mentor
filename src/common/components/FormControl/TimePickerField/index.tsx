import { TimePicker, Form } from 'antd'
import React from 'react'

export default function TimePickerField(props) {
	const { placeholder, allowClear, disabled, rules } = props
	const { name, label, isRequired, className } = props

	const format = 'HH:mm'
	return (
		<div>
			<Form.Item name={name} label={label} className={`${className} w-full`} required={isRequired} rules={rules}>
				<TimePicker
					showNow={false}
					className="primary-input"
					placeholder={placeholder}
					disabled={disabled}
					allowClear={allowClear || true}
					format={format}
					// value={checkValue}
					// onSelect={(time) => field.onChange(time?.format(format))}
				/>
			</Form.Item>
		</div>
	)
}
