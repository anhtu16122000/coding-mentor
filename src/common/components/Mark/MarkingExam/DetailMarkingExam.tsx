import { InfoCircleOutlined } from '@ant-design/icons'
import { Modal, Spin } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// import { doingTestApi } from '~/apiBase'
// import { useDoneTest } from '~/context/useDoneTest'
import ReactHtmlParser from 'react-html-parser'
// import ListQuestionNext from '~/components/DoingTest/ListQuestionNext'
// import { TEXT_NO_DATA } from '~/components/Exercise/Result'

const DetailMarkingExam = () => {
	// New
	const router = useRouter()
	// const { getDoneTestDataNext } = useDoneTest()
	const [historyDetails, setHistoryDetails] = useState<any>(null)
	const [currentSection, setCurrentSection] = useState(0)
	const [loadingAudio, setLoadingAudio] = useState(true)
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const { slug: slug } = router.query
	// ===== End
	// New

	const getHistoryDetails = async () => {
		// setLoading(true)
		// console.time('Res KẾt quả')
		// try {
		// 	let res = await doingTestApi.getHistoryDetails(parseInt(slug.toString()))
		// 	if (res.status === 200) {
		// 		setHistoryDetails(res.data.data)
		// 		getDoneTestDataNext(res.data.data)
		// 	}
		// } catch (error) {
		// 	console.log('error', error.message)
		// } finally {
		// 	setLoading(false)
		// 	console.timeEnd('Res KẾt quả')
		// }
	}

	useEffect(() => {
		if (!!slug) {
			getHistoryDetails()
		}
	}, [slug])

	useEffect(() => {
		setLoadingAudio(true)
		setTimeout(() => {
			setLoadingAudio(false)
		}, 0)
	}, [currentSection])

	const getSectionData = (params: any) => {
		let temp: any = {
			...params,
			Introduce: params.ExerciseGroupIntroduce,
			ExerciseGroupID: params.ExerciseGroupID,
			LinkAudio: params.ExerciseGroupLinkAudio,
			Paragraph: params.ExerciseGroupParagraph,
			ExerciseType: params.ExerciseGroupType,
			TypeName: params.ExerciseGroupTypeName,
			ExerciseTopic: params.Exercises,
			Content: params.ExerciseGroupContent
		}
		return temp
	}

	// ==== End
	return (
		<>
			<button className="btn btn-primary ml-2" onClick={() => setVisible(true)}>
				<span className="d-flex align-items-center">
					<InfoCircleOutlined className="mr-2" />
					Xem chi tiết
				</span>
			</button>
			<Modal
				open={visible}
				onCancel={() => setVisible(false)}
				closable={false}
				width="100%"
				centered
				className="result-next modal-review-result"
				footer={null}
			>
				<div>
					<div className="w-top-bottom">
						<img className="none-selection" src="/icons/bookmark.png" />
						Review & Explanations
					</div>
					<div className="w-bottom">
						<div className="bottom-inner row m-0 p-0">
							{!!loading ? (
								<div className="loading-result">
									<Spin />
									Đang tải dữ liệu
								</div>
							) : (
								<>
									<div className="col-md-6 col-12 oh-my-god ">
										<div className="scrollable custom-scrollbar-orange mt-1 mb-1" style={{ overflow: 'auto' }}>
											{!!historyDetails?.Audio && <div className="result-answer" style={{ marginTop: -20 }}></div>}
											{!loading && (
												<>
													{historyDetails?.ReviewAndExplanations.length > 0 && (
														<div>
															<div style={{ fontSize: 18, fontWeight: 600, color: '#90A08D' }}>
																{historyDetails?.ReviewAndExplanations[currentSection]?.ExamTopicSectionName}
															</div>

															{!!historyDetails?.ReviewAndExplanations[currentSection]?.ExamTopicSectionReadingPassage &&
																ReactHtmlParser(historyDetails?.ReviewAndExplanations[currentSection]?.ExamTopicSectionReadingPassage)}

															{!loadingAudio && !!historyDetails?.ReviewAndExplanations[currentSection]?.ExamTopicSectionAudio && (
																<>
																	<div>
																		<audio className="mt-3 custom-audio-recorder-netxt" controls>
																			<source
																				src={historyDetails?.ReviewAndExplanations[currentSection]?.ExamTopicSectionAudio}
																				type="audio/mpeg"
																			/>
																		</audio>
																	</div>
																</>
															)}

															{historyDetails?.ReviewAndExplanations[currentSection]?.ExerciseGroups.length > 0 &&
																historyDetails?.ReviewAndExplanations[currentSection]?.ExerciseGroups.map((item: any, index: number) => {
																	const key = item.ExerciseGroupID + '' + index

																	if (!!item?.ExerciseGroupID) {
																		return (
																			<div className="doingtest-group" key={key}>
																				<div className="col-lg-12 col-md-12 col-sm-12 col-12 pl-0 pl-0-mobile">
																					{/* <ListQuestionNext
																						dataQuestion={getSectionData(item)}
																						listQuestionID={historyDetails?.ListExerciseID}
																					/> */}
																				</div>
																			</div>
																		)
																	} else {
																		return (
																			<div className="doingtest-single" key={key}>
																				<div className="row">
																					<div className="col-12">
																						{/* <ListQuestionNext
																							dataQuestion={getSectionData(item)}
																							listQuestionID={historyDetails?.ListExerciseID}
																						/> */}
																					</div>
																				</div>
																			</div>
																		)
																	}
																})}
														</div>
													)}

													{historyDetails?.ReviewAndExplanations?.length == 0 && (
														<div className="w-100 text-center">{/* <p>{TEXT_NO_DATA}</p> */}</div>
													)}
												</>
											)}
										</div>
										<div className="section-control none-selection">
											<div className="section">
												{
													<div style={{ fontSize: 18, fontWeight: 600, color: '#90A08D' }}>
														{historyDetails?.ReviewAndExplanations[currentSection]?.ExamTopicSectionName}
													</div>
												}
											</div>

											{currentSection > 0 && (
												<div onClick={() => setCurrentSection(currentSection - 1)} className="change-section none-selection">
													<i className="fa fa-arrow-left mr-2" aria-hidden="true" style={{ color: '#fff', fontSize: 16 }} />
													<div>Quay lại</div>
												</div>
											)}
											{currentSection < historyDetails?.ReviewAndExplanations.length - 1 && (
												<div onClick={() => setCurrentSection(currentSection + 1)} className="change-section none-selection">
													<div>Tiếp theo</div>
													<i className="fa fa-arrow-right ml-2" aria-hidden="true" style={{ color: '#fff', fontSize: 16 }} />
												</div>
											)}
										</div>
									</div>

									<div className="col-md-6 col-12 oh-my-god">
										<div className="scrollable custom-scrollbar-orange mt-1 mb-1" style={{ overflow: 'auto' }}>
											{!loading && (
												<>
													{!!historyDetails?.ExamTopicAudio && (
														<div className="mb-3">
															<h6>Audio đề thi</h6>
															<audio className="custom-audio-recorder-netxt" controls>
																<source src={historyDetails?.ExamTopicAudio} type="audio/mpeg" />
															</audio>
														</div>
													)}
													{!!historyDetails?.ReviewAndExplanations[currentSection]?.ExamTopicSectionExplanations && (
														<>
															<h6>Giải thích</h6>
															{ReactHtmlParser(historyDetails?.ReviewAndExplanations[currentSection]?.ExamTopicSectionExplanations)}
														</>
													)}

													{historyDetails?.ReviewAndExplanations?.length == 0 && (
														<div className="w-100 text-center">{/* <p>{TEXT_NO_DATA}</p> */}</div>
													)}
												</>
											)}
										</div>
									</div>
								</>
							)}
						</div>
						<button onClick={() => setVisible(false)} className="btn btn-light btn-close-modal-review">
							Đóng
						</button>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default DetailMarkingExam
