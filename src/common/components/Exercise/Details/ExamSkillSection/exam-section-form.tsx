import { Modal, Form, Input } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { ShowNoti, log } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import ButtonAdd from '../../../DirtyButton/Button-Add'
import ButtonCancel from '../../../DirtyButton/Button-Cancel'
import ButtonSave from '../../../DirtyButton/Button-Save'
import UploadAudioField from '../../../FormControl/UploadAudioField'
import { UploadFileApi } from '~/api/common/upload-image'
import { FiEdit } from 'react-icons/fi'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import PrimaryEditor from '~/common/components/Editor'
import { BiPlus } from 'react-icons/bi'

const activeClass = 'bg-[#4CAF50] hover:bg-[#449a48] focus:bg-[#38853b] text-[#fff]'

const CreateExamSection: FC<ICreateExam & { skill?: any }> = (props) => {
	const { onRefresh, isEdit, defaultData, onOpen, skill } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (visible) {
			!!onOpen && onOpen()
		}
	}, [visible])

	async function putSection(param) {
		try {
			const response = await ieltsSectionApi.put(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	async function postSection(param) {
		try {
			const response = await ieltsSectionApi.post(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setVisible(false)
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

		const DATA_SUBMIT = { ...values, IeltsSkillId: skill?.Id, Audio: audioUploaded, Explain: '' }

		log.Yellow('Submit Section', DATA_SUBMIT)

		if (!isEdit) {
			postSection(DATA_SUBMIT)
		}

		if (!!isEdit) {
			putSection({ ...DATA_SUBMIT, ID: defaultData.Id })
		}
	}

	function openEdit() {
		form.setFieldsValue({ ...defaultData })
		setVisible(true)
	}

	const user = useSelector((state: RootState) => state.user.information)

	function clickEdit(event) {
		event.stopPropagation()
		openEdit()
	}

	function toggle() {
		setVisible(!visible)
	}

	return (
		<>
			{user?.RoleId == 1 && !!!isEdit && (
				<div onClick={toggle} className={`cc-23-skill ${activeClass}`}>
					<BiPlus size={18} />
					<div className="ml-[4px]">Phần mới</div>
				</div>
			)}

			{user?.RoleId == 1 && !!isEdit && (
				<div onClick={clickEdit} className="cc-23-skill-menu-item">
					<FiEdit size={16} className="text-[#9C27B0]" />
					<div className="ml-[8px] font-[500]">Cập nhật</div>
				</div>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật kỹ năng' : 'Thêm kỹ năng mới'}
				width={700}
				open={visible}
				onCancel={() => !loading && setVisible(false)}
				footer={
					<div className="w-full flex items-center justify-center">
						<ButtonCancel iconSize={18} icon="outline" shadow="sm" onClick={() => setVisible(false)}>
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
						<Form.Item className="col-span-4" label="Tên" name="Name" rules={formRequired}>
							<Input disabled={loading} className="primary-input" />
						</Form.Item>

						<Form.Item className="col-span-4" label="Nội dung" name="ReadingPassage">
							<PrimaryEditor
								id={`read-${new Date().getTime()}`}
								height={400}
								initialValue={defaultData?.ReadingPassage || ''}
								onChange={(event) => form.setFieldValue('ReadingPassage', event)}
							/>
						</Form.Item>

						<UploadAudioField loading={loading} className="col-span-4" form={form} name="Audio" label="Âm thanh" rules={formNoneRequired} />
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreateExamSection
