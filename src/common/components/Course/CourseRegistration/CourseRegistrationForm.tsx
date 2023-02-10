import { Form, Modal, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdOutlineLogin } from 'react-icons/md'
import { courseApi } from '~/api/course/course'
import { courseRegistrationApi } from '~/api/course-registration'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

const CourseRegistrationForm = React.memo((props: any) => {
	const { Option } = Select
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { setPickedProgramID, reloadData, currentPage, listStudent, pickedProgramID } = props
	const [form] = Form.useForm()
	// const { showNoti } = useWrap()
	const [loading, setLoading] = useState(false)
	const [isLoading, setIsLoading] = useState<any>({
		type: '',
		status: false
	})

	const [courseAfter, setCourseAfter] = useState<ICourse[]>()
	const [courseAfterId, setCourseAfterId] = useState()
	const [isLoadingCourseDetail, setIsLoadingCourseDetail] = useState(false)
	const [courseAfterDetail, setCourseAfterDetail] = useState<ICourseDetail>()

	const fetchDataCourseAfter = async () => {
		setIsLoading(true)
		try {
			const _courseAfter = await courseApi.getAll({
				pageIndex: 1,
				pageSize: 99999,
				ProgramID: pickedProgramID
			})
			if (_courseAfter.status == 200) {
				setCourseAfter(_courseAfter.data.data)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	function handleChangeCourseAfter(idCourseAfter: any) {
		setCourseAfterId(idCourseAfter)
	}

	const fetchDataCourseAfterDetail = () => {
		setIsLoadingCourseDetail(true)
		;(async () => {
			try {
				const _courseAfterDetail = await courseApi.getById(courseAfterId)
				_courseAfterDetail.status == 200 && setCourseAfterDetail(_courseAfterDetail.data.data)
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoadingCourseDetail(false)
			}
		})()
	}

	const onSubmit = async (data: any) => {
		setLoading(true)
		try {
			let res = await courseRegistrationApi.intoCourse({
				...data,
				ListCourseRegistration: listStudent
			})
			if (res.status == 200) {
				reloadData(currentPage)
				afterSubmit(res?.data.message)
				form.resetFields()
				setCourseAfterDetail(null)
				setPickedProgramID(null)
			}
		} catch (error) {
			ShowNoti('error', error.message)
			setLoading(false)
		}
	}

	const afterSubmit = (mes) => {
		ShowNoti('success', mes)
		setLoading(false)
		setIsModalVisible(false)
	}

	const returnNameCourse = (data) => {
		let name = data.CourseName
		let percent = data.DonePercent.toString() + '% '
		name = percent + name
		return name
	}

	useEffect(() => {
		if (isModalVisible) {
			fetchDataCourseAfter()
		}
	}, [isModalVisible])

	useEffect(() => {
		if (isModalVisible == true) {
			fetchDataCourseAfterDetail()
		}
	}, [courseAfterId])

	return (
		<>
			<button
				className="btn btn-primary"
				onClick={() => {
					setIsModalVisible(true)
				}}
			>
				<MdOutlineLogin size={18} className="mr-2" />
				Chuyển vào khóa
			</button>
			<Modal title="Chuyển học viên vào lớp học" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<Spin spinning={isLoading}>
							{courseAfter != null && (
								<div className="row">
									<div className="col-12">
										<Form.Item name="CourseID" label="Lớp học chuyển đến">
											<Select
												style={{ width: '100%' }}
												className="style-input"
												onChange={handleChangeCourseAfter}
												placeholder="Chọn lớp học"
											>
												{courseAfter?.map((item, index) => (
													<Option key={index} value={item.ID}>
														{returnNameCourse(item)}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
							)}
						</Spin>

						{/*  */}
						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{loading == true && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default CourseRegistrationForm
