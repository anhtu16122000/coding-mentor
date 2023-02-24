import { Select } from 'antd'
import React, { FC } from 'react'

const { Option } = Select

const SortVideoCourse: FC<{ handleChange: Function; text: string }> = (props) => {
	const { handleChange, text } = props

	return (
		<>
			<Select placeholder="Sắp xếp" className="primary-input w-48" onChange={(event) => handleChange({ sortType: event, sort: 1 })}>
				<Option value={false}>{text} A-Z</Option>
				<Option value={true}>{text} Z-A</Option>
			</Select>
		</>
	)
}

export default SortVideoCourse
