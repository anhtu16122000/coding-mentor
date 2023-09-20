import { Form, Input } from 'antd'

export default function TextBoxField(props: ITextBoxField) {
	const { style, label, isRequired, className, allowClear, placeholder, disabled, name, rules, rows, maxLength, onChange } = props

	return (
		<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
			<Input.TextArea
				className={`primary-input !h-auto ${className}`}
				rows={rows || 5}
				allowClear={allowClear}
				placeholder={placeholder}
				disabled={disabled}
				onChange={(e) => !!onChange && onChange(e)}
				maxLength={maxLength}
			/>
		</Form.Item>
	)
}
