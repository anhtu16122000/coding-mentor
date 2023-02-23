import React from 'react'
import CustomerAppointmentNote from '~/common/components/Customer/CustomerAdvisory/CustomerAppointmentNote'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const ExpandedRowAppointment = (props) => {
	const { rowData } = props

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation.RoleId == 1
	}

	function isTeacher() {
		return userInformation.RoleId == 2
	}

	function isManager() {
		return userInformation.RoleId == 4
	}

	function isStdent() {
		return userInformation.RoleId == 3
	}

	function isSaler() {
		return userInformation.RoleId == 5
	}

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

			{(isAdmin() || isTeacher() || isManager()) && <CustomerAppointmentNote dataRow={rowData} />}
		</div>
	)
}

export default ExpandedRowAppointment
