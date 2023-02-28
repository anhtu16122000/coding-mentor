import { Card, Form, Input, Modal } from 'antd'
import React, { FC, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import PrimaryButton from '~/common/components/Primary/Button'
import ModalFooter from '~/common/components/ModalFooter'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/116524-enter-password.json'

interface IRefund {
	video?: any
	onRefresh?: Function
	onOpen?: Function
}

const ActiveVideo: FC<IRefund> = ({ video, onRefresh }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	const [textError, setTextError] = useState('')

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

		_active(DATA_SUBMIT?.Code)
	}

	const _active = async (code) => {
		setLoading(true)
		try {
			let res = await RestApi.post('VideoCourseStudent/active', { videoCourseId: video.Id, ActiveCode: code })
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
			<PrimaryButton className="w-[100px]" onClick={toggle} background="blue" icon="none" type="button">
				Kích hoạt
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
							<Lottie animationData={loadingJson} play className="inner w-[70%] mx-auto" />
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
					<Form.Item className="col-span-2" label="Mã kích hoạt" name="Code" rules={formRequired}>
						<Input className="primary-input" placeholder="Nhập mã kích hoạt" disabled={loading} />
					</Form.Item>
					{!!textError && <div className="text-[red]">{textError}</div>}
				</Form>
			</Modal>
		</>
	)
}

export default ActiveVideo
