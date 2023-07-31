import { Modal, Form, Input } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { ShowNoti, log } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import ButtonAdd from '../../../DirtyButton/Button-Add'
import ButtonCancel from '../../../DirtyButton/Button-Cancel'
import ButtonSave from '../../../DirtyButton/Button-Save'
import Router from 'next/router'
import InputNumberField from '../../../FormControl/InputNumberField'
import UploadAudioField from '../../../FormControl/UploadAudioField'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import { decode } from '~/common/utils/common'
import { UploadFileApi } from '~/api/common/upload-image'
import { FiEdit } from 'react-icons/fi'

const CreateExamSkill: FC<ICreateExam> = (props) => {
	const { onRefresh, isEdit, defaultData, className, onOpen } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)

	useEffect(() => {
		if (isModalVisible) {
			!!onOpen && onOpen()
		}
	}, [isModalVisible])

	async function putSkill(param) {
		try {
			const response = await ieltsSkillApi.put(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setIsModalVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	async function postSkill(param) {
		try {
			const response = await ieltsSkillApi.post(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setIsModalVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const handleUploadFile = async (info) => {
		try {
			let res = await UploadFileApi.uploadImage(info.file.originFileObj)
			if (res.status == 200) {
				return res.data?.data
			} else {
				return ''
			}
		} catch (error) {
			ShowNoti('error', error.message)
			return ''
		}
	}

	const onFinish = async (values) => {
		setLoading(true)

		let audioUploaded = ''

		if (!!values?.Audio) {
			audioUploaded = await handleUploadFile(values?.Audio)
		}

		const DATA_SUBMIT = { ...values, IeltsExamId: parseInt(decode(Router.query?.exam + '')), Audio: audioUploaded }

		log.Yellow('DATA_SUBMIT', DATA_SUBMIT)

		if (!isEdit) {
			postSkill(DATA_SUBMIT)
		}

		if (!!isEdit) {
			putSkill({ ...DATA_SUBMIT, ID: defaultData.Id })
		}
	}

	function openEdit() {
		form.setFieldsValue({ Audio: defaultData?.Audio })
		form.setFieldsValue({ Time: defaultData?.Time })
		form.setFieldsValue({ Name: defaultData?.Name })
		setIsModalVisible(true)
	}

	const user = useSelector((state: RootState) => state.user.information)

	return (
		<>
			{user?.RoleId == 1 && !!!isEdit && (
				<div data-tut="reactour-create" className="flex-shrink-0 mr-[16px]">
					<ButtonAdd icon="outline" onClick={() => setIsModalVisible(true)}>
						Thêm kỹ năng
					</ButtonAdd>
				</div>
			)}

			{user?.RoleId == 1 && !!isEdit && (
				<div
					onClick={(event) => {
						event.stopPropagation()
						openEdit()
					}}
					className="ml-[8px] w-[28px] h-[28px] cursor-pointer bg-[#FFBA0A] hover:bg-[#e7ab11] focus:bg-[#d19b10] rounded-full all-center"
				>
					<FiEdit size={16} className="text-[#000]" />
				</div>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật kỹ năng' : 'Thêm kỹ năng mới'}
				width={500}
				open={isModalVisible}
				onCancel={() => !loading && setIsModalVisible(false)}
				footer={
					<div className="w-full flex items-center justify-center">
						<ButtonCancel iconSize={18} icon="outline" shadow="sm" onClick={() => setIsModalVisible(false)}>
							Huỷ
						</ButtonCancel>
						<ButtonSave iconSize={16} loading={loading} onClick={() => form.submit()} shadow="sm" className="ml-3" icon="outline">
							Lưu
						</ButtonSave>
					</div>
				}
			>
				<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-4 gap-x-4">
						<Form.Item className="col-span-4 w500:col-span-2" label="Tên kỹ năng" name="Name" rules={formRequired}>
							<Input disabled={loading} className="primary-input" />
						</Form.Item>

						<InputNumberField
							placeholder="Nhập số phút"
							className="col-span-4 w500:col-span-2"
							label="Thời gian (phút)"
							name="Time"
							isRequired
							rules={formRequired}
						/>

						<UploadAudioField loading={loading} className="col-span-4" form={form} name="Audio" label="Âm thanh" rules={formNoneRequired} />
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreateExamSkill
