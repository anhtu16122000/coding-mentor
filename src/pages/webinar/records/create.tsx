import { Input, Modal, Form } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi'
import { SeminarRecordApi } from '~/api/course/seminar/record'
import PrimaryButton from '~/common/components/Primary/Button'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'

const CreareYoutubeRecord = ({ onRefresh, isEdit, defaultData }) => {
	const [form] = Form.useForm()

	const { seminar } = useRouter().query

	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	async function postNewRecord(params) {
		try {
			const response = await SeminarRecordApi.post(params)
			if (response.status === 200) {
				ShowNoti('success', response.data?.message)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
			setVisible(false)
			onRefresh()
			form.resetFields()
		}
	}

	async function postUpdateRecord(params) {
		try {
			const response = await SeminarRecordApi.put(params)
			if (response.status === 200) {
				ShowNoti('success', response.data?.message)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
			setVisible(false)
			onRefresh()
			form.resetFields()
		}
	}

	function onFinish(params) {
		const SUBMIT_DATA = { ...params, SeminarId: seminar || '' }
		setLoading(true)

		!!isEdit && postUpdateRecord({ VideoUrl: params?.VideoUrl, Name: params?.Name, Id: defaultData?.Id })
		!isEdit && postNewRecord(SUBMIT_DATA)
	}

	function openEdit() {
		form.setFieldsValue({ Name: defaultData.Name })
		form.setFieldsValue({ VideoUrl: defaultData.VideoUrl })
		setVisible(true)
	}

	return (
		<>
			{!isEdit && (
				<div
					onClick={() => setVisible(true)}
					className="mt-2 w-full h-[36px] rounded-[6px] bg-[#e3e9f0] hover:!bg-[#d8dfe8] active:!bg-[#e3e9f0] cursor-pointer flex items-center justify-center"
				>
					<AiOutlinePlusCircle size={16} className="mr-2" />
					<div>Thêm bản ghi</div>
				</div>
			)}

			{isEdit && (
				<div
					onClick={(e) => {
						openEdit()
						e.stopPropagation()
					}}
					className="mr-[-7px] p-2 text-[green]"
				>
					<FiEdit size={16} />
				</div>
			)}

			<Modal
				title="Thêm bản ghi từ Youtube"
				visible={visible}
				onCancel={(e) => {
					e.stopPropagation()
					setVisible(false)
				}}
				footer={
					<>
						<PrimaryButton disable={loading} onClick={(e) => setVisible(false)} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton loading={loading} onClick={(e) => form.submit()} className="ml-2" background="blue" icon="save" type="button">
							Lưu
						</PrimaryButton>
					</>
				}
			>
				<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-12">
						<Form.Item className="col-span-12" label="Tên bản ghi" name="Name" rules={formRequired}>
							<Input className="primary-input" placeholder="Nhập tên bản ghi" />
						</Form.Item>
						<Form.Item className="col-span-12" label="Link Youtube" name="VideoUrl" rules={formRequired}>
							<Input className="primary-input" placeholder="Nhập link Youtube" />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreareYoutubeRecord
