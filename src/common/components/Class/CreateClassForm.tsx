import { Form, Modal, Select, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/branch'
import { classApi } from '~/api/class'
import { curriculumApi } from '~/api/curriculum'
import { gradeApi } from '~/api/grade'
import { programApi } from '~/api/program'
import { roomApi } from '~/api/room'
import { studyTimeApi } from '~/api/study-time'
import { userInformationApi } from '~/api/user'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray, parseSelectArrayUser } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'
import { setSpecialize } from '~/store/specializeReducer'
import { setStudyTime } from '~/store/studyTimeReducer'
import DatePickerField from '../FormControl/DatePickerField'
import InputNumberField from '../FormControl/InputNumberField'
import InputTextField from '../FormControl/InputTextField'
import SelectField from '../FormControl/SelectField'
import UploadImageField from '../FormControl/UploadImageField'
import PrimaryButton from '../Primary/Button'
import * as yup from 'yup'
import { formRequired } from '~/common/libs/others/form'
import { setRoom } from '~/store/classReducer'
import { removeCommas } from '~/common/utils/super-functions'

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

const CreateClassForm = (props) => {
	const { isOnline, onSubmit, refPopoverWrapperBtn } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [program, setProgram] = useState([])
	const [curriculum, setCurriculum] = useState([])
	const [noneConvertCurriculum, setNoneConvertCurriculum] = useState([])
	const [teacher, setTeacher] = useState([])
	const [academic, setAcademic] = useState([])
	// Program lúc chưa parse
	const [programs, setPrograms] = useState([])
	const [listTimeFrames, setListTimeFrames] = useState([{ Id: 1, DayOfWeek: null, StudyTimeId: null }])
	const [listDisabledTimeFrames, setListDisabledTimeFrames] = useState([])
	const state = useSelector((state: RootState) => state)
	const room = useSelector((state: RootState) => state.class.room)
	const user = useSelector((state: RootState) => state.user.information)
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	function isAcademic() {
		return user?.RoleId == 7
	}
	let schema = yup.object().shape({
		BranchId: yup.string().required('Bạn không được để trống'),
		Name: yup.string().required('Bạn không được để trống'),
		GradeId: yup.string().required('Bạn không được để trống'),
		ProgramId: yup.string().required('Bạn không được để trống'),
		AcademicId: yup.string().required('Bạn không được để trống'),
		TeacherId: yup.string().required('Bạn không được để trống'),
		CurriculumId: yup.string().required('Bạn không được để trống'),
		StartDay: yup.string().required('Bạn không được để trống'),
		TeachingFee: yup.string().required('Bạn không được để trống'),
		Price: yup.string().required('Bạn không được để trống')
	})
	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}
	const branch = useMemo(() => {
		if (state.branch.Branch.length !== 0) {
			return parseSelectArray(state.branch.Branch, 'Name', 'Id')
		}
	}, [state])
	const specialize = useMemo(() => {
		if (state.specialize.Specialize.length !== 0) {
			return parseSelectArray(state.specialize.Specialize, 'Name', 'Id')
		}
	}, [state])
	const studyTime = useMemo(() => {
		if (state.studyTime.StudyTime.length !== 0) {
			return parseSelectArray(state.studyTime.StudyTime, 'Name', 'Id')
		}
	}, [state])
	const getAllBranch = async () => {
		try {
			const res = await branchApi.getAll({ pageSize: 9999 })
			if (res.status === 200) {
				dispatch(setBranch(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setBranch([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const getAllSpecialize = async () => {
		try {
			const res = await gradeApi.getAll({ pageSize: 9999 })
			if (res.status === 200) {
				dispatch(setSpecialize(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setSpecialize([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const getAllStudyTime = async () => {
		try {
			const res = await studyTimeApi.getAll({ pageSize: 9999 })
			if (res.status === 200) {
				dispatch(setStudyTime(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setStudyTime([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const getUserInfomationAcademic = async () => {
		try {
			const res = await userInformationApi.getAll({ pageSize: 9999, roleIds: 7 })
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'FullName', 'UserInformationId')
				setAcademic(convertData)
			}
			if (res.status === 204) {
				setAcademic([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const getAllRoomByBranch = async (branchId) => {
		try {
			const res = await roomApi.getAll({ pageSize: 9999, branchId: branchId })
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				dispatch(setRoom(convertData))
			}
			if (res.status === 204) {
				dispatch(setRoom([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const getAllProgramByGrade = async (gradeId) => {
		try {
			const res = await programApi.getAll({ pageSize: 9999, gradeId: gradeId })
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				setPrograms(res.data.data)
				setProgram(convertData)
			}
			if (res.status === 204) {
				setProgram([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const getAllCurriculumByProgram = async (programId) => {
		try {
			const res = await curriculumApi.getAll({ pageSize: 9999, programId: programId })
			if (res.status === 200) {
				setNoneConvertCurriculum(res.data.data)
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				setCurriculum(convertData)
			}
			if (res.status === 204) {
				setCurriculum([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const getAllTeacherByBranchAndProgram = async (branchId, programId) => {
		try {
			const res = await classApi.getAllTeacherWhenCreate({ branchId: branchId, programId: programId })
			if (res.status === 200) {
				const convertData = parseSelectArrayUser(res.data.data, 'TeacherName', 'TeacherCode', 'TeacherId')
				setTeacher(convertData)
			}
			if (res.status === 204) {
				setTeacher([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const handleAddListTimeFrame = () => {
		setListTimeFrames((prev) => {
			return [...listTimeFrames, { Id: prev[prev.length - 1].Id + 1, DayOfWeek: null, StudyTimeId: null }]
		})
		setListDisabledTimeFrames((prev) => [
			...listDisabledTimeFrames,
			{ Id: prev[prev.length - 1]?.Id + 1, DayOfWeek: null, StudyTimeId: null }
		])
	}
	const handleRemoveListTimeFrame = (Id) => {
		if (listTimeFrames.length !== 1) {
			form.setFieldValue(`DayOfWeek-${Id}`, undefined)
			form.setFieldValue(`StudyTimeId-${Id}`, undefined)
			const filterListTimeFrames = listTimeFrames.filter((timeFrame) => {
				return timeFrame.Id !== Id
			})
			setListTimeFrames(filterListTimeFrames)
			const filterListDisabledTimeFrames = listDisabledTimeFrames.filter((disabledTimeFrame) => {
				return disabledTimeFrame.Id !== Id
			})
			setListDisabledTimeFrames(filterListDisabledTimeFrames)
		} else {
			ShowNoti('error', 'Vui lòng chọn ít nhất 1 khung thời gian')
		}
	}

	const handleChangeTimeFrame = (data, name, value) => {
		const getIndexDisableTimeFrame = listDisabledTimeFrames.findIndex((timeFrame) => timeFrame.Id === data.Id)
		const getIndexTimeFrame = listTimeFrames.findIndex((timeFrame) => timeFrame.Id === data.Id)
		if (name === 'DayOfWeek') {
			listDisabledTimeFrames[getIndexDisableTimeFrame] = { ...listDisabledTimeFrames[getIndexDisableTimeFrame], [name]: value }
			listTimeFrames[getIndexTimeFrame] = { ...listTimeFrames[getIndexTimeFrame], [name]: value }
			setListDisabledTimeFrames([...listDisabledTimeFrames])
			setListTimeFrames([...listTimeFrames])
		}
		if (name === 'StudyTimeId') {
			const getIndexDisabled = listDisabledTimeFrames.findIndex((item) => {
				return item.Id === data.Id
			})
			const getIndex = listTimeFrames.findIndex((item) => {
				return item.Id === data.Id
			})
			listDisabledTimeFrames[getIndexDisabled] = { ...listDisabledTimeFrames[getIndexDisabled], StudyTimeId: value }
			listTimeFrames[getIndex] = { ...listTimeFrames[getIndex], StudyTimeId: value }
			setListDisabledTimeFrames([...listDisabledTimeFrames])
			setListTimeFrames([...listTimeFrames])
		}
	}
	const handleSelectChange = async (name, value) => {
		if (name === 'GradeId') {
			getAllProgramByGrade(value)
			if (form.getFieldValue('ProgramId')) {
				form.setFieldValue('ProgramId', null)
			}
			if (form.getFieldValue('CurriculumId')) {
				form.setFieldValue('CurriculumId', null)
			}
		}
		if (name === 'ProgramId') {
			const findProgramByID = programs.find((item) => {
				return item.Id === value
			})
			if (!!findProgramByID) {
				form.setFieldsValue({ Price: findProgramByID.Price })
			}
			getAllCurriculumByProgram(value)
		}
		if (name === 'BranchId') {
			getAllRoomByBranch(value)
		}
		if (name === 'CurriculumId') {
			const getData = noneConvertCurriculum.find((item) => item.Id === value)
			const filterDisabledStudyTime = state.studyTime.StudyTime.filter((item) => item.Time !== getData.Time).map((data) => data.Id)
			const data = filterDisabledStudyTime.map((item) => {
				return { Id: null, DayOfWeek: null, StudyTimeId: item }
			})
			setListDisabledTimeFrames([...data, { Id: 1, DayOfWeek: null, StudyTimeId: null }])
		}
	}
	const handleDisableSelect = (data, value) => {
		const checkExist = listDisabledTimeFrames.find((item) => {
			if (item.DayOfWeek === null) {
				return item.StudyTimeId === value
			} else {
				return item.DayOfWeek === data.DayOfWeek && item.StudyTimeId === value
			}
		})
		return !!checkExist
	}
	const handleSubmit = async (data) => {
		const convertListTimeFrame = listTimeFrames.map((timeFrame) => {
			return { DayOfWeek: timeFrame.DayOfWeek, StudyTimeId: timeFrame.StudyTimeId }
		})

		const getBranchNameById = branch.find((item) => item.value === data.BranchId)
		const getCurriculumNameById = curriculum.find((item) => item.value === data.CurriculumId)
		const getProgramNameById = program.find((item) => item.value === data.ProgramId)
		const getAcademicNameById = academic.find((item) =>
			isAcademic() ? item.value === Number(user.UserInformationId) : item.value === data.AcademicId
		)
		const getRoomNameById = room.find((item) => item.value === data.RoomId)

		let DATA_LESSON_WHEN_CREATE = {
			CurriculumId: data.CurriculumId,
			CurriculumName: getCurriculumNameById?.title,
			StartDay: data.StartDay,
			RoomId: data.RoomId,
			RoomName: getRoomNameById?.title,
			TimeModels: convertListTimeFrame,
			BranchId: data.BranchId,
			BranchName: getBranchNameById?.title,
			TeacherId: data.TeacherId,
			ProgramId: data.ProgramId,
			ProgramName: getProgramNameById?.title,
			Name: data.Name,
			Thumbnail: data.Thumbnail,
			GradeId: data.GradeId,
			Price: removeCommas(data.Price),
			AcademicId: isAcademic() ? Number(user.UserInformationId) : data.AcademicId,
			AcademicName: getAcademicNameById?.title,
			TeachingFee: removeCommas(data.TeachingFee),
			MaxQuantity: data.MaxQuantity || 20,
			Type: isOnline ? 2 : 1
		}

		try {
			setIsLoading(true)
			const res = await onSubmit(DATA_LESSON_WHEN_CREATE)
			if (res.status == 200) {
				setIsModalOpen(false)
				setListTimeFrames([{ Id: 1, DayOfWeek: null, StudyTimeId: null }])
			}
		} catch (err) {
		} finally {
			// form.resetFields()
			setIsLoading(false)
		}
	}
	useEffect(() => {
		if (isModalOpen) {
			if (state.branch.Branch.length === 0) {
				getAllBranch()
			}
			if (state.specialize.Specialize.length === 0) {
				getAllSpecialize()
			}
			if (state.studyTime.StudyTime.length === 0) {
				getAllStudyTime()
			}
			getUserInfomationAcademic()
			refPopoverWrapperBtn.current.close()
		}
	}, [isModalOpen])

	useEffect(() => {
		if (form.getFieldValue('BranchId') && form.getFieldValue('ProgramId')) {
			getAllTeacherByBranchAndProgram(form.getFieldValue('BranchId'), form.getFieldValue('ProgramId'))
		}
	}, [form.getFieldValue('BranchId'), form.getFieldValue('ProgramId')])

	// const listCalendar = useSelector((state: RootState) => state.class.listCalendar)

	// console.log('--- listCalendar: ', listCalendar)

	return (
		<>
			{isOnline ? (
				<PrimaryButton background="green" type="button" icon="add" onClick={() => setIsModalOpen(true)}>
					Tạo lớp online
				</PrimaryButton>
			) : (
				<PrimaryButton background="blue" type="button" icon="add" onClick={() => setIsModalOpen(true)}>
					Tạo lớp offline
				</PrimaryButton>
			)}

			<Modal
				title={<>Tạo lớp {isOnline ? ' online' : ' offline'}</>}
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				width={800}
				footer={
					<>
						<PrimaryButton background="blue" type="button" icon="save" onClick={form.submit} disable={isLoading} loading={isLoading}>
							Thêm vào lịch
						</PrimaryButton>
					</>
				}
			>
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<div className="row">
						<div className="col-12">
							<UploadImageField form={form} label="Ảnh đại diện lớp học" name="Thumbnail" />
						</div>

						<div className="col-md-6 col-12">
							<InputTextField isRequired rules={[yupSync]} label="Tên lớp học" name="Name" placeholder="Nhập tên lớp học" />
						</div>

						<div className={`${isOnline ? 'col-md-6 col-12' : 'col-md-6 col-12'}`}>
							<SelectField
								isRequired
								rules={[yupSync]}
								placeholder="Chọn trung tâm"
								label="Trung tâm"
								name="BranchId"
								optionList={branch}
								onChangeSelect={(value) => !isOnline && handleSelectChange('BranchId', value)}
							/>
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								isRequired
								rules={[yupSync]}
								placeholder="Chọn chuyên môn"
								label="Chuyên môn"
								name="GradeId"
								optionList={specialize}
								onChangeSelect={(value) => handleSelectChange('GradeId', value)}
							/>
						</div>
						{!isOnline && (
							<div className="col-md-6 col-12">
								<SelectField
									isRequired
									rules={formRequired}
									placeholder="Chọn phòng học"
									label="Phòng học"
									name="RoomId"
									optionList={room}
								/>
							</div>
						)}

						<div className="col-md-6 col-12">
							<SelectField
								isRequired
								rules={[yupSync]}
								placeholder="Chọn chương trình"
								label="Chương trình"
								name="ProgramId"
								optionList={program}
								onChangeSelect={(value) => handleSelectChange('ProgramId', value)}
							/>
						</div>

						<div className="col-md-6 col-12">
							<SelectField
								isRequired
								rules={[yupSync]}
								placeholder="Chọn giáo trình"
								label="Giáo trình"
								name="CurriculumId"
								optionList={curriculum}
								onChangeSelect={(value) => handleSelectChange('CurriculumId', value)}
							/>
						</div>
						<div className="relative">
							<button className="absolute top-0 right-0 z-10 -translate-x-2/4" type="button" onClick={handleAddListTimeFrame}>
								<AiFillPlusCircle size={22} />
							</button>
							<Form.Item label="Khung thời gian" className="mb-0">
								{!!listTimeFrames &&
									listTimeFrames.map((timeFrame) => {
										return (
											<div className="relative" key={timeFrame.Id}>
												<button
													type="button"
													className="absolute top-0 right-0 z-10"
													onClick={() => handleRemoveListTimeFrame(timeFrame.Id)}
												>
													<AiFillMinusCircle size={22} />
												</button>
												<div className="row">
													<div className="col-md-6 col-12">
														<SelectField
															placeholder="Chọn thứ"
															optionList={curriculum.length > 0 && dayOfWeek}
															name={`DayOfWeek-${timeFrame.Id}`}
															label="Thứ"
															onChangeSelect={(value) => handleChangeTimeFrame(timeFrame, `DayOfWeek`, value)}
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
																	handleChangeTimeFrame(timeFrame, `StudyTimeId`, value)
																}}
															>
																{studyTime &&
																	form.getFieldValue('CurriculumId') &&
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
											</div>
										)
									})}
							</Form.Item>
						</div>
						<div className="col-md-6 col-12">
							<InputNumberField
								isRequired
								rules={[yupSync]}
								placeholder="Nhập lương/buổi"
								className="w-full"
								label="Lương/buổi"
								name="TeachingFee"
							/>
						</div>
						<div className="col-md-6 col-12">
							<DatePickerField isRequired rules={[yupSync]} mode="single" label="Ngày mở lớp" name="StartDay" />
						</div>
						<div className="col-md-6 col-12">
							<InputNumberField
								isRequired
								rules={[yupSync]}
								placeholder="Nhập giá lớp học"
								className="w-full"
								label="Giá lớp học"
								name="Price"
							/>
						</div>
						<div className="col-md-6 col-12">
							<InputNumberField
								placeholder="Nhập số lượng học viên tối đa (mặc định 20)"
								className="w-full"
								label="Số lượng học viên tối đa (mặc định 20)"
								name="MaxQuantity"
							/>
						</div>
						{!isAcademic() ? (
							<div className="col-md-6 col-12">
								<SelectField
									isRequired
									rules={[yupSync]}
									placeholder="Chọn học vụ"
									label="Học vụ"
									name="AcademicId"
									optionList={academic}
								/>
							</div>
						) : (
							''
						)}
						<div className="col-md-6 col-12">
							<SelectField
								isRequired
								rules={[yupSync]}
								placeholder="Chọn giáo viên"
								label="Giáo viên"
								name="TeacherId"
								optionList={teacher}
							/>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreateClassForm
