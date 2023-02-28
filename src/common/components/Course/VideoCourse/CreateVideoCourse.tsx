import { Form, Input, Modal, TreeSelect } from 'antd'
import { useEffect, useState } from 'react'
import InputText from '~/common/components/FormControl/InputTextField'
import PrimaryButton from '~/common/components/Primary/Button'
import UploadImageField from '../../FormControl/UploadImageField'
import Lottie from 'react-lottie-player'

import deleteJson from '~/common/components/json/15120-delete.json'
import { ShowNostis } from '~/common/utils'
import RestApi from '~/api/RestApi'
import ModalFooter from '../../ModalFooter'
import InputNumberField from '../../FormControl/InputNumberField'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import TextBoxField from '../../FormControl/TextBoxField'
import { removeCommas } from '~/common/utils/super-functions'

const { SHOW_PARENT } = TreeSelect

type TProps = {
	onRefresh?: Function
	isEdit?: boolean
	defaultData?: any
}

const url = 'product'

const CreateVideoCourse = (props: TProps) => {
	const { onRefresh, isEdit, defaultData } = props

	const [visible, setvisible] = useState(false)
	const [isUploading, setUploading] = useState(false)
	const [loading, setLoading] = useState<boolean>(false)

	const [tags, setTags] = useState<any>([])

	const [form] = Form.useForm()

	const toggle = () => {
		setvisible(!visible)
	}

	useEffect(() => {
		if (visible) {
			getTags()
		}
	}, [visible])

	/**
	 * It takes an array of objects, and returns an array of objects
	 * @param params - The array of tags that we get from the API
	 */
	function formatTreeData(params) {
		const result = []

		const tagsByCategory = params.reduce((acc, tag) => {
			if (!acc[tag.TagCategoryId]) {
				acc[tag.TagCategoryId] = {
					title: tag.TagCategoryName,
					value: 'parent-' + tag.TagCategoryId,
					key: 'parent-' + tag.TagCategoryId,
					children: []
				}
			}

			acc[tag.TagCategoryId].children.push({
				title: tag.Name,
				value: tag.Id,
				key: tag.Id
			})

			return acc
		}, {})

		for (const categoryId in tagsByCategory) {
			result.push(tagsByCategory[categoryId])
		}

		if (!!isEdit) form.setFieldValue('Tags', convertToArray(defaultData?.Tags))

		setTags(result)
	}

	const getTags = async () => {
		try {
			let res = await RestApi.get<any>('Tag', { type: 1 })
			if (res.status == 200) {
				formatTreeData(res.data.data)
			}
		} catch (error) {
			ShowNostis.error(error.message)
		} finally {
		}
	}

	const post = async (params) => {
		setLoading(true)
		try {
			let res = await RestApi.post(url, params)
			if (res.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				toggle()
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error.message)
		} finally {
			setLoading(false)
		}
	}

	const put = async (params) => {
		setLoading(true)
		try {
			let res = await RestApi.put(url, { ...params, Id: defaultData?.Id })
			if (res.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				toggle()
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error.message)
		} finally {
			setLoading(false)
		}
	}

	function convertToString(arr) {
		if (!arr) return ''
		return arr.join(',')
	}

	function convertToArray(str) {
		if (!str) return []
		return str.split(',').map(Number)
	}

	const onFinish = (params) => {
		const DATA_SUBMIT = {
			...params,
			Price: removeCommas(params?.Price),
			Tags: convertToString(params?.Tags),
			MarkQuantity: 0,
			Type: 1,
			BeforeCourseId: 0
		}

		console.log('--- DATA_SUBMIT: ', DATA_SUBMIT)

		if (!isEdit) {
			post(DATA_SUBMIT)
		}

		if (isEdit) {
			put(DATA_SUBMIT)
		}
	}

	function onEdit() {
		if (!!defaultData) {
			form.setFieldsValue(defaultData)
			form.setFieldValue('Tags', [])
		}
		toggle()
	}

	function getModalTitle() {
		if (!!isEdit) {
			return 'Cập nhật khoá học'
		}
		return 'Thêm khoá học'
	}

	function submit() {
		form.submit()
	}

	const tProps = {
		treeCheckable: true,
		showCheckedStrategy: SHOW_PARENT,
		style: {
			width: '100%'
		}
	}

	return (
		<>
			{!isEdit && (
				<div className="px-1 flex justify-center">
					<PrimaryButton className="!hidden w500:!flex" background="green" type="button" icon="add" onClick={toggle}>
						Thêm khoá
					</PrimaryButton>
					<PrimaryButton className="!flex w500:!hidden !pr-[-4px]" background="green" type="button" icon="add" onClick={toggle} />
				</div>
			)}

			{!!isEdit && (
				<PrimaryButton background="green" type="button" icon="edit" onClick={onEdit}>
					Cập nhật
				</PrimaryButton>
			)}

			<Modal
				width={600}
				title={getModalTitle()}
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submit} />}
			>
				<Form className="grid grid-cols-2 gap-x-4" layout="vertical" form={form} onFinish={onFinish}>
					<div className="col-span-2">
						<UploadImageField form={form} name="Thumbnail" label="Ảnh thu nhỏ" setIsLoadingImage={(status) => setUploading(status)} />
					</div>

					<Form.Item className="col-span-1" label="Tên khóa học" name="Name" rules={formRequired}>
						<Input className="primary-input" placeholder="Nhập tên khóa học" />
					</Form.Item>

					<InputNumberField
						name="Price"
						label="Giá"
						isRequired={true}
						rules={[{ required: true, message: 'Không được bỏ trống' }]}
						placeholder="Nhập số tiền"
					/>

					<Form.Item className="col-span-2" label="Từ khoá tìm kiếm" name="Tags" rules={formNoneRequired}>
						<TreeSelect className="primary-input" placeholder="Chọn từ khoá" maxTagCount={4} {...tProps} treeData={tags} />
					</Form.Item>

					<TextBoxField label="Mô tả" className="col-span-2" name="Description" />
				</Form>
			</Modal>
		</>
	)
}

export default CreateVideoCourse
