import { LoadingOutlined } from '@ant-design/icons'
import { Empty, Input, Modal, Popover, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { FaUserPlus } from 'react-icons/fa'
import { IoClose, IoPersonAddSharp } from 'react-icons/io5'
import RestApi from '~/api/RestApi'
import { userInNewsFeedGroup } from '~/api/user'
import { ShowNostis } from '~/common/utils'
import GroupForm from './form'
import Avatar from '../../Avatar'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const { Search } = Input

const CustomSkeleton = (props) => {
	const { className } = props

	return (
		<div className="flex items-center p-[8px]">
			<Skeleton.Avatar size="large" />
			<div className="flex-1">
				<Skeleton active className={`ml-[16px] w-[60%] ${className}`} paragraph={false} />
			</div>
			<Skeleton active className="ml-[16px] w-[30px]" paragraph={false} />
		</div>
	)
}

function GroupHeader({ groupId }) {
	const [details, setDetails] = useState<any>({})
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		getAllData()
	}, [groupId])

	function getAllData() {
		getNewsDetail()
		getStudentInGroup()
	}

	async function getNewsDetail() {
		try {
			const response = await RestApi.getByID<any>('NewsFeedGroup', groupId)
			if (response.status == 200) {
				setDetails(response.data.data)
			} else {
				setDetails({})
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const [showUser, setShowUser] = useState<any>(false)

	useEffect(() => {
		if (!!showUser) {
			getStudentNotInGroup()
		}
	}, [showUser])

	const [studentsNotInGroup, setStudentsNotInGroup] = useState([])

	async function getStudentNotInGroup() {
		try {
			const response = await userInNewsFeedGroup.getUserNotIn(groupId)

			if (response.status == 200) {
				setStudentsNotInGroup(response.data.data)
				setStuFinded(response.data.data)
			} else {
				setStudentsNotInGroup([])
				setStuFinded([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [stuInGroup, setStuInGroup] = useState([])
	const [stuFinded, setStuFinded] = useState([])

	async function getStudentInGroup() {
		try {
			const response = await RestApi.get<any>(`UserInNewsFeedGroup`, { newsFeedGroupId: groupId })
			if (response.status == 200) {
				setStuInGroup(response.data.data)
			} else {
				setStuInGroup([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const handleSearchUser = (value) => {
		if (value.trim().length < 1) return setStuFinded(studentsNotInGroup)

		const studentFinded = studentsNotInGroup.filter((student) => {
			return student.FullName.toLowerCase().includes(value.toLowerCase())
		})
		setStuFinded(studentFinded)
	}

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isAccountant() {
		return userInformation?.RoleId == 6
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	const content = (
		<div className="w-[400px] max-h-[500px] scrollable">
			{stuInGroup.map((item) => {
				return (
					<GroupHeader.UserItem
						key={`key:>-${Date.now() + Math.random() * 10000}`}
						onRefresh={getAllData}
						groupId={groupId}
						item={item}
						isMember={true}
					/>
				)
			})}

			{stuInGroup.length == 0 && <Empty />}
		</div>
	)

	return (
		<div className="w-[calc(100%-8px)] ml-[3px] p-[16px] bg-[#fff] rounded-[6px] shadow-md">
			{!!details?.BackGround && (
				<>
					<div className="cc-hr my-[16px]" />
					<img src={details?.BackGround} className="object-cover w-[100%] h-[250px]" />
				</>
			)}

			<div className="flex row-center">
				<div className="flex-1 cc-group-info">
					<h2>{details?.Name}</h2>

					<div className="flex">
						<Popover content={content} title="Danh sách thành viên" placement="right">
							<div className="text-[#959595] cursor-pointer">
								{details?.Members == 0 ? 'Chưa có thành viên' : `${details?.Members} thành viên`}
							</div>
						</Popover>
					</div>
				</div>

				{(isAdmin() || isTeacher() || isManager() || isAcademic()) && (
					<>
						<div className="cc-add-member" onClick={() => setShowUser(true)}>
							<FaUserPlus size={20} />
						</div>
						<GroupForm isEdit defaultData={details} onRefresh={getNewsDetail} />
					</>
				)}
			</div>

			<Modal
				className="min-h-[650px]"
				open={showUser}
				onCancel={() => setShowUser(false)}
				closable={true}
				centered
				title="Danh sách người dùng"
				footer={null}
			>
				<Search
					placeholder="Tìm kiếm  ..."
					className="w-full mb-2 rounded-lg cc_search_input"
					style={{ borderRadius: '8px' }}
					onSearch={handleSearchUser}
				/>

				<div className="max-h-[500px] scrollable">
					{loading && (
						<div>
							<CustomSkeleton />
							<CustomSkeleton className="!w-[30%]" />
							<CustomSkeleton className="!w-[70%]" />
							<CustomSkeleton className="!w-[20%]" />
						</div>
					)}

					{!loading && (
						<>
							{stuFinded.map((item) => (
								<GroupHeader.UserItem
									key={`key:>-${Date.now() + Math.random() * 10000}`}
									onRefresh={() => {
										getStudentNotInGroup()
										getNewsDetail()
									}}
									groupId={groupId}
									item={item}
								/>
							))}
						</>
					)}
				</div>
			</Modal>
		</div>
	)
}

export default GroupHeader

GroupHeader.UserItem = (props) => {
	const { item, groupId, onRefresh, isMember = false } = props
	const [loading, setLoading] = useState<any>(false)

	const handleAddUser = async () => {
		setLoading(true)
		try {
			await userInNewsFeedGroup.addMember({
				NewsFeedGroupId: groupId,
				Members: [{ UserId: item.UserInformationId || item.Id, Type: 2 }]
			})

			await onRefresh()

			ShowNostis.success('Thành Công')
		} catch (error) {
			ShowNostis.error(error?.message)
		}
		setLoading(false)
	}

	const handleDeleteMember = async () => {
		try {
			await userInNewsFeedGroup.deleteMember(item.UserInformationId || item.Id)
			await onRefresh()
			ShowNostis.success('Thành Công')
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex row-center mb-[8px] p-[8px] hover:bg-[#eeeaea41] rounded-[6px]">
			<Avatar disabled uri={item.Avatar} className="w-[40px] h-[40px] mr-[16px] shadow-sm " />

			<div className="flex-1">
				<div className="font-[600]">{item?.FullName}</div>
				<div className="font-[400] text-[#808080]">{item.TypeName}</div>
			</div>
			<div
				onClick={() => (!loading && isMember ? handleDeleteMember() : handleAddUser())}
				className="flex all-center h-[34px] w-[34px] hover:bg-[#eeeaea77] active:bg-[#eeeaea1b] cursor-pointer none-selection rounded-full"
			>
				{loading ? <LoadingOutlined /> : isMember ? <IoClose size={20} color="#F44336" /> : <IoPersonAddSharp size={20} color="#2374E1" />}
			</div>
		</div>
	)
}
