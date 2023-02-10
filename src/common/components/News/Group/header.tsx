import { Modal, Popover, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaUserPlus } from 'react-icons/fa'
import dirtyApi from '~/api/dirtyApi'
import { getPer, ShowNoti } from '~/common/utils'
import ModalFooter from '../../ModalFooter'
import GroupForm from './form'
import Avatar from '~/common/components/Avatar'
import { IoClose } from 'react-icons/io5'
import { useGlobalContext } from '~/common/Providers/MainProvider'

function GroupHeader({ group }) {
	const [details, setDetails] = useState<any>({})
	const [members, setMember] = useState<any>([])
	const { currentRole } = useGlobalContext()

	const [permission, setPermission] = useState([])
	const [userPermiss, setUserPermiss] = useState([])

	useEffect(() => {
		getPermission()
		getUserPermiss()
	}, [])

	async function getPermission() {
		try {
			const response = await dirtyApi.getPermission<any>(currentRole, 'NewsFeedGroup')
			if (response.data.resultCode == 200) {
				const theData: any = response?.data?.data
				setPermission(theData)
			}
		} catch (error) {}
	}

	async function getUserPermiss() {
		try {
			const response = await dirtyApi.getPermission<any>(currentRole, 'NewsFeedUserInGroup')
			console.log('---- NewsFeedUserInGroup Permission: ', response?.data?.data)
			if (response.data.resultCode == 200) {
				const theData: any = response?.data?.data
				setUserPermiss(theData)
			} else {
				setUserPermiss([])
			}
		} catch (error) {}
	}

	useEffect(() => {
		getNewsDetail()
		getStudentInGroup()
	}, [group])

	async function getNewsDetail() {
		try {
			const response: any = await dirtyApi.getByID<TListLiked>('NewsFeedGroup', group)
			console.log('NewsFeedComment Details: ', response.data)
			if (response.status == 200) {
				setDetails(response.data.data)
			} else {
				setDetails([])
				setMember([])
			}
		} catch (error) {}
	}

	const [showUser, setShowUser] = useState<any>(false)
	const [loading, setLoading] = useState<any>(false)

	useEffect(() => {
		if (!!showUser) {
			getStudents()
		}
	}, [showUser])

	function submitUserForm(params) {
		setLoading(true)

		let temp = []
		for (let i = 0; i < members.length; i++) {
			const thisMember = members[i]
			temp.push({ userId: thisMember, roleType: 0 })
		}

		const SUBMIT_DATA = { members: temp, newsFeedGroupId: group }
		console.log('SUBMIT_DATA: ', SUBMIT_DATA)
		postMember(SUBMIT_DATA)
	}

	const [students, setStudents] = useState([])

	async function getStudents() {
		try {
			const response = await dirtyApi.get<any>(`NewsFeedUserInGroup/user-not-in-group-newsfeed`, {
				newsFeedGroupId: group,
				pageIndex: 1,
				pageSize: 9999999
			})
			if (response.status == 200) {
				setStudents(response.data.data)
			} else {
				setStudents([])
			}
		} catch (error) {
			ShowNoti.error(error?.resultMessage)
		}
	}

	async function postMember(params) {
		try {
			const response = await dirtyApi.post(`NewsFeedUserInGroup`, params)
			if (response.status == 200) {
				getNewsDetail()
				getStudentInGroup()
				setShowUser(false)
			} else {
				getNewsDetail()
			}
		} catch (error) {
			ShowNoti.error(error?.resultMessage)
		} finally {
			setLoading(false)
		}
	}

	const [stuInGroup, setStuInGroup] = useState([])

	async function getStudentInGroup() {
		try {
			const response = await dirtyApi.get<any>(`NewsFeedUserInGroup`, { pageIndex: 1, pageSize: 9999999, newsFeedGroupId: group })
			if (response.status == 200) {
				setStuInGroup(response.data.data.items)
			} else {
				setStuInGroup([])
			}
		} catch (error) {}
	}

	async function deleteMem(params) {
		try {
			const response = await dirtyApi.delete(`NewsFeedUserInGroup`, params)
			if (response.status == 200) {
				getNewsDetail()
				ShowNoti.success('Thành công!')
				getStudentInGroup()
			} else {
				getNewsDetail()
			}
		} catch (error) {
			ShowNoti.error(error?.resultMessage)
		} finally {
			setLoading(false)
		}
	}

	const content = (
		<div className="w-[400px] max-h-[500px] scrollable">
			{stuInGroup.map((item, index) => {
				return (
					<div key={`jjsghsg-${index}`} className="flex row-center mb-[8px] p-[8px] hover:bg-[#eeeaea41] rounded-[6px]">
						<Avatar uri={item?.thumnail} className="w-[40px] h-[40px] mr-[16px]" />
						<div className="flex-1">
							<div className="font-[600]">{item?.fullName}</div>
							<div className={`font-[400] text-[#808080] ${item?.roleName == 'Admin' ? '!text-[#1E88E5] font-[500]' : ''}`}>
								{item?.roleName}
							</div>
						</div>
						<div
							onClick={() => deleteMem(item.id)}
							className="flex all-center h-[34px] w-[34px] hover:bg-[#eeeaea77] active:bg-[#eeeaea1b] cursor-pointer none-selection rounded-full"
						>
							<IoClose size={20} color="#F44336" />
						</div>
					</div>
				)
			})}
		</div>
	)

	return (
		<div className="w-full p-[16px] bg-[#fff] rounded-[6px] shadow-md">
			{!!details?.background && <img src={details?.background} className="object-cover w-[100%] h-[250px]" />}

			<div className="cc-hr my-[16px]" />

			<div className="flex row-center">
				<div className="cc-group-info flex-1">
					<h2>{details?.name}</h2>

					<div className="flex">
						<Popover content={content} title="Danh sách thành viên" placement="right">
							<div className="text-[#959595] cursor-pointer">
								{details?.membersAmount == 0 ? 'Chưa có thành viên' : `${details?.membersAmount} thành viên`}
							</div>
						</Popover>
					</div>
				</div>

				<>
					{getPer(userPermiss, 'NewsFeedUserInGroup-AddItem') && (
						<div className="cc-add-member" onClick={() => setShowUser(true)}>
							<FaUserPlus size={20} />
						</div>
					)}
					{getPer(permission, 'NewsFeedGroup-UpdateItem') && <GroupForm isEdit defaultData={details} onRefresh={getNewsDetail} />}
				</>
			</div>

			<Modal
				open={showUser}
				onCancel={() => setShowUser(false)}
				closable={true}
				centered
				width={700}
				title="Thành viên"
				footer={<ModalFooter buttonFull loading={loading} onCancel={() => setShowUser(false)} onOK={submitUserForm} />}
			>
				<div className="student-multi-select">
					<Select
						value={members || []}
						mode="multiple"
						allowClear
						disabled={loading}
						loading={loading}
						showSearch
						optionFilterProp="children"
						className="w-full"
						onChange={(event) => setMember(event)}
					>
						{students.map((item, index) => {
							return (
								<Select.Option value={item?.id} key={index + '-' + item?.id}>
									[{item?.code}] - {item?.fullName}
								</Select.Option>
							)
						})}
					</Select>
				</div>
			</Modal>
		</div>
	)
}

export default GroupHeader
