import { Card, Form, Input, Modal, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import PrimaryButton from '~/common/components/Primary/Button'
import ModalFooter from '~/common/components/ModalFooter'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/90020-gift.json'
import moment from 'moment'

interface IDonateVideo {
	video?: any
	onRefresh?: Function
	onOpen?: Function
}

const DonateVideo: FC<IDonateVideo> = ({ video, onRefresh }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	const [textError, setTextError] = useState('')

	const [students, setStudents] = useState<any>([])

	function toggle() {
		setVisible(!visible)
	}

	function onFinish(params) {
		setLoading(true)
		setTextError('')

		const DATA_SUBMIT = {
			...params
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		_active(DATA_SUBMIT?.StudentId)
	}

	useEffect(() => {
		if (visible) {
			getStudents()
		}
	}, [visible])

	const getStudents = async () => {
		setLoading(true)
		try {
			let res = await RestApi.get<any>('UserInformation', { pageSize: 9999999, pageIndex: 1, RoleIds: '3' })
			if (res.status == 200) {
				setStudents(res.data.data)
			}
			if (res.status == 204) {
				setStudents([])
			}
		} catch (err) {
			ShowNostis.error(err.message)
		} finally {
			setLoading(false)
		}
	}

	const _active = async (code) => {
		setLoading(true)
		try {
			let res = await RestApi.post('VideoCourseStudent', { videoCourseId: video.Id, UserId: code })
			if (res.status == 200) {
				!!onRefresh && onRefresh()
				ShowNostis.success('Thành công')
			}
		} catch (error) {
			setTextError(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function submitForm() {
		form.submit()
	}

	return (
		<>
			<PrimaryButton className="w-[100px] mt-[8px]" onClick={toggle} background="yellow" icon="none" type="button">
				Tặng
			</PrimaryButton>

			<Modal
				width={500}
				title="Mã kích khoá video"
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submitForm} />}
			>
				<Card className="mb-[16px] card-min-padding">
					<div className="flex relative">
						<div className="w-full flex flex-col items-center justify-center">
							<Lottie loop={false} animationData={loadingJson} play className="inner w-[70%] mx-auto" />
						</div>
					</div>
				</Card>

				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<Form.Item className="col-span-2 ant-select-class-selected mt-[16px]" name="StudentId" label="Học viên" rules={formRequired}>
						<Select
							showSearch
							optionFilterProp="children"
							allowClear={true}
							disabled={loading}
							placeholder="Chọn học viên"
							className="ant-select-item-option-selected-blue"
						>
							{students.map((item) => {
								return (
									<Select.Option key={item.UserInformationId} value={item.UserInformationId}>
										{item?.FullName}
										<div className="hiddens ant-select-dropdown-by-chau">
											<div className="text-[12px]">Mã: {item?.UserCode}</div>
											<div className="text-[12px]">Ngày sinh: {!!item?.DOB ? moment(item?.DOB).format('DD/MM/YYYY') : 'Không rõ'}</div>
										</div>
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>

					{!!textError && <div className="text-[red]">{textError}</div>}
				</Form>
			</Modal>
		</>
	)
}

export default DonateVideo
