import React, { useEffect, useState } from 'react'
import { accountApi } from '~/api/dev/account'
import { Spin, Table, Form, Input } from 'antd'
import { useDispatch } from 'react-redux'
import { setUser } from '~/store/userReducer'
import { setListClass, setStatusData, setTotalClass } from '~/store/classReducer'
import { playWithToken } from '~/common/utils/token-handle'
import { ShowNostis } from '~/common/utils'

import styles from './styles.module.scss'

const roleClass =
	'h-[32px] px-[8px] rounded-[8px] flex items-center justify-center border-[1px] border-[#d2d2d2] text-[#000] text-[14px] font-[600] cursor-pointer none-selection'

function categorizeUsers(userArray) {
	const result = {
		admins: [],
		teachers: [],
		students: [],
		parents: [],
		others: []
	}

	userArray.forEach((user) => {
		switch (user.RoleName) {
			case 'Admin':
				result.admins.push(user)
				break
			case 'Giảng viên':
				result.teachers.push(user)
				break
			case 'Giáo viên':
				result.teachers.push(user)
				break
			case 'Học sinh':
				result.students.push(user)
				break
			case 'Học viên':
				result.students.push(user)
				break
			case 'Phụ huynh':
				result.parents.push(user)
				break
			default:
				result.others.push(user)
		}
	})

	return result
}

const MonaSupportPattern = () => {
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)

	const [curShowing, setCurShowing] = useState<IDataAccount[]>([])
	const [allAccounts, setAllAccounts] = useState<IDataAccount[]>([])
	const [accounts, setAccounts] = useState({
		admins: [],
		teachers: [],
		students: [],
		parents: [],
		others: []
	})

	const [showingNumber, setShowingNumber] = useState<number>(1)

	useEffect(() => {
		if (showingNumber == 1) {
			setCurShowing(allAccounts)
		}
		if (showingNumber == 2) {
			setCurShowing(accounts.admins)
		}
		if (showingNumber == 3) {
			setCurShowing(accounts.teachers)
		}
		if (showingNumber == 4) {
			setCurShowing(accounts.students)
		}
		if (showingNumber == 5) {
			setCurShowing(accounts.parents)
		}
		if (showingNumber == 6) {
			setCurShowing(accounts.others)
		}
	}, [showingNumber])

	const columns = [
		{
			title: 'ID',
			dataIndex: 'Id',
			key: 'Id'
		},
		{
			title: 'Chứ vụ',
			dataIndex: 'RoleName',
			key: 'RoleName',
			render: (value, item) => {
				if (value == 'Admin') {
					return (
						<div className="flex justify-start">
							<div className="py-[1px] px-[8px] rounded-[4px] bg-[#1976D2]">
								<div className="font-[600] text-[#fff]">{value}</div>
							</div>
						</div>
					)
				}

				if (value == 'Giáo viên' || value == 'Giảng viên') {
					return (
						<div className="flex justify-start">
							<div className="py-[1px] px-[8px] rounded-[4px] bg-[#009688]">
								<div className="font-[600] text-[#fff]">{value}</div>
							</div>
						</div>
					)
				}

				if (value == 'Học viên' || value == 'Học sinh') {
					return (
						<div className="flex justify-start">
							<div className="py-[1px] px-[8px] rounded-[4px] bg-[#9C27B0]">
								<div className="font-[600] text-[#fff]">{value}</div>
							</div>
						</div>
					)
				}

				if (value == 'Phụ huynh') {
					return (
						<div className="flex justify-start">
							<div className="py-[1px] px-[8px] rounded-[4px] bg-[#F4511E]">
								<div className="font-[600] text-[#fff]">{value}</div>
							</div>
						</div>
					)
				}

				return (
					<div className="flex justify-start">
						<div className="py-[1px] px-[8px] rounded-[4px] bg-[#777777]">
							<div className="font-[600] text-[#fff]">{value}</div>
						</div>
					</div>
				)
			}
		},
		{
			title: 'Họ tên',
			dataIndex: 'FullName',
			key: 'FullName',
			render: (value, item) => {
				return <div className="font-[600] text-[#1976D2]">{value}</div>
			}
		}
	]

	const getAccounts = async () => {
		try {
			const res = await accountApi.getAccount()
			if (res.status == 200) {
				const categorizedUsers = categorizeUsers(res.data.data)
				setAccounts(categorizedUsers)

				setAllAccounts(res.data.data)
				setCurShowing(res.data.data)
			}
		} catch (error) {
			alert(error.message)
		}
	}

	useEffect(() => {
		getAccounts()
		dispatch(setUser(null))
		dispatch(setListClass([]))
		dispatch(setTotalClass(0))
		dispatch(setStatusData({ closing: 0, opening: 0, totalRow: 0, upcoming: 0 }))
	}, [])

	const onSubmit = async (data) => {
		try {
			setLoading(true)
			const res = await accountApi.loginDev(data)
			if (res.status == 200) {
				playWithToken(res?.data, dispatch)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
			setLoading(false)
		}
	}

	return (
		<div className="mx-auto max-w-[750px]">
			<Form form={form} onFinish={onSubmit}>
				<div className="mx-[24px] mt-[24px] flex">
					<Form.Item name="PassDev" className="mr-[16px]">
						<Input defaultValue="" placeholder="Super password" className="border-[1px] rounded-md mr-4 p-2 text-xl" />
					</Form.Item>
					<Form.Item name="Id" className="mr-[16px]">
						<Input className="border-[1px] rounded-md mr-4 p-2 text-xl" placeholder="" />
					</Form.Item>
					<button className="bg-tw-orange text-white h-[40px] px-4 rounded font-semibold" type="submit">
						Cook {loading && <Spin className="loading-spin" />}
					</button>
				</div>
			</Form>

			<div className="my-[16px] mt-[-8] mx-[24px] w-[90%] flex flex-row flex-wrap justify-start items-start gap-[16px]">
				<div onClick={() => setShowingNumber(1)} className={`${roleClass} ${showingNumber != 1 ? '' : 'bg-[#E91E63] text-[#fff]'}`}>
					<div>Tất cả ({allAccounts.length})</div>
				</div>

				<div onClick={() => setShowingNumber(2)} className={`${roleClass} ${showingNumber != 2 ? '' : 'bg-[#E91E63] text-[#fff]'}`}>
					<div>Admin ({accounts.admins.length})</div>
				</div>

				<div onClick={() => setShowingNumber(3)} className={`${roleClass} ${showingNumber != 3 ? '' : 'bg-[#E91E63] text-[#fff]'}`}>
					<div>Giáo viên ({accounts.teachers.length})</div>
				</div>

				<div onClick={() => setShowingNumber(4)} className={`${roleClass} ${showingNumber != 4 ? '' : 'bg-[#E91E63] text-[#fff]'}`}>
					<div>Học viên ({accounts.students.length})</div>
				</div>

				<div onClick={() => setShowingNumber(5)} className={`${roleClass} ${showingNumber != 5 ? '' : 'bg-[#E91E63] text-[#fff]'}`}>
					<div>Phụ huynh ({accounts.parents.length})</div>
				</div>

				<div onClick={() => setShowingNumber(6)} className={`${roleClass} ${showingNumber != 6 ? '' : 'bg-[#E91E63] text-[#fff]'}`}>
					<div>Khác ({accounts.others.length})</div>
				</div>
			</div>

			<div className={styles['hacked-table']}>
				<Table pagination={false} size="small" columns={columns} dataSource={curShowing} />
			</div>
		</div>
	)
}

export default MonaSupportPattern
