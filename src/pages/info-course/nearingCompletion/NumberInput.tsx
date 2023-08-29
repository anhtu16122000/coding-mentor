import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import React from 'react'

interface NumericInputProps {
	value: string
	onChange: (value: string) => void
}

const NumericInput = (props: NumericInputProps) => {
	const { value, onChange } = props

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target
		const reg = /^-?\d*(\.\d*)?$/
		if (reg.test(inputValue) || inputValue === '') {
			if (inputValue !== '-') onChange(inputValue)
		}
	}

	const handleClickPlus = () => {
		const valueNumber = Number(value)
		if (valueNumber > 0) {
			onChange(String(valueNumber + 1))
		} else {
			onChange('1')
		}
	}
	const handleClickMinus = () => {
		const valueNumber = Number(value)
		if (valueNumber > 1) {
			onChange(String(valueNumber - 1))
		}
	}

	const handleBlur = () => {
		let valueTemp = value
		if (value.charAt(value.length - 1) === '.' || value === '-') {
			valueTemp = value.slice(0, -1)
		}
		onChange(valueTemp.replace(/0*(\d+)/, '$1'))
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
			<div
				style={{
					border: '1px solid #DFDFDF',
					borderBottomLeftRadius: 5,
					borderTopLeftRadius: 5,
					height: 30,
					padding: '0 4px',
				}}
			>
				<MinusOutlined onClick={handleClickMinus} />
			</div>

			<Input
				{...props}
				onChange={handleChange}
				onBlur={handleBlur}
				defaultValue={'1'}
				placeholder="Input a number"
				maxLength={16}
				style={{
					margin: '0 3px'
				}}
			/>
			<div
				style={{
					border: '1px solid #DFDFDF',
					borderBottomRightRadius: 5,
					borderTopRightRadius: 5,
					height: 30,
					padding: '0 4px'
				}}
			>
				<PlusOutlined onClick={handleClickPlus} />
			</div>
		</div>
	)
}

export default NumericInput
