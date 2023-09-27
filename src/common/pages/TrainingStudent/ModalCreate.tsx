import React, { useState } from 'react'
import { Form, Modal, Select } from 'antd'
import { ShowNostis } from '~/common/utils'
import { useRouter } from 'next/router'
import { formRequired } from '~/common/libs/others/form'
import { FaEdit } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { PrimaryTooltip } from '~/common/components'
import PrimaryButton from '~/common/components/Primary/Button'
import ModalFooter from '~/common/components/ModalFooter'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { trainingRouteApi } from '~/api/practice'
import { studentInTrainingApi } from '~/api/practice/StudentInTraining'
import { is } from '~/common/utils/common'

const ModalCreateTrainingStudent = (props) => {
	const { onRefresh, isEdit, defaultData } = props

	const [form] = Form.useForm()

	const [visible, setVisible] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const user = useSelector((state: RootState) => state.user.information)

	async function postCreate(params) {
		try {
			const res = await studentInTrainingApi.post(params)
			if (res.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	async function putUpdate(params) {
		try {
			const res = await studentInTrainingApi.put(params)
			if (res.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				form.resetFields()
				setVisible(false)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	function toggle() {
		setVisible(!visible)

		getTrainingRoute()
	}

	const router = useRouter()

	// SUBMI FORM
	const handleSubmit = async (data: any) => {
		setLoading(true)

		const dataSubmit = {
			...defaultData,
			...data,
			StudentId: router.query?.StudentID
		}

		await (!isEdit ? postCreate(dataSubmit) : putUpdate(dataSubmit))

		setLoading(false)
	}

	const [exams, setExams] = useState([])

	async function openEdit() {
		await form.setFieldsValue({ ...defaultData })

		toggle()
	}

	const [trainingRoute, setTrainingRoute] = useState([])

	async function getTrainingRoute() {
		setLoading(true)
		try {
			const res = await trainingRouteApi.getAll({ pageSize: 9999, pageIndex: 1 })
			if (res.status == 200) {
				setTrainingRoute(res.data?.data)
			} else {
				setTrainingRoute([])
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			{(is(user).admin || is(user).teacher || is(user).manager || is(user).academic) && (
				<>
					{isEdit ? (
						<PrimaryTooltip place="left" id={`hw-take-${defaultData?.Id}`} content="Cập nhật">
							<div onClick={openEdit} className="w-[28px] text-[#FFBA0A] h-[30px] all-center hover:opacity-70 cursor-pointer">
								<FaEdit size={20} />
							</div>
						</PrimaryTooltip>
					) : (
						<PrimaryButton icon="add" type="button" onClick={toggle} background="green">
							Thêm mới
						</PrimaryButton>
					)}
				</>
			)}

			<Modal
				title={isEdit ? 'Cập nhật lộ trình' : 'Thêm lộ trình'}
				open={visible}
				width={500}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={form.submit} />}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={handleSubmit}>
						<Form.Item name="TrainingRouteId" label="Lộ trình luyện tập" rules={formRequired}>
							<Select
								showSearch
								optionFilterProp="children"
								className="primary-input"
								loading={loading}
								disabled={loading}
								placeholder="Chọn lộ trình"
							>
								{trainingRoute.map((item) => {
									return (
										<Select.Option key={item.Id} value={item.Id}>
											{item?.Name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default ModalCreateTrainingStudent
