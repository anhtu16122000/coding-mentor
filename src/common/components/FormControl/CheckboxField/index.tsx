import { Form } from 'antd'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import React from 'react'

const CheckboxField = (props) => {
	const { name, label, text, disabled, handleChangeCheckbox, style, className, isRequired, rules } = props

	// const checkHandleChangeCheckbox = (value) => {
	// 	if (!handleChangeCheckbox) return
	// 	handleChangeCheckbox(value)
	// }

	return (
		<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
			<Checkbox
				disabled={disabled}
				// checked={field.value}
				// onChange={(e) => {
				// 	checkHandleChangeCheckbox(e.target.checked)
				// 	field.onChange(e.target.checked)
				// }}
			>
				{text}
			</Checkbox>
			{/* {hasError && (
				<div className="ant-form-item-explain ant-form-item-explain-error  font-color-error">
					<div role="alert">{errors[name]?.message}</div>
				</div>
			)} */}
		</Form.Item>
	)
}
export default CheckboxField
