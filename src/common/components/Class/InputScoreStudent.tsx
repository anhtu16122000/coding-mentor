import { Card, Input, Modal, Select, Table, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

const InputScoreStudent = ({ value = '', gradeStudentsChange, isEditTable, dataCol, gradeStudents, dataRow }) => {
	const TYPE_STYLE = {
		1: {
			// điểm
			width: 'w-100%',
			textAlign: 'text-right',
			typeIp: 'number',
			placeHolder: 'Nhập điểm'
		},
		2: {
			// điểm trung bình
			width: 'w-100%',
			textAlign: 'text-right',
			typeIp: 'number'
		},
		3: {
			// ghi chú
			width: 'w-100%',
			textAlign: 'text-left',
			typeIp: 'text',
			placeHolder: 'Thêm ghi chú'
		}
	}
	const styleCell = TYPE_STYLE[Number(dataCol?.Type)]

	const [newValue, setNewValue] = useState(value)

	useEffect(() => {
		setNewValue(value)
	}, [value])

	useEffect(() => {
		if (!isEditTable) {
			setNewValue(value)
		}
	}, [isEditTable])

	const onChangeScoreStudent = (newValue, dataRow, dataCol) => {
		const { StudentId, TranscriptId } = dataRow
		const { Id: ScoreColumnId, ClassId } = dataCol

		// student đã có điểm trong template
		if (gradeStudentsChange.current?.[StudentId]) {
			const indexGradesInfo = gradeStudentsChange.current?.[StudentId].findIndex((item) => {
				return item?.StudentId == StudentId && item?.ScoreColumnId == ScoreColumnId
			})
			if (indexGradesInfo >= 0) {
				// column đã đưwợc set điểm
				gradeStudentsChange.current[StudentId][indexGradesInfo].Value = newValue
				gradeStudentsChange.current[StudentId][indexGradesInfo].isUpdate = true
			} else {
				// column này chưa set điểm
				gradeStudentsChange.current[StudentId] = [
					...gradeStudentsChange.current[StudentId],
					{
						ClassId: ClassId,
						StudentId: StudentId,
						TranscriptId: TranscriptId,
						ScoreColumnId: ScoreColumnId,
						Value: newValue,
						isUpdate: true
					}
				]
			}
		} else {
			// student chưa set điểm bất kỳ column template nào
			gradeStudentsChange.current[StudentId] = [
				{
					ClassId: ClassId,
					StudentId: StudentId,
					TranscriptId: TranscriptId,
					ScoreColumnId: ScoreColumnId,
					Value: newValue,
					isUpdate: true
				}
			]
		}
		setNewValue(newValue)
	}
	if (!isEditTable || Number(dataCol?.Type) === 2) {
		return <p className={`${styleCell.width} ${styleCell.textAlign}`}>{newValue || ''}</p>
	}

	return (
		<div className="flex justify-end">
			<Input
				placeholder={styleCell?.placeHolder || ''}
				value={newValue}
				type={styleCell.typeIp}
				className={`rounded-lg mb-0 ${styleCell.width} `}
				onChange={(e) => {
					onChangeScoreStudent(e?.target?.value, dataRow, dataCol)
				}}
			/>
		</div>
	)
}
export default InputScoreStudent
