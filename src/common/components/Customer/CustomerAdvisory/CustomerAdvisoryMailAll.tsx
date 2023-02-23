import { Card, Form, Switch } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/branch'
import { generalNotificationApi } from '~/api/general-notification'
import { permissionApi } from '~/api/permission'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray, parseSelectArrayUser } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'
import SelectField from '~/common/components/FormControl/SelectField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import EditorField from '~/common/components/FormControl/EditorField'
import PrimaryButton from '~/common/components/Primary/Button'
import { customerAdviseApi } from '~/api/customer'
import { useRouter } from 'next/router'
import appConfigs from '~/appConfig'
import Head from 'next/head'

const CustomerAdvisoryMailAll = () => {
	const [form] = Form.useForm()
	const [userSelect, setUserSelect] = useState([])
	const [selectAllUser, setSelectAllUser] = useState(false)
	const router = useRouter()

	const getAllCustomer = async () => {
		try {
			const res = await customerAdviseApi.getAll({ pageSize: 9999 })
			if (res.status === 200) {
				const convertData = parseSelectArrayUser(res.data.data, 'FullName', 'Code', 'Id')
				setUserSelect(convertData)
				setSelectAllUser(true)
			}
			if (res.status === 204) {
				setUserSelect([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		getAllCustomer()
	}, [])

	useEffect(() => {
		if (selectAllUser) {
			const defaultSelectAllUser = userSelect?.map((user) => {
				return user.value
			})
			form.setFieldsValue({ Ids: defaultSelectAllUser })
		} else {
			form.setFieldsValue({ Ids: [] })
		}
	}, [selectAllUser])

	const handleSelectAllUser = (checked) => {
		setSelectAllUser(checked)
	}

	const onSubmit = async (data) => {
		if (data.Ids.length > 0) {
			try {
				const DATA_SUBMIT = {
					...data,
					Ids: data.Ids.join(',')
				}
				const res = await customerAdviseApi.sendEmail(DATA_SUBMIT)
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
					router.push('/users/customer')
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		} else {
			ShowNoti('error', 'Vui lòng chọn người gửi')
		}
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Gửi thông báo</title>
			</Head>

			<Card title="Gửi thông báo">
				<Form layout="vertical" form={form} onFinish={onSubmit}>
					<SelectField
						className="label-full"
						mode="multiple"
						name="Ids"
						label={
							<div className="antd-custom-wrap ant-form-item-label flex items-center justify-between">
								<span>Tài khoản</span>
								<div>
									<span className="mr-2">Chọn tất cả</span>
									<Switch checked={selectAllUser} onChange={handleSelectAllUser} />
								</div>
							</div>
						}
						optionList={userSelect}
					/>
					<InputTextField name="Title" label="Tiêu đề" />
					<EditorField name="Content" label="Nội dung" onChangeEditor={(value) => form.setFieldsValue({ Content: value })} />
					<div className="antd-custom-wrap ant-form-item-label flex items-center justify-between">
						<PrimaryButton background="blue" type="submit" icon="send">
							Gửi
						</PrimaryButton>
					</div>
				</Form>
			</Card>
		</>
	)
}

export default CustomerAdvisoryMailAll
