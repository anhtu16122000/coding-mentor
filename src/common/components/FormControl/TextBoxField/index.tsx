import { Form } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

export default function TextBoxField(props: ITextBoxField) {
	const { style, label, isRequired, className, allowClear, placeholder, disabled, name, rules, rows, maxLength, onChange } = props
	return (
		<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
			<TextArea
				className={`${className} h-auto`}
				rows={rows || 4}
				allowClear={allowClear}
				placeholder={placeholder}
				disabled={disabled}
				onChange={(e) => !!onChange && onChange(e)}
				maxLength={maxLength}
			/>
		</Form.Item>
	)
}
