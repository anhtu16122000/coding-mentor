import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { TiWarningOutline } from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { studentInClassApi } from '~/api/student-in-class'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'
import PrimaryTable from '../Primary/Table'
import PrimaryTag from '../Primary/Tag'
import { ModalStudentInClassCRUD } from './ModalStudentInClassCRUD'

export const ListStudentInClass = () => {
	const user = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function isTeacher() {
		return user?.RoleId == 2
	}

	function isManager() {
		return user?.RoleId == 4
	}

	function isStdent() {
		return user?.RoleId == 3
	}

	function isAccountant() {
		return user?.RoleId == 6
	}

	function isAcademic() {
		return user?.RoleId == 7
	}

	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const initParameters = {
		classId: router.query.class,
		warning: null,
		sort: null,
		sortType: null,
		pageIndex: 1,
		pageSize: PAGE_SIZE
	}
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])

	const getStudentInClass = async (params) => {
		try {
			setLoading(true)
			const res = await studentInClassApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
				setLoading(false)
			}
			if (res.status === 204) {
				setLoading(true)
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (router?.query?.class) {
			getStudentInClass(apiParameters)
		}
	}, [router?.query?.class])

	const columns =
		isAdmin() || isAcademic() || isManager()
			? [
					{
						title: 'Mã',
						width: 100,
						dataIndex: 'UserCode'
					},
					{
						title: 'Tên học viên',
						width: 200,
						dataIndex: 'FullName',
						render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
					},
					{
						title: 'Số điện thoại',
						width: 150,
						dataIndex: 'Mobile'
					},
					{
						title: 'Email',
						width: 200,
						dataIndex: 'Email'
					},
					{
						title: 'Loại',
						width: 150,
						dataIndex: 'TypeName',
						render: (text, item) => <PrimaryTag color={item?.Type == 1 ? 'green' : 'red'} children={text} />
					},
					{
						title: 'Cảnh báo',
						width: 100,
						dataIndex: 'Warning',
						render: (text) => <div className="flex justify-center">{text ? <TiWarningOutline size={18} color="red" /> : ''}</div>
					},
					{
						title: 'Ghi chú',
						width: 200,
						dataIndex: 'Note'
					},
					{
						title: 'Chức năng',
						width: 150,
						dataIndex: 'Action',
						render: (text, item) => {
							return (
								<div className="flex items-center">
									<ModalStudentInClassCRUD onRefresh={() => getStudentInClass(apiParameters)} mode="edit" dataRow={item} />
									<ModalStudentInClassCRUD onRefresh={() => getStudentInClass(apiParameters)} mode="delete" dataRow={item} />
								</div>
							)
						}
					}
			  ]
			: [
					{
						title: 'Mã',
						width: 100,
						dataIndex: 'UserCode'
					},
					{
						title: 'Tên học viên',
						width: 200,
						dataIndex: 'FullName',
						render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
					},
					{
						title: 'Số điện thoại',
						width: 150,
						dataIndex: 'Mobile'
					},
					{
						title: 'Email',
						width: 200,
						dataIndex: 'Email'
					},
					{
						title: 'Loại',
						width: 150,
						dataIndex: 'TypeName',
						render: (text, item) => (
							<>
								<PrimaryTag color={item?.Type == 1 ? 'green' : 'red'} children={text} />
							</>
						)
					},
					{
						title: 'Cảnh báo',
						width: 100,
						dataIndex: 'Warning',
						render: (text) => <div className="flex justify-center">{text ? <TiWarningOutline size={18} color="red" /> : ''}</div>
					},
					{
						title: 'Ghi chú',
						width: 200,
						dataIndex: 'Note'
					}
			  ]

	return (
		<PrimaryTable
			loading={loading}
			total={totalRow}
			onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
			TitleCard={<div className="extra-table">Danh sách học viên</div>}
			data={dataTable}
			columns={columns}
			Extra={
				(isAdmin() || isAcademic() || isManager()) && (
					<ModalStudentInClassCRUD onRefresh={() => getStudentInClass(apiParameters)} mode="add" />
				)
			}
		/>
	)
}
