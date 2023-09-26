import { Select, Tooltip } from 'antd'
import React, { useRef, useState } from 'react'
import PrimaryButton from '../Primary/Button'
import PrimaryTable from '../Primary/Table'
import { ModalTranscript } from './ModalTranscript'
import ModalDraggableTableColumn from './ModalDraggableTableColumn'
import ModalCalculateAverage from './ModalCalculateAverage'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

// role như sau:
// admin = 1,
// teacher = 2,
// student = 3,
// manager = 4,
// sale = 5,
// accountant = 6,
// academic = 7,
// parents = 8,
// tutor = 9
// ADMIN MANAGER ACADEMIC  full quyền
// TEACHER = nhập điểm - crud đợt thi - tính điểm trung bình
// các roles còn lại chỉ được xem

const TransScriptFlexColumn = ({
	colTemplate,
	setColTemplate,
	getColGradesTemplateById,
	setPageIndex,
	students,
	dataTable,
	loading,
	setLoading,
	columns,
	getTranscripts,
	classId,
	setTranscriptId,
	getTranscriptPointByClassId,
	transcriptId,
	transcripts,
	isEditTable,
	setIsEditTable,
	setOpenFullScreen,
	openFullSCreen,
	gradeStudentsChange,
	submitGradesConcurrently
}) => {
	const { RoleId } = useSelector((state: RootState) => state.user.information)
	const isFullPermission = [1, 4, 7].includes(Number(RoleId))
	const isTeacherPermission = [2].includes(Number(RoleId))
	const isJustViewable = [3, 5, 6, 8, 9].includes(Number(RoleId))

	return (
		<PrimaryTable
			loading={loading}
			total={students?.length}
			onChangePage={(event: number) => {
				setPageIndex(event)
			}}
			data={dataTable}
			columns={columns}
			TitleCard={
				<div className="flex gap-2 flex-wrap justify-between w-[100%]">
					<div className="flex gap-2 justify-end flex-wrap">
						{(isFullPermission || isTeacherPermission) && <ModalTranscript mode="add" onRefresh={() => getTranscripts(classId)} />}
						<Select
							disabled={isEditTable}
							className="w-[220px] custom-select-transcript"
							onChange={(val) => {
								setTranscriptId(val)
								getTranscriptPointByClassId(classId, val)
							}}
							placeholder="Chọn đợt thi"
							value={transcriptId}
						>
							{transcripts?.map((item) => (
								<Select.Option key={item?.Id} value={item?.Id}>
									{item?.Name}
								</Select.Option>
							))}
						</Select>
						{(isFullPermission || isTeacherPermission) && (
							<ModalTranscript
								mode="delete"
								Id={transcriptId}
								onRefresh={() => {
									getTranscripts(classId)
									setTranscriptId(null)
									getTranscriptPointByClassId(classId, null)
								}}
								setTranscriptId={setTranscriptId}
							/>
						)}
					</div>
					<div className="flex gap-2 flex-wrap justify-start">
						{!isEditTable && isFullPermission && (
							<ModalDraggableTableColumn
								classId={classId}
								data={colTemplate}
								setData={setColTemplate}
								transcriptId={transcriptId}
								handleRefresh={() => {
									getTranscriptPointByClassId(classId, transcriptId)
									getColGradesTemplateById(classId)
								}}
							/>
						)}
						{!isEditTable && (isFullPermission || isTeacherPermission) && (
							<ModalCalculateAverage classId={classId} transcriptId={transcriptId} refreshAllGrades={getTranscriptPointByClassId} />
						)}
						{isEditTable && (isFullPermission || isTeacherPermission) && (
							<PrimaryButton
								background="blue"
								type="button"
								icon="save"
								onClick={() => {
									const updatedGrades = []
									Object.values(gradeStudentsChange.current).forEach((listGrades: any) => {
										listGrades.forEach((item) => {
											if (item?.isUpdate) {
												updatedGrades.push(item)
											}
										})
									})
									submitGradesConcurrently(updatedGrades)
								}}
								loading={loading}
							>
								Lưu tất cả
							</PrimaryButton>
						)}
						{isEditTable && (isFullPermission || isTeacherPermission) && (
							<PrimaryButton
								background="red"
								type="button"
								icon="cancel"
								onClick={() => {
									setIsEditTable(false)
								}}
							>
								Hủy
							</PrimaryButton>
						)}

						{!isEditTable && (isFullPermission || isTeacherPermission) && (
							<PrimaryButton
								background="blue"
								type="button"
								icon="input"
								disable={!transcriptId}
								onClick={() => {
									setIsEditTable(true)
								}}
							>
								Nhập điểm
							</PrimaryButton>
						)}
						<Tooltip title={`${openFullSCreen ? 'Thu nhỏ' : 'Toàn màn hình'}`}>
							<span>
								<PrimaryButton
									background="purple"
									type="button"
									icon={`${openFullSCreen ? 'restore-screen' : 'full-screen'}`}
									onClick={() => {
										setOpenFullScreen(!openFullSCreen)
									}}
								/>
							</span>
						</Tooltip>
					</div>
				</div>
			}
		/>
	)
}

export default TransScriptFlexColumn
