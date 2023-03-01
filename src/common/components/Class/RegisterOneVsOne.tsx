import { Form, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { programApi } from '~/api/program'
import { formRequired } from '~/common/libs/others/form'
import { ShowNostis, ShowNoti, log } from '~/common/utils'
import { RootState } from '~/store'
import ModalAddProgram from './ModalAddProgram'
import ListProgramReview from './ListProgramReview'
import { curriculumApi } from '~/api/curriculum'
import Avatar from '../Avatar'

type TRegisterOneVsOne = {
	form?: any
	programsSelected?: any
	setProgramsSelected?: Function
	setCurriculum?: Function
	curriculum?: any
}

const RegisterOneVsOne: FC<TRegisterOneVsOne> = (props) => {
	const { form, programsSelected, setProgramsSelected, setCurriculum, curriculum } = props

	const branch = useSelector((state: RootState) => state.branch.Branch)

	const [programs, setPrograms] = useState([])
	const [curriculums, setCurriculums] = useState([])
	const [curriculumDetails, setCurriculumDetails] = useState(null)

	useEffect(() => {
		getPrograms()

		if (programsSelected.length > 1) {
			setProgramsSelected([programsSelected[0]])
		}
	}, [])

	useEffect(() => {
		if (!curriculum) {
			curriculums.length > 0 && setCurriculums([])
			!!curriculumDetails && setCurriculumDetails(null)
		}
	}, [curriculum])

	const [loading, setLoading] = useState('')

	const getPrograms = async () => {
		try {
			const res = await programApi.getAll()
			if (res.status == 200) {
				setPrograms(res.data.data)
			}
			if (res.status == 204) {
				setPrograms([])
			}
		} catch (err) {
			ShowNostis.error(err?.message)
		}
	}

	function onChangeBranch(params) {
		form.setFieldsValue({ branchId: params })
	}

	const getCurriculums = async (programId) => {
		setLoading('curriculum')
		try {
			const res = await curriculumApi.getAll({ pageSize: 9999, programId: programId })
			if (res.status == 200) {
				setCurriculums(res.data.data)
			}
			if (res.status == 204) {
				setCurriculums([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading('')
		}
	}

	const getCurriculumDetails = async (curriculumId) => {
		setLoading('curriculumDetails')
		setCurriculum(curriculumId)
		try {
			const res = await curriculumApi.getDetails(curriculumId)
			if (res.status == 200) {
				setCurriculumDetails(res.data.data)
			}
			if (res.status == 204) {
				setCurriculumDetails(null)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading('')
		}
	}

	useEffect(() => {
		if (programsSelected.length > 0) {
			getCurriculums(programsSelected[0]?.Id)

			// log.Green('programsSelected: ', programsSelected)
		}
	}, [programsSelected])

	// Trung tâm
	// Chương Trình
	// Giáo trình
	// Thông tin giáo trình

	return (
		<>
			<div className="col-span-2">
				<Form.Item required={true} rules={formRequired} label="Trung tâm" name="BranchId">
					<Select onChange={onChangeBranch} showSearch allowClear className="primary-input" placeholder="Chọn trung tâm">
						{branch.map((item) => {
							return (
								<Select.Option key={item.Id} value={item.Id}>
									{item.Name}
								</Select.Option>
							)
						})}
					</Select>
				</Form.Item>
			</div>
			<div className="col-span-2">
				<div className="wrapper-programs">
					<div className="flex items-center gap-2 mb-3">
						<p className="title">Chương trình mong muốn</p>
						<ModalAddProgram
							programs={programs}
							programsSelected={programsSelected}
							setProgramsSelected={setProgramsSelected}
							setPrograms={setPrograms}
							type="1-1"
						/>
					</div>
					<ListProgramReview
						type="1-1"
						programsSelected={programsSelected}
						setProgramsSelected={setProgramsSelected}
						setPrograms={setPrograms}
					/>
				</div>
			</div>

			<div className="col-span-2">
				<Form.Item required={true} rules={formRequired} label="Giáo trình" name="CurriculumId">
					<Select
						loading={loading == 'curriculum'}
						onChange={getCurriculumDetails}
						showSearch
						allowClear
						className="primary-input"
						placeholder="Chọn giáo trình"
					>
						{curriculums.map((item) => {
							return (
								<Select.Option key={item.Id} value={item.Id}>
									{item.Name}
								</Select.Option>
							)
						})}
					</Select>
				</Form.Item>

				<div>
					{!!curriculumDetails?.Id && (
						<div className="wrapper-item-class border-[1px] border-[#d9d9d9] rounded-[6px] px-[10px] py-[8px]">
							<Avatar className="w-[80px] h-[80px]" uri="/the-book-02.png" />
							<div className="wrapper-info-class ml-[16px]">
								<p className="text-[#1E88E5] text-[16px]">
									<span className="font-bold">{curriculumDetails?.Name}</span>
								</p>
								<p className="my-[-4px]">
									<span className="title">Số buổi học:</span>
									<span className="font-normal ml-1">{curriculumDetails?.Lesson}</span>
								</p>
								<p>
									<span className="title">Thời gian mỗi buổi:</span>
									<span className="font-normal ml-1">{curriculumDetails?.Time} phút</span>
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default RegisterOneVsOne
