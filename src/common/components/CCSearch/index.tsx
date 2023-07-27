import { Input } from 'antd'
import React from 'react'

function CCSearch({ onSubmit, className }: { onSubmit?: Function; className?: string }) {
	function onChangeText(event) {
		if (event.target.value == '') {
			onSubmit('')
		}
	}

	return (
		<Input.Search
			className={`style-input x-search w-250px ${!!className ? className : ''}`}
			placeholder="Tìm kiếm"
			allowClear
			onChange={onChangeText}
			onSearch={(value) => !!onSubmit && onSubmit(value)}
		/>
	)
}

export default CCSearch
