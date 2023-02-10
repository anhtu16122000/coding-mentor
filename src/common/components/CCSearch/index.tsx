import { Input } from 'antd'
import React from 'react'

function CCSearch({ onSubmit }) {
	function onChangeText(event) {
		if (event.target.value == '') {
			onSubmit('')
		}
	}

	return (
		<Input.Search
			className="style-input x-search ml-3 w-250px mr-2"
			placeholder="Tìm kiếm"
			allowClear
			onChange={onChangeText}
			onSearch={(value) => !!onSubmit && onSubmit(value)}
		/>
	)
}

export default CCSearch
