import { Form, Select } from 'antd'
import _ from 'lodash'
import React from 'react'

const SelectFieldSearch = (props: IFormSelectField) => {
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
		mode,
		isLoading,
		onScroll,
		onSearch
	} = props
	const { Option } = Select

	const checkOnChangeSelect = (value) => {
		if (!onChangeSelect) return
		onChangeSelect(value)
	}

	const handlePopupScroll = (e) => {
		const { target } = e
		if (target.scrollHeight - target.scrollTop === target.clientHeight) {
			onScroll && onScroll()
		}
	}

	return (
		<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
			<Select
				mode={mode}
				className={`primary-input ${className}`}
				showSearch
				allowClear
				loading={isLoading}
				style={style}
				placeholder={placeholder}
				optionFilterProp="children"
				disabled={disabled}
				onSearch={onSearch && _.debounce(onSearch, 500)}
				onPopupScroll={handlePopupScroll}
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

export default SelectFieldSearch
