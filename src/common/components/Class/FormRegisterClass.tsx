import { Divider, Form, Select } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { billApi } from '~/api/bill'
import { branchApi } from '~/api/branch'
import { programApi } from '~/api/program'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { parseStringToNumber } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'
import InputTextField from '../FormControl/InputTextField'
import ListClassReview from './ListClassReview'
import ListProgramReview from './ListProgramReview'
import ModalAddClass from './ModalAddClass'
import ModalAddProgram from './ModalAddProgram'

const FormRegisterClass = (props) => {
	const {
		form,
		setClasses,
		classes,
		classesSelected,
		setClassesSelected,
		programsSelected,
		setProgramsSelected,
		setTotalPrice,
		setLeftPrice,
		discountPrice
	} = props
	const branch = useSelector((state: RootState) => state.branch.Branch)
	const [programs, setPrograms] = useState([])
	const dispatch = useDispatch()

	useMemo(() => {
		const getTotalPriceClass = classesSelected.reduce((prev, next) => {
			return prev + next.Price
		}, 0)
		const getTotalPriceProgram = programsSelected.reduce((prev, next) => {
			return prev + next.Price
		}, 0)
		const totalPrice = getTotalPriceClass + getTotalPriceProgram
		setTotalPrice(totalPrice)
		// setLeftPrice(totalPrice - discountPrice - parseStringToNumber(!!form.getFieldValue('Paid') ? form.getFieldValue('Paid') : 0))
	}, [classesSelected, programsSelected])

	const getAllBranch = async () => {
		try {
			const res = await branchApi.getAll()
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
	const getAllProgram = async () => {
		try {
			const res = await programApi.getAll()
			if (res.status === 200) {
				setPrograms(res.data.data)
			}
			if (res.status === 204) {
				setPrograms([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	useEffect(() => {
		if (branch.length === 0) {
			getAllBranch()
		}
		getAllProgram()
	}, [])

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
						/>
					</div>
					<ListProgramReview programsSelected={programsSelected} setProgramsSelected={setProgramsSelected} setPrograms={setPrograms} />
				</div>
			</div>
		</>
	)
}

export default FormRegisterClass
