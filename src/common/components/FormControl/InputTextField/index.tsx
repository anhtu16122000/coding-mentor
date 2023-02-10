import { Form, Input } from 'antd'
import React from 'react'

const InputTextField = (props: IFormInputText) => {
	const { style, label, isRequired, className, allowClear, placeholder, disabled, name, rules } = props
	return (
		<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
			<Input
				className={`primary-input ${className}`}
				allowClear={allowClear}
				placeholder={placeholder}
				disabled={disabled}
				onChange={(e) => {}}
			/>
		</Form.Item>
	)
}

export default InputTextField
