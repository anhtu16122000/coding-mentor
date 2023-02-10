import { Form, Radio } from 'antd'
import React from 'react'

const RadioField = (props) => {
	const { name, label, disabled, style, className, size, radioList, radioType, radioButtonStyle, handleChange } = props

	// const { errors } = form.formState
	// const hasError = errors[name]

	const checkHandleChange = (value) => {
		if (!handleChange) return
		handleChange(value)
	}

	return (
		<Form.Item name={name} style={style} label={label} className={`${className}`}>
			{/* <Controller
				name={name}
				control={form.control}
				render={({ field }) => ( */}
			<Radio.Group
				// {...field}
				disabled={disabled}
				size={size}
				options={radioList}
				optionType={radioType}
				buttonStyle={radioButtonStyle}
				// onChange={(e) => {
				// 	checkHandleChange(e.target.value)
				// 	field.onChange(e.target.value)
				// }}
			/>
			{/* )}
			/> */}
		</Form.Item>
	)
}
export default RadioField
