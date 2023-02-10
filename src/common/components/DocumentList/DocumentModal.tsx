import { Modal, Spin, Form, Input } from 'antd'
import React, { useState, useEffect } from 'react'
import { Edit, RotateCcw, Trash, X } from 'react-feather'
import { IoMdTrash } from 'react-icons/io'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { documentCategoryApi } from '~/api/document-category'
import { ShowNoti } from '~/common/utils'
import InputTextField from '~/common/components/FormControl/InputTextField'

const DocumentModal = (props) => {
	const { type, cateID, onFetchData, CategoryName, curriculumID } = props
	const [isVisible, setIsVisible] = useState(false)
	const [submitLoading, setSubmitLoading] = useState({ type: '', loading: false })
	const [form] = Form.useForm()

	const addDocument = async (data) => {
		console.log('add category', data)
		setSubmitLoading({ type: 'UPLOADING', loading: true })
		try {
			let res = await documentCategoryApi.add({ ...data, CurriculumnID: curriculumID })
			if (res.status === 200) {
				ShowNoti('success', 'Thành công!')
				setIsVisible(false)
				form.resetFields()
				onFetchData && onFetchData()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false })
		}
	}

	const editDocument = async (data) => {
		setSubmitLoading({ type: 'UPLOADING', loading: true })
		try {
			let res = await documentCategoryApi.update(data)
			if (res.status == 200) {
				ShowNoti('success', 'Thành công!')
				setIsVisible(false)
				form.resetFields()
				onFetchData && onFetchData()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false })
		}
	}

	const _onSubmit = (value) => {
		console.log('value', value)
		if (type == 'ADD_DOC') {
			addDocument(value)
		}
		if (type == 'EDIT_DOC') {
			editDocument({ ...value, ID: cateID })
		}
		if (type == 'DELETE_DOC') {
			console.log({ CategoryName: CategoryName, ID: cateID, Enable: false })
			editDocument({ ID: cateID, CategoryName: CategoryName, Enable: 'false' })
		}
	}

	return (
		<>
			{type == 'ADD_DOC' && (
				<button
					onClick={() => {
						setIsVisible(true)
					}}
					className="btn btn-warning"
				>
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm mới
				</button>
			)}
			{type == 'EDIT_DOC' && (
				<button
					onClick={() => {
						setIsVisible(true)
						form.resetFields()
					}}
					className="btn btn-icon edit"
				>
					<Edit />
				</button>
			)}
			{type == 'DELETE_DOC' && (
				<button
					onClick={() => {
						setIsVisible(true)
					}}
					className="btn btn-icon delete"
				>
					<Trash />
				</button>
			)}

			<Modal
				title={
					(type == 'ADD_DOC' && 'Thêm loại tài liệu') ||
					(type == 'DELETE_DOC' && 'Xóa loại tài liệu') ||
					(type == 'EDIT_DOC' && 'Sửa loại tài liệu')
				}
				onCancel={() => setIsVisible(false)}
				visible={isVisible}
				footer={false}
			>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="row">
						{(type == 'ADD_DOC' && (
							<div className="col-12">
								{/* <Form.Item label="Tên loại tài liệu" name="CategoryName">
									<Input onChange={(event) => {}} name="CategoryName" placeholder="Tên loại tài liệu" className="style-input" />
								</Form.Item> */}
								<InputTextField label="Tên loại tài liệu" name="CategoryName" />
							</div>
						)) ||
							(type == 'DELETE_DOC' && (
								<div className="col-12 justify-content-center">
									<h4 className="text-center">Bạn xác nhận muốn xóa loại tài liệu này?</h4>
								</div>
							)) ||
							(type == 'EDIT_DOC' && (
								<div className="col-12">
									{/* <Form.Item label="Tên loại tài liệu" name="CategoryName">
										<Input
											onChange={(event) => {}}
											name="CategoryName"
											placeholder="Tên loại tài liệu"
											className="style-input"
											defaultValue={CategoryName}
										/>
									</Form.Item> */}
									<InputTextField label="Tên loại tài liệu" name="CategoryName" />
								</div>
							))}

						<div className="col-12 mt-3 text-center">
							<button type="submit" className={`btn ${type == 'DELETE_DOC' ? 'btn-danger' : 'btn-primary'}`}>
								{type == 'DELETE_DOC' ? (
									<>
										<IoMdTrash size={18} className="mr-2" />
										Xóa
									</>
								) : (
									<>
										<MdSave size={18} className="mr-2" />
										Lưu
									</>
								)}
								{submitLoading.type == 'UPLOADING' && submitLoading.loading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default DocumentModal
