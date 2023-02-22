import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Select, Upload } from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { FC, useEffect, useState } from 'react'
import { FaEdit, FaTelegramPlane, FaUserFriends } from 'react-icons/fa'
import { IoMdImages } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { UploadFileApi } from '~/api/common/upload-image'
import RestApi from '~/api/RestApi'
import { useNewsContext } from '~/common/providers/News'
import { log, ShowNostis } from '~/common/utils'
import { RootState } from '~/store'
import Avatar from '../../Avatar'
import BaseLoading from '../../BaseLoading'
import SelectField from '../../FormControl/SelectField'
import PrimaryTooltip from '../../PrimaryTooltip'
import MainCreate from './main-create'

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = (error) => reject(error)
	})

const CreateNews: FC<TCreateNews> = (props) => {
	const { onRefresh, isEdit, defaultData, onOpen } = props

	const user = useSelector((state: RootState) => state.user.information)

	const { currentGroup } = useNewsContext()

	// ---------
	const [previewOpen, setPreviewOpen] = useState(false)
	const [previewImage, setPreviewImage] = useState('')
	const [previewTitle, setPreviewTitle] = useState('')
	const [visible, setVisible] = useState(false)

	const [haveImage, setHaveImage] = useState(false)
	const [fileList, setFileList] = useState([])
	const [currentContent, setCurrentContent] = useState('')

	const [listBranch, setListBranch] = useState<IBranch[] | []>([])
	const [branchIdSelect, setBranchIdSelect] = useState([])
	const handleCancel = () => setPreviewOpen(false)

	const handlePreview = async (file: UploadFile) => {
		console.log('đang ở trên đây')

		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile)
		}
		setPreviewImage(file.url || (file.preview as string))
		setPreviewOpen(true)
		setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
		console.log('dang ở đây')
	}

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Thêm ảnh</div>
		</div>
	)

	const [posting, setPosting] = useState(false)

	async function uploadFile() {
		let uploadFiles = []
		fileList.forEach((element) => {
			if (!element?.fileType) {
				uploadFiles.push(element?.originFileObj)
			}
		})

		try {
			let temp = []
			let flag = false
			if (uploadFiles.length > 0) {
				for (let i = 0; i < uploadFiles.length; i++) {
					let element = uploadFiles[i]
					if (i == uploadFiles.length - 1) {
						flag = true
					}
					if (!!element) {
						const response = await UploadFileApi.uploadImage(element)
						if (response.status == 200) {
							temp.push({ FileUrl: response.data.data })
						}
					}
				}
			} else {
				flag = true
			}
			if (flag) {
				const DATA_SUBMIT = {
					Content: currentContent,
					Color: '',
					BackGroundUrl: '',
					ListBranchId: []
				}
				if (!isEdit) {
					postNews({ ...DATA_SUBMIT, FileListCreate: temp, NewsFeedGroupId: currentGroup || null })
				} else {
					const oldData = fileList.filter((item) => item.FilteUrl || item.FileName)
					putNews({ Id: defaultData?.Id, ...DATA_SUBMIT, FileListUpdate: [...temp, ...oldData] })
				}
			}
		} catch (error) {
			ShowNostis.error(error?.message)
			setPosting(false)
		}
	}

	function submitPost() {
		setPosting(true)
		uploadFile()
	}

	const getAllBranch = async () => {
		try {
			const response = await RestApi.get<IBranch[]>('Branch', {})
			setListBranch(response.data.data)
		} catch (err) {
			console.log('🚀 ~ file: index.tsx:130 ~ getAllBranch ~ err', err)
		}
	}

	useEffect(() => {
		if (!currentGroup) getAllBranch()
	}, [])

	async function postNews(params) {
		try {
			if (currentGroup) {
				params.NewsFeedGroupId = currentGroup
			} else {
				params.ListBranchId = branchIdSelect
			}

			let response = await RestApi.post('NewsFeed', params)
			if (response.status == 200) {
				onRefresh()
				setVisible(false)
				setCurrentContent('')
				setFileList([])
				setBranchIdSelect([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setPosting(false)
		}
	}

	async function putNews(params) {
		console.log('--- DATA_SUBMIT: ', params)
		try {
			const response = await RestApi.put('NewsFeed', params)
			if (response.status == 200) {
				onRefresh()
				setVisible(false)
				setCurrentContent('')
				setFileList([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setPosting(false)
		}
	}

	function _openEdit() {
		let temp = []

		if (!!defaultData?.FileList) {
			setHaveImage(true)
			defaultData.FileList.forEach((file, index) => {
				temp.push({ ...file, url: file.FileUrl, uid: file.FileName })
			})
		}

		setFileList([...temp])
		onOpen()
		setCurrentContent(defaultData.Content)
		setVisible(true)
	}

	return (
		<>
			{!isEdit && <MainCreate onClick={() => setVisible(true)} setHaveImage={setHaveImage} />}

			{isEdit && (
				<div className="cc-comment-menu-item" onClick={() => _openEdit()}>
					<FaEdit className="text-[#1E88E5] ml-[2px]" size={18} />
					<span>Chỉnh sửa</span>
				</div>
			)}

			<Modal className="cc-news" open={visible} width={600} closable={false} title={null} footer={null} onCancel={() => setVisible(false)}>
				<div className="mb-[16px]">
					<div className="cc-news-modal-user">
						<Avatar uri={user?.Avatar} className="cc-news-avatar" />
						<div className="mt-[-4px]">
							<span>{user?.FullName}</span>
							<div className="flex">
								<div className="cc-news-role-tag">
									<FaUserFriends size={14} className="mr-[8px]" /> {user?.role}
								</div>
							</div>
						</div>
					</div>

					<textarea
						disabled={posting}
						value={currentContent}
						onChange={(e) => setCurrentContent(e.target.value)}
						placeholder="Nhập nội dung . . ."
						rows={6}
					/>

					{!currentGroup && (
						<div className="cc-news-branch-wrapper">
							<Select
								mode="multiple"
								className="cc-news-branch-wrapper"
								placeholder="Chọn chi nhánh"
								onChange={(value) => setBranchIdSelect(value)}
								value={branchIdSelect}
							>
								{listBranch?.map((branch: IBranch) => (
									<Select.Option value={branch.Id} key={branch.Id}>
										{branch.Name} - {branch.Code}
									</Select.Option>
								))}
							</Select>
						</div>
					)}

					{haveImage && (
						<>
							<div className="cc-hr my-[16px]" />
							<Upload
								disabled={posting}
								listType="picture-card"
								fileList={fileList}
								onPreview={handlePreview}
								onRemove={(event) => {}}
								onChange={handleChange}
							>
								{fileList.length >= 8 ? null : uploadButton}
							</Upload>
							<Modal width={1000} centered open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
								{previewImage.includes('.mp4') && (
									<video className="shadow-md" controls id="video" src={previewImage}>
										<source src={previewImage} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								)}
								{!previewImage.includes('.mp4') && (
									<img className="shadow-md" draggable={false} alt="example" style={{ width: '100%' }} src={previewImage} />
								)}
							</Modal>
						</>
					)}
					<div className="cc-news-insert-wrapper">
						<div>Thêm vào bài viết</div>
						<PrimaryTooltip id="create-btn-img" content="Ảnh" place="left">
							<div onClick={() => setHaveImage(!haveImage)} className="cc-insert-image">
								<IoMdImages size={20} color={'#43A047'} />
							</div>
						</PrimaryTooltip>
					</div>
				</div>

				<Button
					className={`w-full flex items-center justify-center `}
					onClick={!posting && submitPost}
					loading={posting}
					disabled={posting}
					type="primary"
				>
					{posting ? '' : <FaTelegramPlane size={20} />}
					<div className="ml-[8px] font-[600]">{!isEdit ? 'Đăng bài' : 'Lưu'}</div>
				</Button>
			</Modal>
		</>
	)
}

export default CreateNews
