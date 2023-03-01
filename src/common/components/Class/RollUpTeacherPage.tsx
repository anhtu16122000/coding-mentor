import { Switch } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'
import PrimaryTable from '../Primary/Table'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { classApi } from '~/api/class'
import moment from 'moment'
import { ShowNoti } from '~/common/utils'

export const RollUpTeacherPage = () => {
	const user = useSelector((state: RootState) => state.user.information)
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const initParameters = { classId: router.query.class, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [loadingSwitch, setLoadingSwitch] = useState(false)

	const handleChangeRollUp = async (Id) => {
		try {
			setLoadingSwitch(true)
			const res = await classApi.addRoleUpTeacher(Id)
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				setLoadingSwitch(false)
				getRollUpTeacher(apiParameters)
			}
		} catch (error) {
			ShowNoti('error', error.message)
			setLoadingSwitch(true)
		} finally {
			setLoadingSwitch(false)
		}
	}
	const getRollUpTeacher = async (params) => {
		try {
			setLoading(true)
			const res = await classApi.getRollUpTeacher(params)
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
			getRollUpTeacher(apiParameters)
		}
	}, [router?.query?.class])

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

	const columns = [
		{
			title: 'Giáo viên',
			dataIndex: 'TeacherName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Ngày',
			dataIndex: 'StartTime',
			render: (text) => <>{moment(text).format('DD-MM-YYYY')}</>
		},
		{
			title: 'Thời gian học',
			dataIndex: 'Time',
			render: (text, item) => (
				<>
					{moment(item?.StartTime).format('HH:mm')} - {moment(item?.EndTime).format('HH:mm')}
				</>
			)
		},
		{
			title: 'Điểm danh',
			dataIndex: 'TeacherAttendanceId',
			render: (text, item) => {
				if (isAdmin() || isManager() || isAcademic()) {
					return (
						<div className="antd-custom-wrap">
							<Switch
								checkedChildren={<CheckOutlined />}
								unCheckedChildren={<CloseOutlined />}
								loading={loadingSwitch}
								onChange={(val) => handleChangeRollUp(item?.ScheduleId)}
								checked={text != 0}
								disabled={text != 0}
							/>
						</div>
					)
				}

				if (text != 0) {
					return 'Đã điểm danh'
				}

				return 'Chưa điểm danh'
			}
		}
	]

	return (
		<>
			<PrimaryTable
				total={totalRow}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
				loading={loading}
				data={dataTable}
				columns={columns}
			/>
		</>
	)
}
