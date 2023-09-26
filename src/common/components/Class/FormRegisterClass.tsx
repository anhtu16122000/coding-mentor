import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { billApi } from '~/api/business/bill'
import { studyTimeApi } from '~/api/configs/study-time'
import { programApi } from '~/api/learn/program'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import ListClassReview from './ListClassReview'
import ListProgramReview from './ListProgramReview'
import ModalAddClass from './ModalAddClass'
import ModalAddProgram from './ModalAddProgram'

type StudyTime = {
	title: string
	value: number
}

const FormRegisterClass = (props) => {
	const dispatch = useDispatch()
	const { form, setClasses, classes, classesSelected, setClassesSelected, programsSelected, setProgramsSelected } = props
	const branch = useSelector((state: RootState) => state.branch.Branch)
	const [studyTime, setStudyTime] = useState<StudyTime[]>([])
	const [programs, setPrograms] = useState([])

	const getAllStudyTime = async () => {
		try {
			const res = await studyTimeApi.getAll({ pageSize: 9999 })
			if (res.status == 200) {
				setStudyTime(parseSelectArray(res.data.data, 'Name', 'Id'))
			} else {
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

	return (
		<>
			{/* <div className="col-span-2">
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
			</div> */}

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
		</>
	)
}

export default FormRegisterClass
