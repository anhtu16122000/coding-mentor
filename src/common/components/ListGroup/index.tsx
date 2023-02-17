import { Row } from 'antd'
import React, { useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import GroupItem from './item'

const ListGroup = () => {
	const [loading, setLoading] = useState(true)
	const [filter, setFilter] = useState({ pageSize: 30, pageIndex: 1 })
	const [groups, setGroups] = useState([])
	const [totalRow, setTotalRow] = useState(0)

	const getAllGroup = async () => {
		setLoading(true)
		try {
			const res = await RestApi.get<any>('NewsFeedGroup', filter)
			if (res.status === 200) {
				setGroups(res.data.data)
				setTotalRow(res.data.totalRow)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getAllGroup()
	}, [])

	return (
		<div className="cc-list-group">
			<p className="cc-list-group--title">Tất cả các nhóm bạn đã tham gia ({totalRow})</p>

			<Row gutter={[8, 8]}>
				{loading
					? //@ts-ignore
					  [...Array(18).keys()].map((item) => <GroupItem.LoadingSkeleton key={item || Date.now()} />)
					: groups.map((item, idx) => <GroupItem groupData={item} key={idx} />)}
			</Row>

			{}
		</div>
	)
}

export default ListGroup
