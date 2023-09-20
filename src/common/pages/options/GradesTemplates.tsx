import { Modal, Switch } from 'antd'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { gradesTemplatesApi } from '~/api/configs/score-broad-templates'
import CenterForm from '~/common/components/Center/CenterForm'
import ModalAddGradesTemplates from '~/common/components/Configs/GradesTemplates/ModalAddGradesTemplates'
import ModalConfigSubject from '~/common/components/Configs/GradesTemplates/ModalConfigSubject'
import ModalDetailGradesTemplates from '~/common/components/Configs/GradesTemplates/ModalDetailGradesTemplates'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import PrimaryTable from '~/common/components/Primary/Table'
import { ShowNoti } from '~/common/utils'

const initParameters = { pageSize: 30, pageIndex: 1, search: '' }

function GradesTemplates() {
	const [loading, setLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(0)
	const [dataGradesTemplates, seDataGradesTemplates] = useState([])
	const [detailGrades, setDetailGrades] = useState({})
	const [isShowDetailGrades, setShowDetailGrades] = useState(false)
	const [isShowAddNewGrades, setShowAddNewGrades] = useState(false)
	const [isShowConfigSubject, setShowConfigSubject] = useState(false)
	const [parameter, setParameter] = useState(initParameters)

	const getGradesTemplates = useCallback(async (parameter) => {
		if (parameter.pageIndex < 1) return

		try {
			setLoading(true)
			const res = await gradesTemplatesApi.get(parameter)
			if (res.status === 200) {
				seDataGradesTemplates(res?.data?.data || [])
				setTotalPage(res?.data?.totalRow || 0)
			}
			if (res.status === 204) {
				if (parameter.pageIndex <= 1) {
					seDataGradesTemplates([])
				} else {
					setParameter({
						...parameter,
						pageIndex: parameter.pageIndex - 1
					})
				}
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}, [])

	const handleDeleteRow = async (id) => {
		try {
			const res = await gradesTemplatesApi.delete(id)
			if (res.status === 200) {
				ShowNoti('success', res?.data?.message)
				getGradesTemplates(parameter)
				return res
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	const columns = [
		{
			title: 'Mã',
			dataIndex: 'Code',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Tên',
			dataIndex: 'Name',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Thao tác',
			width: 160,
			fixed: 'right',
			dataIndex: 'action',
			render: (_, data, __) => (
				<>
					<IconButton
						type="button"
						icon="eye"
						color="blue"
						tooltip="Xem chi tiết"
						onClick={() => {
							setDetailGrades(data)
							setShowConfigSubject(true)
						}}
					/>
					<IconButton
						icon="edit"
						color="yellow"
						tooltip="Cập nhật"
						onClick={() => {
							setDetailGrades(data)
							setShowDetailGrades(true)
						}}
						type="button"
					/>
					<DeleteTableRow handleDelete={() => handleDeleteRow(data?.Id)} text={data?.Name || ''} />
				</>
			)
		}
	]

	useEffect(() => {
		getGradesTemplates(parameter)
	}, [parameter])

	return (
		<div>
			<PrimaryTable
				pageSize={parameter.pageSize}
				loading={loading}
				total={totalPage && totalPage}
				onChangePage={(event) => {
					setParameter({
						...parameter,
						pageIndex: event
					})
				}}
				TitleCard="Cấu hình bảng điểm chung"
				data={dataGradesTemplates}
				columns={columns}
				Extra={
					<PrimaryButton onClick={() => setShowAddNewGrades(true)} background="green" icon="add" type="button">
						Thêm mới
					</PrimaryButton>
				}
			/>
			<ModalConfigSubject isShow={isShowConfigSubject} data={detailGrades} onCancel={() => setShowConfigSubject(false)} />
			<ModalAddGradesTemplates
				isShow={isShowAddNewGrades}
				onCancel={() => {
					setShowAddNewGrades(false)
				}}
				refreshDataTable={() => getGradesTemplates(parameter)}
			/>

			<ModalDetailGradesTemplates
				isShow={isShowDetailGrades}
				data={detailGrades}
				onCancel={() => {
					setShowDetailGrades(false)
				}}
				refreshDataTable={() => getGradesTemplates(parameter)}
			/>
		</div>
	)
}

export default GradesTemplates
