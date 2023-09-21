import Router from 'next/router'
import React, { useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { FaCheck } from 'react-icons/fa'
import { TbFileCertificate, TbLoader } from 'react-icons/tb'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import AudioRecord from '~/common/components/AudioRecord/AudioRecord'
import MarkingExam from '~/common/components/Mark/MarkingExam/MarkingExam'
import PrimaryTag from '~/common/components/Primary/Tag'

const SpeakingQuestion = (props) => {
	const { data, IndexInExam, disabled, onRefreshNav, setCurrentQuestion, isResult, curGroup, onRefresh } = props

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

		if (!!isResult && data?.IeltsAnswerResults.length > 0) {
			if (data?.IeltsAnswerResults[0]?.MyIeltsAnswerContent) {
				return data?.IeltsAnswerResults[0]?.MyIeltsAnswerContent || ''
			}
		}

		return ''
	}

	return (
		<div
			onClick={() =>
				!Router.asPath.includes('/questions') &&
				setCurrentQuestion({
					...data,
					IeltsQuestionId: data?.Id,
					IeltsQuestionResultId: data?.Id
				})
			}
			key={'question-' + data.Id}
			id={'question-' + data.Id}
			className={`cc-choice-warpper border-[1px] border-[#e6e6e6]`}
		>
			<div className="exam-quest-wrapper none-selection">
				{!Router.asPath.includes('questions') && (
					<div id={`cauhoi-${data.Id}`} className="cc-choice-number">
						Question {IndexInExam}
						<div className="cc-choice-point">
							<TbFileCertificate size={12} className="mr-1" />
							<div className="mt-[1px]">Point: {data?.Point || 0}</div>
						</div>
					</div>
				)}
				{ReactHTMLParser(data?.Content)}
			</div>

			<div>
				<div className="font-[600] mb-2 mt-3">Answer</div>

				<>
					{!isResult && (
						<AudioRecord
							disabled={Router.asPath.includes('take-an-exam') ? false : disabled}
							linkRecord={getLinkRecorded()}
							getLinkRecord={(linkRecord) => onChange(data.Id, linkRecord)}
							packageResult={[]}
							exerciseID={data.Id}
							getActiveID={() => {}}
						/>
					)}

					{!!isResult && getLinkRecorded() && (
						<audio controls>
							<source src={getLinkRecorded()} type="audio/mpeg" />
						</audio>
					)}

					{!!isResult && !getLinkRecorded() && <div className="text-[red]">Không trả lời</div>}

					{!!isResult && (
						<div className="flex flex-col items-start mt-[16px]">
							{!data?.Point && (
								<PrimaryTag color="yellow" className="!px-[8px]">
									<TbLoader size={18} className="mr-[4px] animate-spin custom-spin" /> Chưa chấm
								</PrimaryTag>
							)}

							{!!data?.Point && (
								<PrimaryTag color="green" className="!px-[8px]">
									<FaCheck size={14} className="mr-[4px]" /> Đã chấm
								</PrimaryTag>
							)}

							{!!data?.Point && (
								<div className="title-exercise-content" style={{ marginTop: 16, fontSize: 16, fontWeight: 600 }}>
									Điểm: {data?.Point}
								</div>
							)}

							<div className="mt-[16px]">
								<MarkingExam
									onRefresh={onRefresh}
									isSpeaking={true}
									onGetPoint={(point) => {}}
									dataRow={data}
									dataMarking={data}
									info={data}
									curGroup={curGroup}
								/>
							</div>
						</div>
					)}
				</>
			</div>
		</div>
	)
}

export default SpeakingQuestion
