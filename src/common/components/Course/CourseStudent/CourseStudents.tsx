import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PrimaryTable from '~/common/components/Primary/Table'
import { RootState } from '~/store'
import { certificateApi } from '~/api/certificate/certificate'
import ModalCreate from './modal-create'
import CertificateStudent from './CertificateStudent'
import moment from 'moment'

const CourseStudents = () => {
	const [certificate, setCertificate] = useState([])
	const [userRoleId, setUserRoleId] = useState(null)
	const user = useSelector((state: RootState) => state.user.information)

	const getCertificate = async () => {
		try {
			const res = await certificateApi.getAll()
			if (res.status === 200) {
				setCertificate(res.data.data)
			}
		} catch (error) {}
	}

	useEffect(() => {
		getCertificate()
	}, [])

	useEffect(() => {
		if (user) {
			setUserRoleId(user.RoleId)
		}
	}, [])

	const columns = [
		{
			title: 'Mã học viên',
			dataIndex: 'studentCode',
			key: 'studentCode',
			width: '150px',
			render: (text, data) => <div className="font-[700]">{text}</div>
		},
		{
			title: 'Họ tên',
			dataIndex: 'studentName',
			key: 'studentName',
			render: (text, data) => <div className="font-[700] text-[#0A89FF]">{text}</div>
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email'
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
			render: (text, data) => <div>{text}</div>
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ModifiedOn',
			key: 'ModifiedOn',
			render: (text, data) => <div>{moment(text).format('HH:mm - DD/MM/YYYY')}</div>
		},
		{
			width: '110px',
			title: 'Chức năng',
			dataIndex: '',
			key: '',
			render: (data) => {
				return (
					<>
						<ModalCreate getCertificate={getCertificate} parentData={data} />
					</>
				)
			}
		}
	]

	const data = certificate.map((certificate) => {
		return {
			...certificate,
			studentCode: certificate.UserCode,
			studentName: certificate.FullName,
			email: certificate.Email,
			phone: certificate.Mobile
		}
	})

	return (
		<div className="container">
			{userRoleId === '1' && <PrimaryTable columns={columns} data={data} />}
			{userRoleId === '3' && <CertificateStudent certificate={certificate} />}
		</div>
	)
}

export default CourseStudents
