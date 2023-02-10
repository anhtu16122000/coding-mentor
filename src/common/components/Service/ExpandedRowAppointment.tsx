import React from 'react'
import PrimaryTable from '../Primary/Table'
import CustomerAppointmentNote from '~/common/components/Customer/CustomerAdvisory/CustomerAppointmentNote'

const ExpandedRowAppointment = (props) => {
	const { rowData } = props
	// const getWidth = () => {
	// 	let box = document.querySelector('.ant-table-wrapper')
	// 	return box?.clientWidth ? box.clientWidth - 150 : 0
	// }
	console.log('rowData: ', rowData)
	return (
		<div className="wrapper-expanded-table-appointment">
			<h2 className="result-appointment-title">Kết quả</h2>
			<table className="custom-table-appointment">
				<tr>
					<th>Người tư vấn</th>
					<th>Listening</th>
					<th>Reading</th>
					<th>Writing</th>
					<th>Speaking</th>
					<th>Volcabulary</th>
					<th>Học phí tư vấn</th>
				</tr>
				<tr>
					<td>{rowData.SaleName}</td>
					<td>{rowData.ListeningPoint}</td>
					<td>{rowData.ReadingPoint}</td>
					<td>{rowData.WritingPoint}</td>
					<td>{rowData.SpeakingPoint}</td>
					<td>{rowData.Vocab}</td>
					<td>{rowData.Tuitionfee}</td>
				</tr>
				<tr className="last-row">
					<td>
						<span className="font-semibold">Ghi chú:</span> {rowData?.Note}
					</td>
				</tr>
			</table>
			<CustomerAppointmentNote dataRow={rowData} />
		</div>
	)
}

export default ExpandedRowAppointment
