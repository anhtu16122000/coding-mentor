import { Form, Modal } from 'antd'
import { useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import SelectField from '../FormControl/SelectField'
import PrimaryButton from '../Primary/Button'

const PaymentPerForm = (props) => {
	const { onRefresh } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)
	const [user, setUser] = useState([])

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			const res = await RestApi.post('/PaymentAllow', data)
			if (res.status === 200) {
				setIsModalVisible(false)
				onRefresh()
				ShowNostis.success('Thành công')
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error.message)
		}
		setIsLoading(false)
	}

	const getAllUserAvailable = async () => {
		try {
			const response = await RestApi.get<any>('/PaymentAllow/user-available', {})
			if (response.status === 200) {
				let temp = []
				response?.data?.data?.forEach((item) => {
					temp.push({ title: `${item?.FullName} - ${item?.UserCode}`, value: item?.UserInformationId })
				})
				setUser(temp)
			}
			if (response.status === 204) {
				setUser([])
			}
		} catch (error) {
			console.error(error)
		} finally {
		}
	}

	useEffect(() => {
		if (!!isModalVisible) getAllUserAvailable()
	}, [isModalVisible])

	return (
		<>
			<PrimaryButton onClick={() => setIsModalVisible(true)} type="button" icon="add" background="green">
				Thêm mới
			</PrimaryButton>

			<Modal title={<>Thêm mới</>} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<SelectField mode="multiple" label="Nhân viên" name="UserIds" optionList={user} placeholder="Chọn nhân viên" isRequired />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<PrimaryButton className="w-full" icon="save" background="blue" type="submit" disable={isLoading} loading={isLoading}>
									Lưu
								</PrimaryButton>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default PaymentPerForm
