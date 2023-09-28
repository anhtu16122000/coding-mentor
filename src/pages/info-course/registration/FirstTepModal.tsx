import { Form, Input, InputNumber, Modal, Popover, Select, Tree } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { ShowNostis } from '~/common/utils'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { Filter } from 'react-feather'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { branchApi } from '~/api/manage/branch'
import { useDispatch } from 'react-redux'
import { setFilterBranchs, setFilterClass, setFilterPrograms } from '~/store/filterReducer'
import { programApi } from '~/api/learn/program'
import RestApi from '~/api/RestApi'
import NumericInput from '~/common/pages/nearing-completion/NumberInput'
import PrimaryButton from '~/common/components/Primary/Button'
import ModalFooter from '~/common/components/ModalFooter'

const FirstTepModal = (props) => {
	const { filters, onSubmit, onReset, curStep } = props

	const [form] = Form.useForm()

	const dispatch = useDispatch()

	const [visible, setVisible] = useState(false)
	const [numberValue, setNumberValue] = useState<string>('1')

	const branches = useSelector((state: RootState) => state.filter.Branchs)
	const programs = useSelector((state: RootState) => state.filter.Programs)
	const classes = useSelector((state: RootState) => state.filter.Classes)

	const [tags, setTags] = useState([])

	useEffect(() => {
		if (visible) {
			if (branches.length == 0) {
				getBranchs()
			}

			if (programs.length == 0) {
				getPrograms()
			}
		}
	}, [visible])

	const getBranchs = async () => {
		try {
			const response = await branchApi.getAll({ pageIndex: 1, pageSize: 99999 })
			if (response.status == 200) {
				dispatch(setFilterBranchs(response.data.data))
			} else {
				dispatch(setFilterBranchs([]))
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const getClasses = async () => {
		try {
			const response = await RestApi.get<any>('Class', { pageIndex: 1, pageSize: 99999, types: '1,2' })
			if (response.status == 200) {
				dispatch(setFilterClass(response.data.data))
			} else {
				dispatch(setFilterClass([]))
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const getPrograms = async () => {
		try {
			const response = await programApi.getAll({ pageSize: 9999, pageIndex: 1 })
			if (response.status == 200) {
				dispatch(setFilterPrograms(response.data.data))
			} else {
				dispatch(setFilterPrograms([]))
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	function toggle() {
		setVisible(!visible)
	}

	function onFinish(params) {
		const DATA_SUBMIT = {
			...filters,
			...params,
			sort: 1
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!!onSubmit && onSubmit(DATA_SUBMIT)

		toggle()
	}

	return (
		<>
			{curStep == 1 && (
				<PrimaryButton onClick={() => setVisible(true)} background="blue" icon="enter" type="button">
					Xếp lớp
				</PrimaryButton>
			)}

			{curStep > 1 && (
				<PrimaryButton onClick={onReset} background="red" icon="cancel" type="button">
					Huỷ
				</PrimaryButton>
			)}

			<Modal
				width={500}
				title="Xếp lớp"
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<div className={`w-full`}>
						<PrimaryButton className="" onClick={() => setVisible(false)} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton className="ml-[8px]" onClick={form.submit} type="button" icon="enter" background="blue">
							Tiếp
						</PrimaryButton>
					</div>
				}
			>
				<div>
					<Form
						form={form}
						className="grid grid-cols-2 gap-x-4"
						layout="vertical"
						initialValues={{ remember: true }}
						onFinish={onFinish}
						autoComplete="on"
					>
						<Form.Item className="col-span-2" name="branchIds" label="Trung tâm" rules={formRequired}>
							<Select placeholder="Chọn trung tâm" allowClear>
								{branches.map((item) => {
									return (
										<Select.Option key={item.Id} value={item.Id}>
											{item?.Name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>

						<Form.Item className="col-span-2" name="programIds" label="Chương trình" rules={formRequired}>
							<Select placeholder="Chọn chương trình" allowClear>
								{programs.map((item) => {
									return (
										<Select.Option key={item.Id} value={item.Id}>
											{item?.Name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>

						{/* {!!showClass && (
							<Form.Item className="col-span-2" name="classId" label="Lớp học" rules={formNoneRequired}>
								<Select placeholder="Chọn lớp học" allowClear>
									{classes.map((item) => {
										return (
											<Select.Option key={item.Id} value={item.Id}>
												{item?.Name}
											</Select.Option>
										)
									})}
								</Select>
							</Form.Item>
						)} */}
					</Form>

					{/* <FooterFilters onSubmit={submitForm} onReset={resetForm} /> */}
				</div>
			</Modal>
		</>
	)
}

export default FirstTepModal
