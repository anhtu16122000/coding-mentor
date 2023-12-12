import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { TiWarningOutline } from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { studentInClassApi } from '~/api/user/student-in-class'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'
import PrimaryTable from '../Primary/Table'
import PrimaryTag from '../Primary/Tag'
import { ModalStudentInClassCRUD } from './ModalStudentInClassCRUD'
import { GrCertificate } from 'react-icons/gr'
import { Tooltip } from 'antd'
import { ShowNoti } from '~/common/utils'
import ViewCertificate from './StudentInClass/ViewCertificate'

export const ListStudentInClass = () => {
	const user = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function isManager() {
		return user?.RoleId == 4
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

	// Cấp chứng chỉ cho học viên
	const createCertificate = async (params) => {
		try {
			const res = await studentInClassApi.postCers({
				StudentId: params,
				ClassId: parseInt(router.query.class + '')
			})
			if (res.status == 200) {
				ShowNoti('success', 'Thành công')
				handleRefresh()
			}
		} catch (error) {
			ShowNoti('success', error?.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getStudentInClass(apiParameters)
	}, [router?.query])

	function handleRefresh() {
		apiParameters?.pageIndex == 1 ? getStudentInClass(apiParameters) : setApiParameters(initParameters)
	}

	const columns =
		isAdmin() || isAcademic() || isManager()
			? [
					{
						title: 'Học viên',
						dataIndex: 'UserCode',
						render: (text, item) => {
							return (
								<div className="min-w-[120px]">
									<div className="flex items-center">
										<div className="font-[600] text-[#1b73e8]">{item?.FullName}</div>
									</div>
									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Mã:</div>
										<div>{item?.UserCode}</div>
									</div>
								</div>
							)
						}
					},
					{
						title: 'Liên hệ',
						width: 150,
						dataIndex: 'Mobile',
						render: (text, item) => {
							return (
								<div className="min-w-[120px]">
									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Điện thoại:</div>
										<div>{item?.Mobile}</div>
									</div>
									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Mail:</div>
										<div>{item?.Email}</div>
									</div>
								</div>
							)
						}
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
						fixed: 'right',
						dataIndex: 'Action',
						render: (text, item) => {
							return (
								<div className="flex items-center">
									<ModalStudentInClassCRUD onRefresh={() => getStudentInClass(apiParameters)} mode="edit" dataRow={item} />
									<ModalStudentInClassCRUD onRefresh={() => getStudentInClass(apiParameters)} mode="delete" dataRow={item} />

									{!item?.HasCertificate && (
										<Tooltip placement="left" title="Cấp chứng chỉ">
											<div
												onClick={() => createCertificate(item?.StudentId)}
												className="flex all-center !text-[#1b73e8] cursor-pointer pt-[2px] pl-[12px]"
											>
												<GrCertificate size={18} />
											</div>
										</Tooltip>
									)}

									{item?.HasCertificate && <ViewCertificate data={item} onRefresh={handleRefresh} />}
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
