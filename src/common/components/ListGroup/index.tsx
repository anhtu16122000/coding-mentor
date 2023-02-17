import { Row } from 'antd'
import React from 'react'
import GroupItem from './item'

const ListGroup = () => {
	return (
		<Row className="cc-list-group">
			<GroupItem />
			<GroupItem />
			<GroupItem />
		</Row>
	)
}

export default ListGroup
