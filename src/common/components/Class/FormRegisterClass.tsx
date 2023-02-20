import { Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { billApi } from '~/api/bill'
import { programApi } from '~/api/program'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import ListClassReview from './ListClassReview'
import ListProgramReview from './ListProgramReview'
import ModalAddClass from './ModalAddClass'
import ModalAddProgram from './ModalAddProgram'

const FormRegisterClass = (props) => {
	const { form, setClasses, classes, classesSelected, setClassesSelected, programsSelected, setProgramsSelected } = props

	const branch = useSelector((state: RootState) => state.branch.Branch)

	const [programs, setPrograms] = useState([])

	useEffect(() => {
		getPrograms()
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

	const handleGetClassAvailable = async (data) => {
		form.setFieldsValue({ branchId: data })
		if (!!form.getFieldValue('StudentId')) {
			try {
				// Tham số 1: branchId
				// Tham số 2: studentId
				console.log("form.getFieldValue('StudentId'): ", form.getFieldValue('StudentId'))
				const res = await billApi.getClassAvailable({ studentId: form.getFieldValue('StudentId'), branchId: data })
				if (res.status === 200) {
					setClasses(res.data.data)
				}
				if (res.status === 204) {
					setClasses([])
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}
	return (
		<>
			<div className="col-span-2">
				<Form.Item required={true} rules={formRequired} label="Trung tâm" name="BranchId">
					<Select onChange={handleGetClassAvailable} showSearch allowClear className="primary-input" placeholder="Chọn trung tâm">
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
		</>
	)
}

export default FormRegisterClass
