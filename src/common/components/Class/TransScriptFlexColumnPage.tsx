import { Card, Input, Modal, Select, Table, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { transcriptApi } from '~/api/learn/transcript'
import { scoreApi } from '~/api/configs/score'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { studentInClassApi } from '~/api/user/student-in-class'
import { scoreColumnApi } from '~/api/configs/score-column'
import { transformArrayToObject } from '~/common/utils/array'
import InputScoreStudent from './InputScoreStudent'
import TransScriptFlexColumn from './TranscriptFlexColumn'

function TransScriptFlexColumnWrapper() {
	const router = useRouter()
	const { scoreBoardTemplateId = '', class: classId = '' } = router.query

	const [transcripts, setTranscripts] = useState([])
	const [transcriptId, setTranscriptId] = useState(null)
	const [colTemplate, setColTemplate] = useState([])
	const [gradeStudents, setGradeStudents] = useState({})
	const [isEditTable, setIsEditTable] = useState(false)
	const [openFullSCreen, setOpenFullScreen] = useState(false)
	const [students, setStudents] = useState([])
	const [loading, setLoading] = useState(false)
	const [pageIndex, setPageIndex] = useState(1)

	let gradeStudentsChange = useRef({})

	if (!isEditTable) gradeStudentsChange.current = { ...gradeStudents }

	let dataTable = []
	if (transcriptId) {
		dataTable = students.map((student) => {
			let infoGradesStudent = gradeStudents?.[student?.StudentId] ? [...gradeStudents?.[student?.StudentId]] : []

			const keyIndexAndTitleGrades = {}

			for (const gradesStudent of infoGradesStudent) {
				keyIndexAndTitleGrades[gradesStudent?.ScoreColumnId] = gradesStudent?.Value
				keyIndexAndTitleGrades[`GradesId-${gradesStudent?.Id}`] = gradesStudent?.Id
			}

			return {
				...student,
				...keyIndexAndTitleGrades,
				TranscriptId: transcriptId,
				StudentId: student?.StudentId,
				ClassId: infoGradesStudent?.[0]?.ClassId,
				ScoreColumnId: infoGradesStudent?.[0]?.ScoreColumnId
			}
		})
	}

	const gradesColumns = colTemplate.map((item) => ({
		title: item?.Name,
		dataIndex: item?.Id,
		render: (value, dataRow, index) => {
			return (
				<InputScoreStudent
					value={value}
					gradeStudentsChange={gradeStudentsChange}
					isEditTable={isEditTable}
					dataCol={item}
					gradeStudents={gradeStudents}
					dataRow={dataRow}
				/>
			)
		}
	}))

	const columns = [
		{
			title: 'Mã',
			dataIndex: 'UserCode'
		},
		{
			title: 'Tên học viên',
			dataIndex: 'FullName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		...gradesColumns
	]

	const getTranscriptPointByClassId = async (classId, transcriptId) => {
		setLoading(true)
		try {
			const res = await scoreApi.get({
				classId,
				transcriptId,
				pageSize: 999
			})
			if (res?.status === 200) {
				const gradesStudentObject = transformArrayToObject(res?.data?.data, 'StudentId')
				setGradeStudents(gradesStudentObject)
			}
			if (res?.status === 204) {
				setGradeStudents({})
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
		setLoading(false)
	}

	const getStudentByClassId = async (classId, pageIndex) => {
		setLoading(true)
		try {
			const res = await studentInClassApi.getAll({
				classId,
				pageIndex: pageIndex
			})
			if (res?.status === 200) {
				setStudents(res?.data?.data || [])
			}
			if (res?.status === 204) {
				setStudents([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
		setLoading(false)
	}

	const getTranscripts = async (classId) => {
		setLoading(true)
		try {
			const res = await transcriptApi.getTranscriptByClass(classId)
			if (res?.status === 200) {
				setTranscripts(res?.data?.data || [])
			}
			if (res?.status === 204) {
				setTranscripts([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
		setLoading(false)
	}
	const getColGradesTemplateById = async (classId) => {
		setLoading(true)
		try {
			const res = await scoreColumnApi.get({
				classId: classId || '',
				pageSize: 999
			})
			if (res?.status === 200) {
				setColTemplate(res?.data?.data || [])
			}
			if (res?.status === 204) {
				setColTemplate([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
		setLoading(false)
	}

	const submitGradesConcurrently = async (dataGrades) => {
		setLoading(true)
		const handleSubmitGrades = async (dataGrade) => {
			try {
				const res = await scoreApi.postInsertOrUpdate(dataGrade)
				return res?.data?.message
			} catch (error) {}
		}
		const sendUpdateRequests = []
		dataGrades.forEach((grades) => {
			sendUpdateRequests.push(handleSubmitGrades(grades))
		})

		try {
			const res = await Promise.all(sendUpdateRequests) // Wait for all requests to complete
			ShowNoti('success', res?.[0])
			setIsEditTable(false)
		} catch (error) {
			ShowNoti('error', error?.message)
		}
		setLoading(false)
		setGradeStudents(gradeStudentsChange.current)
	}

	useEffect(() => {
		getTranscripts(classId)
		getStudentByClassId(classId, pageIndex)
	}, [classId, pageIndex])

	useEffect(() => {
		getColGradesTemplateById(classId)
	}, [scoreBoardTemplateId])

	return (
		<div>
			<TransScriptFlexColumn
				colTemplate={colTemplate}
				setColTemplate={setColTemplate}
				getColGradesTemplateById={getColGradesTemplateById}
				setPageIndex={setPageIndex}
				students={students}
				dataTable={dataTable}
				loading={loading}
				setLoading={setLoading}
				columns={columns}
				getTranscripts={getTranscripts}
				classId={classId}
				setTranscriptId={setTranscriptId}
				getTranscriptPointByClassId={getTranscriptPointByClassId}
				transcriptId={transcriptId}
				transcripts={transcripts}
				isEditTable={isEditTable}
				setIsEditTable={setIsEditTable}
				setOpenFullScreen={setOpenFullScreen}
				openFullSCreen={openFullSCreen}
				submitGradesConcurrently={submitGradesConcurrently}
				gradeStudentsChange={gradeStudentsChange}
			/>
			<Modal
				open={openFullSCreen}
				onCancel={() => setOpenFullScreen(false)}
				centered
				closable={false}
				footer={null}
				title={null}
				width={'100%'}
			>
				<TransScriptFlexColumn
					colTemplate={colTemplate}
					setColTemplate={setColTemplate}
					getColGradesTemplateById={getColGradesTemplateById}
					setPageIndex={setPageIndex}
					students={students}
					dataTable={dataTable}
					loading={loading}
					setLoading={setLoading}
					columns={columns}
					getTranscripts={getTranscripts}
					classId={classId}
					setTranscriptId={setTranscriptId}
					getTranscriptPointByClassId={getTranscriptPointByClassId}
					transcriptId={transcriptId}
					transcripts={transcripts}
					isEditTable={isEditTable}
					setIsEditTable={setIsEditTable}
					setOpenFullScreen={setOpenFullScreen}
					openFullSCreen={openFullSCreen}
					submitGradesConcurrently={submitGradesConcurrently}
					gradeStudentsChange={gradeStudentsChange}
				/>
			</Modal>
		</div>
	)
}

export default TransScriptFlexColumnWrapper
