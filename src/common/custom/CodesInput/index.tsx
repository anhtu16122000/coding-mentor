import { Form, Input, InputNumber, InputNumberProps } from 'antd'
import React, { useEffect, useRef } from 'react'
import useEventListener from './useEventListener'
import { InputCode, InputCodeContainer } from './index.styled'

type Props = InputNumberProps & {
	keyName: string
	inputs: string[]
}

export default function CodesInput({ keyName = '', inputs = [], ...other }: Props) {
	const codesRef = useRef<HTMLDivElement>(null)
	const [form] = Form.useForm()

	// const handlePaste = (event: any) => {
	// 	const data = event.clipboardData.getData('text')

	// 	const dataArr = data.split('')

	// 	const newValues = {}

	// 	inputs.forEach((input, index) => {
	// 		newValues[input] = dataArr[index]
	// 	})
	// 	console.log('newValues: ', newValues)
	// 	form.setFieldsValue(newValues)

	// 	event.preventDefault()
	// }

	const handleChangeWithNextField = (event: React.ChangeEvent<HTMLInputElement>, filedName: string) => {
		const { maxLength, value, id } = event.target

		const fieldIndex = id.replace(keyName, '')

		const fieldIntIndex = Number(fieldIndex)

		const nextfield: HTMLElement | null = document.getElementById(`${keyName}${fieldIntIndex + 1}`)

		if (value.length > maxLength) {
			event.target.value = value[0]
		}

		if (value.length >= maxLength && fieldIntIndex < 6 && nextfield !== null) {
			;(nextfield as HTMLElement).focus()
		}
		form.setFieldValue(filedName, value)
	}

	// useEventListener('paste', handlePaste, codesRef)

	return (
		<InputCodeContainer ref={codesRef}>
			{inputs.map((_item: string, index: number) => {
				return (
					<Form.Item name={_item} rules={[{ required: true, message: '' }]}>
						<InputCode
							id={`${keyName}${index + 1}`}
							autoFocus={index === 0}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeWithNextField(event, `${keyName}${index + 1}`)}
							onFocus={(e) => e.currentTarget.select()}
							placeholder=" - "
							maxLength={1}
						/>
					</Form.Item>
				)
			})}
		</InputCodeContainer>
	)
}
