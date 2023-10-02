import { Modal, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import ModalFooter from '../../ModalFooter'
import { TbCertificate } from 'react-icons/tb'
import { HiOutlineEye } from 'react-icons/hi'
import { studentInClassApi } from '~/api/user/student-in-class'
import { ShowNoti } from '~/common/utils'
import { useRouter } from 'next/router'
import htmlParser from '../../HtmlParser'
import { templateCertificate } from '~/common/pages/configs/Certificate/UpdateCertificate/ModalViewCetificateExam'
import PrimaryButton from '../../Primary/Button'

const ViewCertificate = (props) => {
	const { data, onRefresh } = props

	const [loading, setLoading] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)

	const [cer, setCer] = useState(null)

	const router = useRouter()

	useEffect(() => {
		if (visible) {
			getCers()
		}
	}, [visible])

	// Lấy thông tin chứng chỉ của học viên đó
	const getCers = async () => {
		try {
			setLoading(true)
			const res = await studentInClassApi.getCers({ StudentId: data?.StudentId, ClassId: parseInt(router.query.class + '') })
			if (res.status == 200) {
				setCer(res.data.data)
			} else {
				setCer(null)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [exporting, setExporting] = useState<boolean>(false)

	const saveFile = async (url) => {
		const a = document.createElement('a')
		a.download = `chung-chi-${new Date().getTime()}.pdf`
		a.href = url
		a.click()
	}

	// Xuất file
	const exportCer = async () => {
		setExporting(true)
		try {
			const res = await studentInClassApi.expCers({
				StudentId: data?.StudentId,
				ClassId: parseInt(router.query.class + ''),
				Content: templateCertificate(cer?.Background, '', cer?.Content) || ''
			})

			if (res.status == 200) {
				console.log('---- res.data.data?.PDFUrl: ', res.data.data?.PDFUrl)

				// saveFile(res.data.data?.PDFUrl)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setExporting(false)
		}
	}

	const [deleting, setDeleting] = useState<boolean>(false)

	// Xoá file
	const delCer = async () => {
		setDeleting(true)
		try {
			const res = await studentInClassApi.delCer(data?.Id)
			if (res.status == 200) {
				ShowNoti('success', 'Thành công')
				onRefresh()
				setVisible(false)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setDeleting(false)
		}
	}

	return (
		<>
			<Tooltip placement="left" title="Xem chứng chỉ">
				<div onClick={() => setVisible(true)} className="pl-[8px] cursor-pointer text-[#8E24AA]">
					<HiOutlineEye size={22} />
				</div>
			</Tooltip>

			<Modal
				width={850}
				title="Chứng chỉ"
				onCancel={() => setVisible(false)}
				open={visible}
				footer={
					<div className="w-full all-center">
						<PrimaryButton loading={exporting} onClick={exportCer} background="blue" icon="download" type="button">
							Lưu file
						</PrimaryButton>

						<PrimaryButton className="ml-[8px]" loading={deleting} onClick={delCer} background="red" icon="cancel" type="button">
							Xoá chứng chỉ
						</PrimaryButton>
					</div>
				}
			>
				<div
					className="overflow-auto d-flex justify-center items-center"
					contentEditable="false"
					dangerouslySetInnerHTML={{ __html: templateCertificate(cer?.Background, '', cer?.Content) }}
				/>
			</Modal>
		</>
	)
}

export default ViewCertificate
