import { Form, Input, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdSettings } from 'react-icons/md'
import dirtyApi from '~/api/dirtyApi'
import { formNoneRequired, formRequired } from '~/common/libs/form'
import { ShowNoti } from '~/common/utils'
import ModalFooter from '../../ModalFooter'
import PrimaryUpload from '../../Upload'

function GroupForm(props) {
	const { onRefresh, isEdit, defaultData } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		getClasses()
	}, [visible])

	async function post(params) {
		console.log('--- SUBMIT_DATA: ', params)
		try {
			const response = await dirtyApi.post('NewsFeedGroup', params)
			if (response.data.resultCode == 200) {
				onRefresh()
				setVisible(false)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	async function put(params) {
		console.log('--- SUBMIT_DATA: ', params)
		try {
			const response = await dirtyApi.put('NewsFeedGroup', { ...params, id: defaultData?.id })
			if (response.data.resultCode == 200) {
				onRefresh()
				setVisible(false)
			}
		} catch (error) {
			ShowNoti.error(error?.resultMessage)
		} finally {
			setLoading(false)
		}
	}

	function onFinish(params) {
		setLoading(true)
		const SUBMIT_DATA = { ...params, classInCourseId: null }
		if (!isEdit) {
			post(SUBMIT_DATA)
		} else {
			put(SUBMIT_DATA)
		}
	}

	function submitForm() {
		form.submit()
	}

	const [classes, setClasses] = useState<any>({ items: [], totalItem: 0 })
	async function getClasses() {
		try {
			const response = await dirtyApi.get<TSubjects>('Class', { orderBy: 3, pageIndex: 1, pageSize: 999999 })
			if (response.data.resultCode == 200) {
				setClasses(response.data.data)
			} else {
				setClasses({ items: [], totalItem: 0 })
			}
		} catch (error) {
			ShowNoti.error(error?.resultMessage)
		}
	}

	function onOpenEdit() {
		setVisible(!visible)
		form.setFieldsValue({ ...defaultData })
	}

	return (
		<>
			{!isEdit && (
				<div onClick={() => setVisible(true)} className={`btn-create-group`}>
					<AiOutlinePlus size={18} className="mr-2" />
					<div>Tạo nhóm</div>
				</div>
			)}

			{!!isEdit && (
				<div className="cc-group-settings ml-3" onClick={() => onOpenEdit()}>
					<MdSettings size={22} />
				</div>
			)}

			<Modal
				open={visible}
				onCancel={() => setVisible(false)}
				closable={true}
				centered
				width={500}
				title="Thông tin nhóm"
				footer={<ModalFooter buttonFull loading={loading} onCancel={() => setVisible(false)} onOK={submitForm} />}
			>
				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<Form.Item className="col-span-2" label="Ảnh bìa" name="background" rules={formNoneRequired}>
						<div className="group-thum-form">
							<PrimaryUpload.Image
								defaultValue={form.getFieldValue('background')}
								onChange={(event) => form.setFieldValue('background', event)}
							/>
						</div>
					</Form.Item>

					<Form.Item className="col-span-2" label="Tên nhóm" name="name" rules={formRequired}>
						<Input disabled={loading} />
					</Form.Item>

					{!isEdit && (
						<Form.Item className="col-span-2" label="Học phần" name="classId" rules={formNoneRequired}>
							<Select showSearch optionFilterProp="children" className="w-[250px]">
								{classes.items.map((item, index) => {
									return (
										<Select.Option value={item?.id} key={index}>
											{item?.name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
					)}
				</Form>
			</Modal>
		</>
	)
}

export default GroupForm
