import React, { FC, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { areaApi } from '~/api/area'
import { registerApi, userInformationApi } from '~/api/user'
import { Input, Popover } from 'antd'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setArea } from '~/store/areaReducer'
import PrimaryTable from '~/common/components/Primary/Table'
import FilterTable from '~/common/utils/table-filter'
import PrimaryButton from '~/common/components/Primary/Button'
import SortUser from '~/common/components/User/sort-user'
import { BsThreeDots } from 'react-icons/bs'
import ImportStudent from '~/common/components/User/ImportStudent'
import CreateUser from '~/common/components/User/user-form'
import appConfigs from '~/appConfig'
import { permissionApi } from '~/api/permission'
import { parseSelectArray } from '~/common/utils/common'
import { branchApi } from '~/api/branch'
import { setBranch } from '~/store/branchReducer'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import { sourceApi } from '~/api/source'
import { learningNeedApi } from '~/api/learning-needs'
import { purposeApi } from '~/api/purpose'
import { setSource } from '~/store/sourceReducer'
import { setLearningNeed } from '~/store/learningNeedReducer'
import { setPurpose } from '~/store/purposeReducer'
import { setSaler } from '~/store/salerReducer'
import IconButton from '~/common/components/Primary/IconButton'
import { useRouter } from 'next/router'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import { ButtonEye } from '~/common/components/TableButton'
import { PrimaryTooltip } from '~/common/components'
import Filters from '~/common/components/Student/Filters'

