import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { useDispatch, useSelector } from 'react-redux'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import AudioRecord from '~/common/components/AudioRecord/AudioRecord'
import { RootState } from '~/store'

const SpeakingQuestion = (props) => {
	const { data, type, isFinal, dataSource, index, IndexInExam, disabled, onRefreshNav, setCurrentQuestion } = props

	const [loading, setLoading] = useState<boolean>(false)

	const [curLink, setCurLink] = useState('')

	const onChange = async (questId, link) => {
		console.time('--- Select Answer')
		setCurLink(link)

		let items = []

		if (!!data?.DoingTestDetails) {
			items.push({ ...data?.DoingTestDetails[0], Enable: false })
		}
		items.push({ Id: 0, IeltsAnswerId: 0, IeltsAnswerContent: link, Type: 0, Index: 0, Enable: true })

		if (!!Router?.query?.exam) {
			console.log('-------- PUT items: ', items)

			try {
				await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: data.Id,
					Items: [...items]
				})
			} catch (error) {
			} finally {
				onRefreshNav()
			}
		}

		console.timeEnd('--- Select Answer')
	}

	function getLinkRecorded() {
		if (!!curLink) {
			return curLink
		}

		if (!!data?.DoingTestDetails) {
			return data?.DoingTestDetails[0]?.IeltsAnswerContent || ''
		}

		return ''
	}

	return (
		<div
			onClick={() => setCurrentQuestion({ ...data, IeltsQuestionId: data?.Id })}
			key={'question-' + data.Id}
			id={'question-' + data.Id}
			className={`cc-choice-warpper border-[1px] border-[#e6e6e6]`}
		>
			<div className="exam-quest-wrapper none-selection">
				<div id={`cauhoi-${data.Id}`} className="cc-choice-number">
					Câu {IndexInExam}
				</div>
				{ReactHTMLParser(data?.Content)}
			</div>

			<div>
				<div className="font-[600] mb-2 mt-3">Câu trả lời</div>
				{!loading && (
					<>
						<AudioRecord
							disabled={Router.asPath.includes('take-an-exam') ? false : disabled}
							linkRecord={getLinkRecorded()}
							getLinkRecord={(linkRecord) => onChange(data.Id, linkRecord)}
							packageResult={[]}
							// dataQuestion={group}
							exerciseID={data.Id}
							getActiveID={() => {}}
						/>

						{/* <div className="mt-4" style={{ display: 'flex' }}>
							<UploadAudioField
								isHideControl
								getFile={(file: any) => onChange(exercise.ExerciseTopicId, file)}
								link={getLinkRecorded(exerIndex)}
							/>
							<div style={{ marginTop: 5, marginLeft: 9 }}>(Phương thức dự phòng)</div>
						</div> */}
					</>
				)}
			</div>
		</div>
	)
}

export default SpeakingQuestion
