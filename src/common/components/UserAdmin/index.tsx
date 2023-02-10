import React, { useState } from 'react'
import PrimaryTable from '../Primary/Table'

function UserAdmin() {
	const [users, setUser] = useState([
		{
			FullNameUnicode: 'Nguyen Chau',
			Email: 'XXX',
			Mobile: 'XXX',
			isDone: false,
			ID: '01'
		},
		{
			FullNameUnicode: 'Nguyen Chau',
			Email: 'XXX',
			Mobile: 'XXX',
			isDone: false,
			ID: '01'
		},
		{
			FullNameUnicode: 'Nguyen Chau',
			Email: 'XXX',
			Mobile: 'XXX',
			isDone: false,
			ID: '01'
		},
		{
			FullNameUnicode: 'Nguyen Chau',
			Email: 'XXX',
			Mobile: 'XXX',
			isDone: false,
			ID: '01'
		},
		{
			FullNameUnicode: 'Nguyen Chau',
			Email: 'XXX',
			Mobile: 'XXX',
			isDone: false,
			ID: '01'
		}
	])

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			// ...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isDone',
			render: (type) => (
				<>
					{type == true && <span className="tag green">Đã chấm tất cả</span>}
					{type == false && <span className="tag gray">Có bài chưa chấm</span>}
				</>
			)
		}
	]

	const expandedRowRender = (data, index) => {
		return <></>
	}

	return (
		<>
			<PrimaryTable columns={columns} data={users} />
		</>
	)
}

export default UserAdmin
