import { Modal, Form } from 'antd'
import React, { useState } from 'react'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { useDispatch } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import Router from 'next/router'
import { examApi } from '~/api/exam'
import { setCurrentPackage, setTotalPoint } from '~/store/globalState'
import NumberFormat from 'react-number-format'
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'

const QuickAddGroup = (props) => {
	const { section, onOpen } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)

	const dispatch = useDispatch()

	// Call api
	async function callApiSubmit(param) {
		try {
			const response = await examApi.addRandom({ ...param, sectionId: section?.Id, type: 2 })
			if (response.status == 200) {
				form.resetFields()
				getDetail()
				setIsModalVisible(false)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	// Handle submit form
	const onFinish = (values) => {
		setLoading(true)

		const DATA_SUBMIT = { ...values }
		console.log('DATA_SUBMIT: ', DATA_SUBMIT)

		callApiSubmit({ ...DATA_SUBMIT })
	}

	// Get new data
	async function getDetail() {
		try {
			const response = await examApi.getDetailByID(parseInt(Router.query?.slug + ''))
			if (response.status === 200) {
				dispatch(setCurrentPackage(response.data.data))
				dispatch(setTotalPoint(response.data.totalPoint))
			} else {
				dispatch(setCurrentPackage([]))
				dispatch(setTotalPoint(0))
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	return (
		<>
			<div
				onClick={() => {
					setIsModalVisible(true)
					!!onOpen && onOpen()
				}}
				className="p-2 w-full text-[#a62ed6] rounded-[4px] inline-flex items-center font-[600] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer active:!bg-[rgba(0,0,0,0.1)]"
			>
				<HiOutlineViewGridAdd size={18} className="mr-2" /> Thêm nhóm ngẫu nhiên
			</div>

			<Modal
				centered
				title="Thêm nhóm ngẫu nhiên"
				width={500}
				visible={isModalVisible}
				onCancel={() => !loading && setIsModalVisible(false)}
				footer={
					<>
						<PrimaryButton disable={loading} onClick={() => setIsModalVisible(false)} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton loading={loading} onClick={() => form.submit()} className="ml-2" background="green" icon="save" type="button">
							Thêm
						</PrimaryButton>
					</>
				}
			>
				<Form disabled={loading} form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item label="Số lượng nhóm" name="amount" rules={formRequired}>
						<NumericFormat disabled={loading} className="primary-input w-full px-2" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default QuickAddGroup
