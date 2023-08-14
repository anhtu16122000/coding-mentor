import { Form } from 'antd'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'

const DynamicComponentWithNoSSR = dynamic(() => import('./Editor'), { ssr: false })

function EditorField(props: IEditorField) {
	const { customFieldProps, onChangeEditor, disableButton, id, height, className } = props
	const { label, name, isRequired, disabled, rules, initialValue, placeholder } = props

	const [value, setValue] = useState('')

	const checkHandleChange = (value) => {
		if (!onChangeEditor) return
		onChangeEditor(value)
		setValue(value)
	}

	return (
		<Form.Item className={className} name={name} required={isRequired} rules={rules} label={label}>
			<DynamicComponentWithNoSSR
				initialValue={initialValue}
				value={value}
				placeholder={placeholder}
				handleChangeDataEditor={checkHandleChange}
				customFieldProps={customFieldProps}
				disabled={disabled}
				disableButton={disableButton}
				id={id}
				height={height || 300}
			/>
		</Form.Item>
	)
}

export default EditorField
