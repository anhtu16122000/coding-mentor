import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import * as yup from 'yup'
import InputTextField from '~/common/components/FormControl/InputTextField'
import SelectField from '~/common/components/FormControl/SelectField'
// import { useWrap } from '~/src/context/wrap'

let returnSchema = {}
let schema = null

const StudentExchangeForm = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { isLoading, rowID, _onSubmit, getIndex, index, rowData, listData } = props

	// const { showNoti } = useWrap()

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		UserInformationID: null,
		CounselorsID: null,
		FullNameUnicode: null
	}

	;(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit }
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống')
					break

				default:
					returnSchema[key] = yup.mixed().required('Bạn không được để trống')
					break
			}
		})

		schema = yup.object().shape(returnSchema)
	})()

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	// SUBMI FORM
	const onSubmit = (data: any, e) => {
		let cloneDataSubmit = {
			UserInformationID: data.UserInformationID,
			CounselorsID: data.CounselorsID
		}
		let res = _onSubmit(cloneDataSubmit, rowData)

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.reset(defaultValuesInit))
		})
	}

	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				form.reset(rowData)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowID ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
						getIndex(index)
					}}
				>
					<Tooltip title="Cập nhật tư vấn viên">
						<Edit />
					</Tooltip>
				</button>
			) : (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm mới
				</button>
			)}

			{/*  */}
			<Modal
				title={rowID ? 'Sửa HV chuyển giao' : 'Thêm HV chuyển giao'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
						<div className="row">
							<div className="col-12">
								<InputTextField disabled={true} name="FullNameUnicode" label="Họ tên" />
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 col-12">
								<SelectField name="CounselorsID" label="Tư vấn viên" optionList={listData.Counselors} />
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									<MdSave size={18} className="mr-2" />
									Lưu
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default StudentExchangeForm
