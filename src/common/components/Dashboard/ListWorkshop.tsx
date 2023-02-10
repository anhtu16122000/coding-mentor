import React from 'react'
import PrimaryTable from '../Primary/Table'

const ListWorkshop = (props) => {
	const { columns, data } = props
	return <PrimaryTable columns={columns} data={data} />
}

export default ListWorkshop
