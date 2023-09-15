import { Form, Input, InputNumber, InputNumberProps } from 'antd'
import React, { useRef } from 'react'

type Props = InputNumberProps & {
	keyName: string
	inputs: string[]
}

export default function CodesInput({ keyName = '', inputs = [], ...other }: Props) {
	const codesRef = useRef<HTMLDivElement>(null)

	const handleChangeWithNextField = (
		event: React.ChangeEvent<HTMLInputElement>,
		handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	) => {
		const { maxLength, value, name } = event.target
		const filedIndex = name.replace(keyName, '')
		const filedIntIndex = Number(filedIndex)
		const nextField: HTMLElement | null = document.querySelector(`input[name=${filedIntIndex + 1}]`)
		if (value.length > maxLength) {
			event.target.value = value[0]
		}
        if(value.length >= maxLength && filedIntIndex < 6&&nextField !==null){
            (nextField as HTMLElement).focus();
        }
        handleChange(event);
	}

	return (
		<div style={{ display: 'flex' }} ref={codesRef}>
			{inputs.map((_item: string, index: number) => {
				return (
					<Form.Item name={`${keyName}${index + 1}`} required rules={[{ required: true }]}>
						<Input
							autoFocus={index === 0}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeWithNextField(event)}
							onFocus={(e) => e.currentTarget.select()}
							placeholder=" - "
							maxLength={1}
							style={{
								height: 40,
								width: 40,
								border: '1px solid #212121',
								color: '#212121',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								marginLeft: 10,
								fontSize: 16,
								fontWeight: '600',
								textAlign: 'center'
							}}
						/>
					</Form.Item>
				)
			})}
		</div>
	)
}
