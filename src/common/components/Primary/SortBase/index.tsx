import { Select } from 'antd'

export interface ISortBaseProps {
	text: string
	handleChange: Function
	optionList: { title: string; value: number | string; paramsKey: string }[]
}

export default function SortBase(props: ISortBaseProps) {
	const { text, handleChange, optionList } = props
	const { Option } = Select

	const handleChangeSelect = (value) => {
		if (handleChange) {
			let temp = optionList.filter((item) => {
				return item.value == value
			})
			handleChange({ [temp[0].paramsKey]: value })
		}
	}

	return (
		<>
			<Select defaultValue={optionList[0].value} placeholder={text} className="primary-input w-48" onChange={handleChangeSelect}>
				{optionList.map((item, index) => {
					return <Option value={item.value}>{item.title}</Option>
				})}
			</Select>
		</>
	)
}
