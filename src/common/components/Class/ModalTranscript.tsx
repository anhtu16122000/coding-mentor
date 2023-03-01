import { Form, Modal } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { transcriptApi } from '~/api/transcript'
import { ShowNoti } from '~/common/utils'
import InputTextField from '../FormControl/InputTextField'
import PrimaryButton from '../Primary/Button'

type IModalTranscript = {
	mode: 'add' | 'edit' | 'delete'
	Id?: any
	onRefresh?: Function
	setTranscriptId?: Function
}
export const ModalTranscript: React.FC<IModalTranscript> = ({ mode, Id, onRefresh, setTranscriptId }) => {
	const router = useRouter()
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()

	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		setVisible(true)
	}

	const handleRemove = async (Id) => {
		try {
			setIsLoading(true)
			const res = await transcriptApi.delete(Id)
			if (res.status === 200) {
				onClose()
				onRefresh && onRefresh()
				setIsLoading(false)
				form.resetFields()
				setTranscriptId && setTranscriptId(null)
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			setIsLoading(true)
			ShowNoti('error', error.Message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleTranscript = async (data) => {
		try {
			try {
				setIsLoading(true)
				const res = await transcriptApi.add(data)
				if (res.status === 200) {
					onClose()
					onRefresh && onRefresh()
					setIsLoading(false)
					form.resetFields()
					ShowNoti('success', res.data.message)
					setTranscriptId && setTranscriptId(res?.data?.data?.Id)
				}
			} catch (error) {
				setIsLoading(true)
				ShowNoti('error', error.Message)
			} finally {
				setIsLoading(false)
			}
		} catch (error) {}
	}

	const _onSubmit = (data) => {
		if (mode !== 'add') {
			data.Id = Id
		}
		if (mode === 'add') {
			const dataSubmit = {
				ClassId: Number(router?.query?.class),
				...data
			}
			handleTranscript(dataSubmit)
		}
		if (mode === 'delete') {
			handleRemove(data.Id)
		}
	}
	return (
		<>
			{mode == 'add' && (
				<>
					<PrimaryButton className="!hidden w1300:!flex" background="blue" type="button" icon="add" onClick={onOpen}>
						Thêm đợt thi
					</PrimaryButton>

					<PrimaryButton className="!flex w1300:!hidden" background="blue" type="button" icon="add" onClick={onOpen} />
				</>
			)}

			{mode == 'delete' && (
				<>
					<PrimaryButton className="!hidden w1150:!flex" background="red" type="button" icon="remove" onClick={onOpen}>
						Xóa đợt thi
					</PrimaryButton>

					<PrimaryButton className="!flex w1150:!hidden" background="red" type="button" icon="remove" onClick={onOpen} />
				</>
			)}

			<Modal
				title={mode === 'add' ? 'Thêm đợt thi mới' : mode === 'edit' ? 'Cập nhật đợt thi' : 'Xác nhận xóa'}
				open={visible}
				onCancel={onClose}
				footer={
					<>
						<PrimaryButton onClick={() => onClose()} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton
							loading={isLoading}
							onClick={() => form.submit()}
							className="ml-2"
							background="blue"
							icon={mode !== 'delete' ? 'save' : 'remove'}
							type="button"
							children={mode !== 'delete' ? 'Xác nhận' : 'Xóa'}
						/>
					</>
				}
				width={500}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
							{mode == 'delete' && (
								<div className="col-span-2 mb-4 text-center text-[16px]">
									<p>Bạn có chắc muốn xóa?</p>
								</div>
							)}
							{mode != 'delete' && (
								<>
									<div className="col-span-2">
										<InputTextField label="Tên đợt thi" name="Name" />
									</div>
								</>
							)}
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
