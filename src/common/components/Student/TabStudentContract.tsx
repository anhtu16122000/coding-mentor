import { Form } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { contractApi } from '~/api/contract'
import EditorField from '../FormControl/EditorField'
import { useReactToPrint } from 'react-to-print'
import PrimaryButton from '../Primary/Button'
import ReactHtmlParser from 'react-html-parser'
import { FormPrintImport } from './FormPrintImport'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import SelectField from '../FormControl/SelectField'
import InputTextField from '../FormControl/InputTextField'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

export interface ITabStudentContractProps {
	StudentDetail: IUserResponse
}

export default function TabStudentContract(props: ITabStudentContractProps) {
	const { StudentDetail } = props
	const [todoApi, setTodoApi] = useState({ pageIndex: 1, pageSize: PAGE_SIZE, StudentId: StudentDetail.UserInformationId })
	const printAreaRef = useRef<HTMLTableElement>(null)
	const [contracts, setContracts] = useState({ option: [], list: [] })
	const [contract, setContract] = useState(null)
	const [contractPattern, setContractPattern] = useState(null)
	const [modeEdit, setModeEdit] = useState('edit')
	const [form] = Form.useForm()
	const userInformation = useSelector((state: RootState) => state.user.information)

	const getContractList = async (studentID) => {
		try {
			const res = await contractApi.getAll(todoApi)
			if (res.status === 200) {
				let temp = []
				res.data.data.forEach((item) => temp.push({ title: item.Name, value: item.Id }))
				setContracts({ option: temp, list: res.data.data })
				handleChangeContract(res.data.data[0].Content, res.data.data[0].Name)
				form.setFieldValue('ContractID', temp[0].value)
				form.setFieldValue('Name', temp[0].title)
				console.log('🚀 ~ temp', temp)
			}
			if (res.status === 204) {
			}
		} catch (err) {}
	}

	const getContractPattern = async () => {
		try {
			const res = await contractApi.getByStudentID(StudentDetail.UserInformationId)
			if (res.status === 200) {
				setContractPattern(res.data.data)
			}
			if (res.status === 204) {
			}
		} catch (err) {}
	}

	useEffect(() => {
		setTodoApi({ ...todoApi, StudentId: StudentDetail.UserInformationId })
		getContractPattern()
	}, [StudentDetail])

	useEffect(() => {
		getContractList(StudentDetail.UserInformationId)
	}, [])

	const handlePrint = useReactToPrint({
		content: () => printAreaRef.current,
		// documentTitle: "AwesomeFileName",
		// onBeforeGetContent: handleOnBeforeGetContent,
		// onBeforePrint: () => ,
		// onAfterPrint: () => ,
		removeAfterPrint: true
	})
	const handleGetDataToPrint = () => {
		handlePrint()
	}

	const handleChangeContract = (content, name) => {
		setContract(content)
		form.setFieldValue('Content', content)
		form.setFieldValue('Name', name)
	}

	const onSubmit = async (data) => {
		try {
			const res =
				modeEdit == 'add'
					? await contractApi.addContract({ Name: data.Name, Content: data.Content, StudentId: StudentDetail.UserInformationId })
					: await contractApi.update({ Name: data.Name, Content: data.Content, Id: data.ContractID })
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				getContractList(StudentDetail.UserInformationId)
				setModeEdit('edit')
				handleChangeContract(contracts.option[0].value, contracts.option[0].title)
				form.setFieldValue('ContractID', contracts.option[0].value)
				form.setFieldValue('Name', null)
				form.setFieldValue('Content', null)
			}
			if (res.status === 204) {
			}
		} catch (err) {
			ShowNoti('success', err.message)
		}
	}

	return (
		<div className="wrapper-config-template">
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				<div className="flex justify-end items-center">
					<div className="flex gap-tw-4 justify-end items-start">
						{modeEdit == 'edit' && (
							<>
								<SelectField
									name="ContractID"
									label=""
									optionList={contracts.option}
									placeholder="Chọn hợp đồng"
									onChangeSelect={(data) => {
										if (data) {
											let temp = contracts.list.filter((item) => item.Id == data)[0]
											handleChangeContract(temp.Content, temp.Name)
										} else {
											handleChangeContract(null, null)
										}
									}}
								/>

								<PrimaryButton background="green" type="submit" children={<span>Lưu thay đổi</span>} icon="save" onClick={() => {}} />
							</>
						)}
						{modeEdit == 'edit' && userInformation.RoleId !== '3' && (
							<PrimaryButton
								background="blue"
								type="button"
								children={<span>Tạo hợp đồng</span>}
								icon="add"
								onClick={() => {
									setModeEdit('add')
									setContract(null)
									form.setFieldValue('Content', contractPattern)
									form.setFieldValue('Name', null)
								}}
							/>
						)}
					</div>
				</div>

				{userInformation.RoleId !== '3' && <InputTextField name="Name" label="Tên hợp đồng" placeholder="Nhập tên hộp đồng" />}

				{userInformation.RoleId !== '3' ? (
					<EditorField name="Content" label="Nội dung hợp đồng" onChangeEditor={(value) => form.setFieldValue('Content', value)} />
				) : (
					<p className="form-print-import">{ReactHtmlParser(contract)}</p>
				)}

				{modeEdit == 'add' && (
					<div className="flex gap-4 justify-end items-center">
						<PrimaryButton
							background="red"
							type="button"
							children={<span>Hủy</span>}
							icon="cancel"
							onClick={() => {
								setModeEdit('edit')
								handleChangeContract(contracts.option[0].value, contracts.option[0].title)
								form.setFieldValue('ContractID', contracts.option[0].value)
							}}
						/>
						<PrimaryButton background="blue" type="submit" children={<span>Tạo hợp đồng</span>} icon="add" />
					</div>
				)}
				{contract && modeEdit == 'edit' && (
					<div className="flex gap-4 justify-end items-center">
						<PrimaryButton background="green" type="button" children={<span>In</span>} icon="print" onClick={handleGetDataToPrint} />
					</div>
				)}

				<div className="hidden">
					<FormPrintImport data={contract ? contract : null} defaultValues={print} printAreaRef={printAreaRef} />
				</div>
			</Form>
		</div>
	)
}
