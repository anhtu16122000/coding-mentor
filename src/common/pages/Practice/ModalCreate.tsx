import React, { useState } from 'react'
import { Form, Modal } from 'antd'
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

const ModalCreatePractice = (props) => {
	const { onRefresh, isEdit, defaultData } = props

	const [form] = Form.useForm()

	const [visible, setVisible] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const user = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function isTeacher() {
		return user?.RoleId == 2
	}

	async function postCreate(params) {
		try {
			const res = await trainingRouteApi.post(params)
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

	async function putUpdate(params) {
		try {
			const res = await trainingRouteApi.put(params)
			if (res.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	function toggle() {
		setVisible(!visible)
	}

	const router = useRouter()

	// SUBMI FORM
	const handleSubmit = async (data: any) => {
		setLoading(true)

		const dataSubmit = {
			...defaultData,
			...data
		}

		await (!isEdit ? postCreate(dataSubmit) : putUpdate(dataSubmit))

		setLoading(false)
	}

	const [exams, setExams] = useState([])

	async function openEdit() {
		await form.setFieldsValue({ ...defaultData })

		toggle()
	}

	return (
		<>
			{(isAdmin() || isTeacher()) && (
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
						<InputTextField isRequired name="Name" label="Tên lộ trình" rules={formRequired} />
						<InputTextField isRequired name="Age" label="Tuổi" rules={formRequired} />
						<InputTextField isRequired name="CurrentLevel" label="Level" rules={formRequired} />
						<InputTextField isRequired name="TargetLevel" label="Mục tiêu" rules={formRequired} />
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default ModalCreatePractice
