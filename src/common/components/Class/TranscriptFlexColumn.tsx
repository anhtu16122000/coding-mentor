import { Select, Tooltip } from 'antd'
import React, { useState } from 'react'
import PrimaryButton from '../Primary/Button'
import PrimaryTable from '../Primary/Table'
import { ModalTranscript } from './ModalTranscript'
import { scoreApi } from '~/api/configs/score'
import { ShowNoti } from '~/common/utils'
import ModalDraggableTableColumn from './ModalDraggableTableColumn'
import ModalCalculateAverage from './ModalCalculateAverage'

const FullScreenOrRestoreSize = ({ setOpenFullScreen, openFullSCreen }) => {
	return (
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
	)
}

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
	return (
		<PrimaryTable
			loading={loading}
			total={students?.length}
			onChangePage={(event: number) => {
				setPageIndex(event)
			}}
			data={dataTable}
			columns={columns}
			Extra={
				<div className="flex flex-col justify-end gap-3">
					<div className="flex gap-2 justify-end flex-wrap">
						<ModalTranscript mode="add" onRefresh={() => getTranscripts(classId)} />

						<Select
							className="w-[140px] custom-select-transcript"
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
					</div>
					<div className="flex gap-2 flex-wrap justify-end">
						{!isEditTable && (
							<ModalDraggableTableColumn
								classId={classId}
								data={colTemplate}
								setData={setColTemplate}
								handleRefresh={() => getColGradesTemplateById(classId)}
							/>
						)}
						{!isEditTable && (
							<ModalCalculateAverage classId={classId} transcriptId={transcriptId} refreshAllGrades={getTranscriptPointByClassId} />
						)}
						{isEditTable && (
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
						{isEditTable && (
							<PrimaryButton
								background="red"
								type="button"
								icon="cancel"
								// disable={disabled}
								onClick={() => {
									setIsEditTable(false)
								}}
								// loading={isLoading}
							>
								Hủy
							</PrimaryButton>
						)}

						{!isEditTable && (
							<PrimaryButton
								background="blue"
								type="button"
								icon="print"
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
