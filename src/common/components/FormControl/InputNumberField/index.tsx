import { Form } from 'antd'
import React from 'react'
import { NumericFormat } from 'react-number-format'

const InputNumberField = (props: IFormInputNumber) => {
	const { style, label, isRequired, className, placeholder, disabled, name, rules, max, onChange } = props

	return (
		<>
			<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
				<NumericFormat
					onChange={onChange}
					placeholder={placeholder}
					disabled={disabled}
					thousandSeparator={true}
					className={`w-full is-error px-[11px] py-[4px] primary-input ${className}`}
					isAllowed={(values) => {
						if (max) {
							const { formattedValue, floatValue } = values
							return formattedValue === '' || floatValue <= max
						} else {
							return true
						}
					}}
				/>
			</Form.Item>
		</>
	)
}

export default InputNumberField
