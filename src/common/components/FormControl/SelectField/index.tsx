import { Form, Select } from 'antd'

const SelectField = (props: IFormSelectField) => {
	const {
		style,
		label,
		onChangeSelect,
		optionList,
		isRequired,
		className,
		placeholder,
		disabled,
		name,
		rules,
		allowClear = true,
		mode,
		isLoading,
		maxTagCount
	} = props
	const { Option } = Select

	const checkOnChangeSelect = (value) => {
		if (!onChangeSelect) return
		onChangeSelect(value)
	}

	return (
		<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
			<Select
				mode={mode}
				className={`primary-input ${className}`}
				showSearch
				allowClear={allowClear}
				maxTagCount={maxTagCount}
				loading={isLoading}
				style={style}
				placeholder={placeholder}
				optionFilterProp="children"
				disabled={disabled}
				onChange={(value) => {
					checkOnChangeSelect(value)
				}}
			>
				{optionList &&
					optionList.map((o, idx) => (
						<Option disabled={disabled} key={idx} value={o.value}>
							{o.title}
						</Option>
					))}
			</Select>
		</Form.Item>
	)
}

export default SelectField
