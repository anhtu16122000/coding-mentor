import { LoadingOutlined } from '@ant-design/icons'
import { Avatar, Input, Modal, Popover } from 'antd'
import { useEffect, useState } from 'react'
import { FaUserPlus } from 'react-icons/fa'
import { IoClose, IoPersonAddSharp } from 'react-icons/io5'
import RestApi from '~/api/RestApi'
import { userInNewsFeedGroup } from '~/api/user'
import { ShowNostis } from '~/common/utils'
import GroupForm from './form'

const { Search } = Input

function GroupHeader({ groupId }) {
	const [details, setDetails] = useState<any>({})

	useEffect(() => {
		getNewsDetail()
		getStudentInGroup()
	}, [groupId])

	async function getNewsDetail() {
		try {
			const response = await RestApi.getByID<any>('NewsFeedGroup', groupId)
			if (response.status == 200) {
				setDetails(response.data.data)
			} else {
				setDetails([])
			}
		} catch (error) {}
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
			}
		} catch (error) {
			ShowNostis.error(error?.resultMessage)
		}
	}

	const [stuInGroup, setStuInGroup] = useState([])
	const [stuFinded, setStuFinded] = useState([])

	async function getStudentInGroup() {
		try {
			const response = await RestApi.get<any>(`UserInNewsFeedGroup`, { newsFeedGroupId: groupId })
			setStuInGroup(response.data.data)
		} catch (error) {
			console.log('🚀 ~ file: header.tsx:135 ~ getStudentInGroup ~ error', error)
		}
	}

	const handleSearchUser = (value) => {
		if (value.trim().length < 1) return setStuFinded(studentsNotInGroup)

		const studentFinded = studentsNotInGroup.filter((student) => {
			return student.FullName.toLowerCase().includes(value.toLowerCase())
		})
		setStuFinded(studentFinded)
	}

	const content = (
		<div className="w-[400px] max-h-[500px] scrollable">
			{stuInGroup &&
				stuInGroup.map((item) => {
					return (
						<GroupHeader.UserItem
							key={`key:>-${Date.now() + Math.random() * 10000}`}
							onRefresh={() => {
								getStudentInGroup()
								getNewsDetail()
							}}
							groupId={groupId}
							item={item}
							isMember={true}
						/>
					)
				})}
		</div>
	)

	return (
		<div className="w-[calc(100%-8px)] ml-[3px] p-[16px] bg-[#fff] rounded-[6px] shadow-md">
			{!!details?.BackGround && <img src={details?.BackGround} className="object-cover w-[100%] h-[250px]" />}

			<div className="cc-hr my-[16px]" />

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

				<>
					<div className="cc-add-member" onClick={() => setShowUser(true)}>
						<FaUserPlus size={20} />
					</div>
					<GroupForm isEdit defaultData={details} onRefresh={getNewsDetail} />
				</>
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
					{studentsNotInGroup &&
						stuFinded &&
						stuFinded.map((item) => (
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
				Members: [
					{
						UserId: item.UserInformationId || item.Id,
						Type: 2
					}
				]
			})

			await onRefresh()

			ShowNostis.success('Thành Công')
		} catch (error) {
			ShowNostis.error(error?.resultMessage)
		}
		setLoading(false)
	}

	const handleDeleteMember = async () => {
		try {
			await userInNewsFeedGroup.deleteMember(item.UserInformationId || item.Id)
			await onRefresh()
			ShowNostis.success('Thành Công')
		} catch (error) {
			ShowNostis.error(error?.resultMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex row-center mb-[8px] p-[8px] hover:bg-[#eeeaea41] rounded-[6px]">
			<Avatar src={item.Avatar || '/images/default-avatar.svg'} className="w-[40px] h-[40px] mr-[16px] shadow-sm " />
			<div className="flex-1">
				<div className="font-[600]">{item?.FullName}</div>
				<div className={`font-[400] text-[#808080] ${item?.RoleName == 'Admin' ? '!text-[#1E88E5] font-[500]' : ''}`}>{item?.RoleName}</div>
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