const Student: FC<IPersonnel> = (props) => {
	const { reFresh, allowRegister } = props

	const initParamters = {
		sort: 0,
		sortType: false,
		PageSize: PAGE_SIZE,
		Genders: null,
		PageIndex: 1,
		RoleIds: props.type == 'personnel' ? '1,2,4,5,6,7' : '3',
		Search: null
	}

	const [apiParameters, setApiParameters] = useState(initParamters)
	const [roleStaff, setRoleStaff] = useState([])
	const [roleSelectFilter, setRoleSelectFilter] = useState([])
	const [users, setUser] = useState([])
	const [totalRow, setTotalRow] = useState(1)
	const [loading, setLoading] = useState(false)
	const [loadingAllow, setLoadingAllow] = useState(false)
	const state = useSelector((state: RootState) => state)
	const router = useRouter()
	const dispatch = useDispatch()

	const sale = useMemo(() => {
		if (state.saler.Saler.length > 0) {
			return parseSelectArray(state.saler.Saler, 'FullName', 'UserInformationId')
		}
	}, [state.saler])

	const source = useMemo(() => {
		if (state.source.Source.length > 0) {
			return parseSelectArray(state.source.Source, 'Name', 'Id')
		}
	}, [state.source])

	const learningNeed = useMemo(() => {
		if (state.learningNeed.LearningNeed.length > 0) {
			return parseSelectArray(state.learningNeed.LearningNeed, 'Name', 'Id')
		}
	}, [state.learningNeed])

	const purpose = useMemo(() => {
		if (state.purpose.Purpose.length > 0) {
			return parseSelectArray(state.purpose.Purpose, 'Name', 'Id')
		}
	}, [state.purpose])

	useEffect(() => {
		const convertRoleSelectFilter = roleStaff.map((role) => role.value)
		setRoleSelectFilter(convertRoleSelectFilter)
	}, [roleStaff])

	const getAllSource = async () => {
		try {
			const res = await sourceApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setSource(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setSource([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllSale = async () => {
		try {
			const res = await userInformationApi.getAll({ pageSize: 99999, roleIds: '5' })
			if (res.status === 200) {
				dispatch(setSaler(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setSaler([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllLearningNeed = async () => {
		try {
			const res = await learningNeedApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setLearningNeed(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setLearningNeed([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllPurpose = async () => {
		try {
			const res = await purposeApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setPurpose(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setPurpose([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (props.type === 'student') {
			if (state.source.Source.length === 0) {
				getAllSource()
			}
			if (state.learningNeed.LearningNeed.length === 0) {
				getAllLearningNeed()
			}
			if (state.purpose.Purpose.length === 0) {
				getAllPurpose()
			}
			if (state.saler.Saler.length === 0) {
				getAllSale()
			}
		}
	}, [])

	const getRoleStaff = async () => {
		try {
			const res = await permissionApi.getRoleStaff()
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				setRoleStaff(convertData)
			}
			if (res.status === 204) {
				setRoleStaff([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllBranch = async () => {
		try {
			const res = await branchApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setBranch(res.data.data))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllArea = async () => {
		try {
			const response = await areaApi.getAll({ pageSize: 99999 })
			if (response.status === 200) {
				dispatch(setArea(response.data.data))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const getUsers = async (param) => {
		setLoading(true)
		try {
			const response = await userInformationApi.getAll(param)
			if (response.status == 200) {
				setUser(response.data.data)
				setTotalRow(response.data.totalRow)
			}
			if (response.status == 204) {
				setUser([])
			}
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getRoleStaff()
	}, [])

	useEffect(() => {
		if (state.area.Area.length == 0) {
			getAllArea()
		}
		if (state.branch.Branch.length == 0) {
			getAllBranch()
		}
	}, [])

	useEffect(() => {
		getUsers(apiParameters)
	}, [apiParameters])

	async function deleteUser(param) {
		setLoading(true)
		try {
			const response = await userInformationApi.delete(param)
			if (response.status === 200) {
				getUsers(apiParameters)
				return response
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const columns = [
		userInfoColumn,
		{
			title: 'Email',
			dataIndex: 'Email',
			render: (text) => <>{text}</>
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile',
			render: (text) => <>{text}</>
		},
		{
			title: 'Chức vụ',
			dataIndex: 'RoleId',
			render: (value, item) => (
				<>
					{value == 1 && <span className="tag green">{item?.RoleName}</span>}
					{value == 2 && <span className="tag blue">{item?.RoleName}</span>}
					{value == 4 && <span className="tag yellow">{item?.RoleName}</span>}
					{value == 5 && <span className="tag blue-weight">{item?.RoleName}</span>}
					{value == 6 && <span className="tag gray">{item?.RoleName}</span>}
					{value == 7 && <span className="tag gray">{item?.RoleName}</span>}
					{value == 8 && <span className="tag gray">{item?.RoleName}</span>}
				</>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusId',
			render: (data) => (
				<>
					{data == 1 && <span className="tag red">Đã khóa</span>}
					{data == 0 && <span className="tag blue">Đang hoạt động</span>}
				</>
			)
		},
		{
			width: 100,
			title: 'Chức năng',
			dataIndex: '',
			fixed: 'right',
			render: (data, item) => {
				return (
					<div className="flex justify-center items-center">
						<IconButton
							type="button"
							icon={'eye'}
							color="blue"
							onClick={() => {
								router.push({
									pathname: '/info-course/student/detail',
									query: { StudentID: item.UserInformationId }
								})
							}}
							className=""
							tooltip="Chi tiết"
						/>
						{props.type !== 'student' && (
							<CreateUser
								isEdit
								roleStaff={roleStaff}
								defaultData={item}
								className="!hidden w700:!inline-flex"
								onRefresh={() => getUsers(apiParameters)}
								isStudent={false}
							/>
						)}

						{props.type == 'student' && (
							<CreateUser
								isEdit
								roleStaff={roleStaff}
								source={source}
								learningNeed={learningNeed}
								purpose={purpose}
								sale={sale}
								defaultData={item}
								className="!hidden w700:!inline-flex"
								onRefresh={() => getUsers(apiParameters)}
								isStudent={true}
							/>
						)}
						<DeleteTableRow text={`${item.RoleName} ${item.FullName}`} handleDelete={() => deleteUser(item.UserInformationId)} />
					</div>
				)
			}
		}
	]

	const columnsStudent = [
		userInfoColumn,
		{
			title: 'Email',
			dataIndex: 'Email',
			render: (text) => <>{text}</>
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile',
			width: 150,
			render: (text) => <>{text}</>
		},
		{
			title: 'Giới tính',
			width: 90,
			dataIndex: 'Gender',
			render: (value, record) => (
				<>
					{value == 1 && <span className="tag yellow">Nam</span>}
					{value == 2 && <span className="tag blue">Nữ</span>}
				</>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusId',
			render: (data) => (
				<>
					{data == 1 && <span className="tag red">Đã khóa</span>}
					{data == 0 && <span className="tag blue">Đang hoạt động</span>}
				</>
			)
		},
		{
			title: 'Trạng thái học',
			width: 130,
			dataIndex: 'LearningStatus',
			render: (data, record) => (
				<>
					{data === 1 && <span className="tag yellow">{record.LearningStatusName}</span>}
					{data === 2 && <span className="tag blue">{record.LearningStatusName}</span>}
					{data === 3 && <span className="tag green">{record.LearningStatusName}</span>}
					{data === 4 && <span className="tag red">{record.LearningStatusName}</span>}
				</>
			)
		},
		{
			width: 100,
			title: 'Chức năng',
			dataIndex: '',
			fixed: 'right',
			render: (data, item) => {
				return (
					<div className="flex justify-center items-center">
						<PrimaryTooltip content="Thông tin học viên" place="left" id={`view-st-${item?.Id}`}>
							<ButtonEye
								className="mr-[8px]"
								onClick={() => {
									router.push({
										pathname: '/info-course/student/detail',
										query: { StudentID: item.UserInformationId }
									})
								}}
							/>
						</PrimaryTooltip>

						{props.type !== 'student' && (
							<CreateUser
								isEdit
								roleStaff={roleStaff}
								defaultData={item}
								className="!hidden w700:!inline-flex"
								onRefresh={() => getUsers(apiParameters)}
								isStudent={false}
							/>
						)}

						{props.type == 'student' && (
							<CreateUser
								isEdit
								roleStaff={roleStaff}
								source={source}
								learningNeed={learningNeed}
								purpose={purpose}
								sale={sale}
								defaultData={item}
								className="!hidden w700:!inline-flex"
								onRefresh={() => getUsers(apiParameters)}
								isStudent={true}
							/>
						)}
						<DeleteTableRow text={`${item.RoleName} ${item.FullName}`} handleDelete={() => deleteUser(item.UserInformationId)} />
					</div>
				)
			}
		}
	]

	const changeAllow = async (param) => {
		setLoadingAllow(true)
		try {
			const response = await registerApi.changeRegister(param)
			if (response.status === 200) {
				if (!!reFresh) {
					reFresh()
				}
			}
		} catch (error) {
			console.error(error)
		} finally {
			setLoadingAllow(false)
		}
	}

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation.RoleId == 1
	}

	function isTeacher() {
		return userInformation.RoleId == 2
	}

	function isStdent() {
		return userInformation.RoleId == 3
	}

	const [visible, setVisible] = useState(false)

	function isShowRegister() {
		return isAdmin() && props.type == 'student' && !!allowRegister
	}

	return (
		<div className="info-course-student">
			<PrimaryTable
				columns={props.type === 'student' ? columnsStudent : columns}
				data={users}
				total={totalRow}
				loading={loading}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, PageIndex: event })}
				TitleCard={
					<>
						<Filters
							showBranch
							showSort
							filters={apiParameters}
							onSubmit={(event) => setApiParameters(event)}
							onReset={() => setApiParameters(initParamters)}
						/>
						<Input.Search
							className="primary-search max-w-[250px] ml-[8px]"
							onChange={(event) => {
								if (event.target.value == '') {
									setApiParameters({ ...apiParameters, PageIndex: 1, Search: '' })
								}
							}}
							onSearch={(event) => setApiParameters({ ...apiParameters, PageIndex: 1, Search: event })}
							placeholder="Tìm kiếm"
						/>
					</>
				}
				Extra={
					<>
						{isShowRegister() && (
							<PrimaryButton
								loading={loadingAllow}
								className="mr-2 btn-block-registration"
								type="button"
								icon={allowRegister ? 'cancel' : 'check'}
								background={allowRegister ? 'red' : 'green'}
								onClick={() => changeAllow(allowRegister ? 'UnAllow' : 'Allow')}
							>
								{allowRegister ? 'Cấm đăng ký' : 'Cho phép đăng ký'}
							</PrimaryButton>
						)}

						{props.type == 'student' && (
							<PrimaryButton
								className="mr-2 btn-download"
								type="button"
								icon="download"
								background="blue"
								onClick={() => {
									window.open(appConfigs.linkDownloadExcel)
								}}
							>
								File mẫu
							</PrimaryButton>
						)}

						{props.type == 'student' && <ImportStudent className="mr-1 btn-import" onFetchData={() => getUsers(apiParameters)} />}

						<Popover
							placement="bottomLeft"
							visible={visible}
							onVisibleChange={(event) => setVisible(event)}
							content={
								<div className="w-[220px]">
									{props.type == 'student' && allowRegister !== undefined && (
										<PrimaryButton
											loading={loadingAllow}
											className="mb-3 !w-full"
											type="button"
											icon={allowRegister ? 'cancel' : 'check'}
											background={allowRegister ? 'red' : 'green'}
											onClick={() => changeAllow(allowRegister ? 'UnAllow' : 'Allow')}
										>
											{allowRegister ? 'Cấm đăng ký' : 'Cho phép đăng ký'}
										</PrimaryButton>
									)}

									<CreateUser
										onOpen={() => setVisible(false)}
										className={`!w-full ${props.type == 'student' && 'mb-3'}`}
										onRefresh={() => getUsers(apiParameters)}
										isStudent={props.type === 'student' ? true : false}
									/>

									{!!apiParameters.Search && users.length == 0 && (
										<PrimaryButton
											className="!w-full mb-3"
											type="button"
											icon="cancel"
											background="yellow"
											onClick={() => setApiParameters(initParamters)}
										>
											Xoá bộ lọc
										</PrimaryButton>
									)}

									{props.type == 'student' && (
										<PrimaryButton
											className="!w-full mb-3"
											type="button"
											icon="download"
											background="blue"
											onClick={() => {
												window.open(appConfigs.linkDownloadExcel)
											}}
										>
											File mẫu
										</PrimaryButton>
									)}

									{props.type == 'student' && (
										<ImportStudent
											className="!w-full"
											onFetchData={() => {
												setVisible(false)
												getUsers(apiParameters)
											}}
										/>
									)}
								</div>
							}
							trigger="click"
						>
							<PrimaryButton
								onClick={() => setVisible(!visible)}
								className={`${props.type == 'student' ? 'btn-popover-student' : 'btn-popover-personel'} btn-popover`}
								type="button"
								background="primary"
							>
								<BsThreeDots />
							</PrimaryButton>
						</Popover>

						{props.type == 'student' && (
							<CreateUser
								roleStaff={roleStaff}
								source={source}
								learningNeed={learningNeed}
								purpose={purpose}
								sale={sale}
								className="btn-create"
								onRefresh={() => getUsers(apiParameters)}
								isStudent={true}
							/>
						)}

						{props.type !== 'student' && (
							<CreateUser roleStaff={roleStaff} className="btn-create" onRefresh={() => getUsers(apiParameters)} isStudent={false} />
						)}
					</>
				}
			/>
		</div>
	)
}

export default Student
