import { Empty, Modal, Select, Skeleton } from 'antd'
import Router from 'next/router'
import React, { useState } from 'react'
import { BiAddToQueue } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { examApi } from '~/api/exam'
import { examGroupsApi } from '~/api/exam/group'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { setCurrentPackage, setTotalPoint } from '~/store/globalState'
import Group from './group'

function AddQuestFromList(props) {
	const { onOpen, section, style } = props

	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	const [groups, setGroups] = useState([])
	const [groupSelected, setGroupSelected] = useState([])

	async function getAllGroups(level?: number) {
		setLoading(true)
		try {
			const response = await examGroupsApi.get({ level: !!level ? level : null, notExistInExam: Router.query?.slug })
			if (response.status === 200) {
				setGroups(response.data.data)
			} else {
				setGroups([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	const dispatch = useDispatch()

	// Làm mới dữ liệu
	async function getDetail() {
		try {
			const response: any = await examApi.getDetailByID(parseInt(Router.query?.slug + ''))
			if (response.status === 200) {
				dispatch(setCurrentPackage(response.data.data))
				dispatch(setTotalPoint(response.data.totalPoint))
			} else {
				dispatch(setCurrentPackage([]))
				dispatch(setTotalPoint(0))
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	async function _submit() {
		const DATA_SUBMIT = { ExamSectionId: section?.Id, Items: groupSelected }
		console.log('SUBMIT DATA: ', DATA_SUBMIT)

		try {
			const response = await examApi.addGroup(DATA_SUBMIT)
			if (response.status === 200) {
				ShowNoti('success', response.data?.message)
				getDetail()
				setVisible(false)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	function formatData(param) {
		const tempExercises = []

		param?.Exercises.forEach((element) => {
			tempExercises.push({
				Id: element?.Id,
				Point: element?.Point,
				isQuickAdd: true
			})
		})

		return {
			Id: param?.Id,
			ExerciseItems: tempExercises,
			isQuickAdd: true
		}
	}

	const [timeStamp, setTimeStamp] = useState(0)

	async function onCheckedGroup(event, group) {
		const dataFormated = await formatData(group)

		if (event) {
			groupSelected.push(dataFormated)
			setGroupSelected(groupSelected)
		} else {
			let temp = []
			groupSelected.forEach((element) => {
				if (element?.Id != group?.Id) {
					temp.push(element)
				}
			})
			setGroupSelected(temp)
		}

		setTimeStamp(new Date().getTime())
	}

	return (
		<>
			<div
				onClick={() => {
					setGroups([])
					onOpen()
					setVisible(true)
					getAllGroups()
				}}
				className="p-2 w-full !text-[#3cc655] hover:!text-[#3cc655] rounded-[4px] inline-flex items-center font-[600] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer active:!bg-[rgba(0,0,0,0.1)]"
			>
				<BiAddToQueue size={18} className="mr-2 mt-[-2px]" />
				Thêm từ đề khác
			</div>

			<Modal
				width={700}
				title="Danh sách câu hỏi"
				visible={visible}
				centered
				onCancel={() => setVisible(false)}
				footer={
					<>
						<PrimaryButton disable={loading} onClick={() => setVisible(false)} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton loading={loading} onClick={_submit} className="ml-2" background="blue" icon="save" type="button">
							Thêm vào nhóm
						</PrimaryButton>
					</>
				}
			>
				<div className="mb-3">
					<div className="inline-flex items-center">
						<div className="font-[500] mr-2">Cấp độ:</div>
						<Select onChange={(event) => getAllGroups(event)} className="primary-input w-[150px]" defaultValue={null}>
							<Select.Option value={null}>Tất cả</Select.Option>
							<Select.Option value="Normal">Dễ</Select.Option>
							<Select.Option value={2}>Trung bình</Select.Option>
							<Select.Option value={3}>Khó</Select.Option>
						</Select>
					</div>

					<hr className="mt-3 border-[#acacac]" />
				</div>

				{groups.length == 0 && loading && (
					<>
						<Skeleton />
						<Skeleton className="mt-4 w-[70%]" />
					</>
				)}

				{!loading && groups.length == 0 && <Empty className="my-[50px]" description="Không có dữ liệu" />}

				{groups.length > 0 && (
					<div className="inner-import-question scrollable mr-[-5px] pr-[5px]">
						{groups.map((item, index) => {
							return <Group group={item} groupIndex={index} onChange={onCheckedGroup} />
						})}
					</div>
				)}
			</Modal>
		</>
	)
}

export default AddQuestFromList
