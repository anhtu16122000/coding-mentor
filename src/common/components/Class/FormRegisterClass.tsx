import { Form, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { billApi } from '~/api/business/bill'
import { studyTimeApi } from '~/api/configs/study-time'
import { programApi } from '~/api/learn/program'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import SelectField from '../FormControl/SelectField'
import ListClassReview from './ListClassReview'
import ListProgramReview from './ListProgramReview'
import ModalAddClass from './ModalAddClass'
import ModalAddProgram from './ModalAddProgram'

const dayOfWeek = [
	{
		title: 'Thứ 2',
		value: 1
	},
	{
		title: 'Thứ 3',
		value: 2
	},
	{
		title: 'Thứ 4',
		value: 3
	},
	{
		title: 'Thứ 5',
		value: 4
	},
	{
		title: 'Thứ 6',
		value: 5
	},
	{
		title: 'Thứ 7',
		value: 6
	},
	{
		title: 'Chủ nhật',
		value: 0
	}
]

const { Option } = Select

type StudyTime = {
	title: string
	value: number
}

const FormRegisterClass = (props) => {
	const dispatch = useDispatch()
	const { form, setClasses, classes, classesSelected, setClassesSelected, programsSelected, setProgramsSelected, handleListTimeFrames } =
		props
	const state = useSelector((state: RootState) => state)
	const branch = useSelector((state: RootState) => state.branch.Branch)
	const [curriculum, setCurriculum] = useState([])
	const [studyTime, setStudyTime] = useState<StudyTime[]>([])
	const [programs, setPrograms] = useState([])
	const [listTimeFrames, setListTimeFrames] = useState([{ Id: 1, ExectedDay: null, StudyTimeId: null, Note: '' }])
	const [listDisabledTimeFrames, setListDisabledTimeFrames] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const getAllStudyTime = async () => {
		try {
			const res = await studyTimeApi.getAll({ pageSize: 9999 })
			if (res.status === 200) {
				setStudyTime(parseSelectArray(res.data.data, 'Name', 'Id'))
			}
			if (res.status === 204) {
				setStudyTime([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		getPrograms()
		getAllStudyTime()
	}, [])

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
			ShowNoti('error', err.message)
		}
	}

	const getAvailableClasses = async (data) => {
		form.setFieldsValue({ branchId: data })

		if (!!form.getFieldValue('StudentId')) {
			try {
				const res = await billApi.getClassAvailable({ studentId: form.getFieldValue('StudentId'), branchId: data, paymentType: 1 })
				if (res.status === 200) {
					setClasses(res.data.data)
				}
				if (res.status == 204) {
					ShowNoti('warning', 'Không tìm thấy lớp phù hợp')
					setClasses([])
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	// console.log('--- programsSelected: ', programsSelected)

	return (
		<>
			<div className="col-span-2">
				<Form.Item required={true} rules={formRequired} label="Trung tâm" name="BranchId">
					<Select onChange={getAvailableClasses} showSearch allowClear className="primary-input" placeholder="Chọn trung tâm">
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
				<div className="wrapper-classes">
					<div className="flex items-center gap-2 mb-3">
						<p className="title">Lớp học</p>
						<ModalAddClass
							classes={classes}
							classesSelected={classesSelected}
							setClassesSelected={setClassesSelected}
							setClasses={setClasses}
							form={form}
						/>
					</div>
					<ListClassReview classesSelected={classesSelected} setClassesSelected={setClassesSelected} setClasses={setClasses} />
				</div>
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
							type="default"
						/>
					</div>

					<ListProgramReview programsSelected={programsSelected} setProgramsSelected={setProgramsSelected} setPrograms={setPrograms} />
				</div>
			</div>

			{/* {programsSelected?.length > 0 && (
				<div className="col-span-2">
					<div className="relative">
						<button className="absolute top-0 right-0 z-10 -translate-x-2/4" type="button" onClick={handleAddListTimeFrame}>
							<AiFillPlusCircle size={22} />
						</button>
						<Form.Item label="Khung thời gian" className="mb-0">
							{!!listTimeFrames &&
								listTimeFrames.map((timeFrame) => {
									return (
										<div className="relative" key={timeFrame.Id}>
											<button type="button" className="absolute top-0 right-0 z-10" onClick={() => handleRemoveListTimeFrame(timeFrame.Id)}>
												<AiFillMinusCircle size={22} />
											</button>
											<div className="row">
												<div className="col-md-6 col-12">
													<SelectField
														placeholder="Chọn thứ"
														optionList={dayOfWeek}
														name={`ExectedDay-${timeFrame.Id}`}
														label="Thứ"
														onChangeSelect={(value) => handleChangeTimeFrame(timeFrame.Id, 'ExectedDay', value)}
														isRequired
														rules={formRequired}
													/>
												</div>
												<div className="col-md-6 col-12">
													<Form.Item name={`StudyTimeId-${timeFrame.Id}`} label={'Ca'} required={true} rules={formRequired}>
														<Select
															className={`primary-input`}
															showSearch
															allowClear
															loading={isLoading}
															placeholder={'Chọn ca học'}
															optionFilterProp="children"
															onChange={(value) => {
																handleChangeTimeFrame(timeFrame.Id, 'StudyTimeId', value)
															}}
														>
															{studyTime &&
																studyTime.map((o, idx) => {
																	return (
																		<Option disabled={handleDisableSelect(timeFrame, o.value)} key={idx} value={o.value}>
																			{o.title}
																		</Option>
																	)
																})}
														</Select>
													</Form.Item>
												</div>
											</div>
											<div style={{ marginTop: -10 }}>
												<Form.Item name={`Note-${timeFrame.Id}`} label={'Ghi chú'}>
													<Input
														style={{ borderRadius: 5 }}
														placeholder="Nhập ghi chú"
														onChange={(v) => handleChangeTimeFrame(timeFrame.Id, 'Note', v.target.value)}
													/>
												</Form.Item>
											</div>
										</div>
									)
								})}
						</Form.Item>
					</div>
				</div>
			)} */}
		</>
	)
}

export default FormRegisterClass
