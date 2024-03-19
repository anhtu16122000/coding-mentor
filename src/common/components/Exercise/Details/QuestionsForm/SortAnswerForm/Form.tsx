import { Form, Modal } from 'antd'
import { FC, useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { NumericFormat } from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryEditor from '~/common/components/Editor'
import PrimaryButton from '~/common/components/Primary/Button'
import { formRequired } from '~/common/libs/others/form'
import { RootState } from '~/store'
import { setCurrentExerciseForm } from '~/store/globalState'
import { removeChoiceAnswer } from '../utils'

// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// import { DragDropContainer, DropTarget } from 'react-drag-drop-container'

import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import List from './List'

// ----------------------------------------------------------------
const getItems = (count) =>
	Array.from({ length: count }, (v, k) => k).map((k) => ({
		id: `item-${k}`,
		content: `item ${k}`,
		timestamp: new Date().getTime()
	}))

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
	userSelect: 'none',
	padding: 8,
	borderRadius: 6,
	margin: `0 ${grid}px 0 0`,
	background: isDragging ? 'lightgreen' : '#fff',
	display: 'flex',
	alignItems: 'center',
	...draggableStyle
})

const getListStyle = (isDraggingOver, itemsLength) => ({
	background: isDraggingOver ? 'lightblue' : '#eaeaea',
	display: 'flex',
	padding: grid,
	width: '100%'
})
// ----------------------------------------------------------------

const SortAnswerForm: FC<IGroupForm> = (props) => {
	const { isEdit, defaultData, isChangeInfo, onOpen, section } = props

	const dispatch = useDispatch()

	const exercises = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [answers, setAnswers] = useState([])
	const [textError, setTextError] = useState('')

	useEffect(() => {
		if (!!visible && !!onOpen) {
			onOpen()
		}
	}, [visible])

	function onEnded() {
		setAnswers([])
		form.resetFields()
		setVisible(false)
		setLoading(false)
	}

	// Call api update new section data
	async function postEditQuestion(param) {
		let temp = []
		exercises.forEach((element) => {
			if (!!element.Id) {
				if (element.Id == param.Id) {
					temp.push(param)
				} else {
					temp.push(element)
				}
			} else {
				if (element?.timestamp == param?.timestamp) {
					temp.push(param)
				} else {
					temp.push(element)
				}
			}
		})
		dispatch(setCurrentExerciseForm(temp))
		onEnded()
	}

	// Call api update new section data
	async function postCreateQuestion(param) {
		console.log('DATA_SUBMIT: ', param)
		let temp = []
		let count = 1
		exercises.forEach((element) => {
			temp.push(element)
			if (element.Enable !== false) {
				count++
			}
		})
		temp.push({ ...param, Index: count })
		dispatch(setCurrentExerciseForm(temp))
		onEnded()
	}

	// Assign current data to this form
	async function openEdit() {
		form.setFieldsValue({ ...defaultData })
		setAnswers(defaultData?.IeltsAnswers)
		setVisible(true)
	}

	async function openCreate() {
		setVisible(true)
	}

	function onChangeAnswer(params, fIndex) {
		let temp = []
		answers.forEach((answer, index) => {
			if (fIndex == index) {
				temp.push({ ...answer, Content: params })
			} else {
				temp.push(answer)
			}
		})
		setAnswers(temp)
	}

	function onChangeAnswerCheck(params, fIndex) {
		let temp = []
		answers.forEach((answer, index) => {
			if (fIndex == index) {
				temp.push({ ...answer, Correct: params })
			} else {
				temp.push(answer)
			}
		})
		setAnswers(temp)
	}

	function _checkSubmit() {
		const contentChecker = form.getFieldValue('Content')
		if (!contentChecker) {
			return 'Vui lòng thêm nội dung câu hỏi'
		}
		if (answers.length == 0) {
			return 'Vui lòng thêm đáp án'
		}
		let flag = false
		answers.forEach((element) => {
			if (!!element.Correct && element.Enable !== false) {
				flag = true
			}
		})
		if (!flag) {
			return 'Vui lòng thêm ít nhất một đáp án đúng'
		}
		return ''
	}

	async function _submit(param) {
		setLoading(true)
		setTextError('')
		const checkSubmit = await _checkSubmit()
		if (!checkSubmit) {
			const DATA_SUBMIT = { ...param, IeltsAnswers: answers }
			if (!!defaultData) {
				postEditQuestion({ ...defaultData, ...DATA_SUBMIT, IeltsAnswers: answers })
			} else {
				postCreateQuestion({ ...DATA_SUBMIT, Id: 0, timestamp: new Date().getTime() })
			}
		} else {
			setTextError(checkSubmit)
		}
	}

	function _removeAnswer(ans) {
		removeChoiceAnswer(answers, ans, (event) => setAnswers(event))
	}

	function createAnswer() {
		setTextError('')
		const answerType = 1
		const mewAnswer = {
			Id: 0,
			Content: '',
			Correct: false,
			isAdd: true,
			Type: answerType,
			timestamp: new Date().getTime() + ''
		}
		answers.push(mewAnswer)

		let tamp = []

		answers.forEach((element, index) => {
			tamp.push({ ...element, index: index })
		})

		setAnswers([...tamp])
	}

	console.log('--- answers: ', answers)

	function submitQuestion() {
		if (!form.getFieldValue('Point')) {
			const nodes = document.getElementById('input-point')
			!!nodes && nodes.focus()
		}
		form.submit()
	}

	// ----------------------------------------------------------------
	// const [items, setItems] = useState([])

	// console.log('-- items: ', items)

	// useEffect(() => {
	// 	setItems(answers)
	// }, [answers])

	// const onDragEnd = (result) => {
	// 	if (!result.destination) {
	// 		return
	// 	}

	// 	const updatedItems = reorder(items, result.source.index, result.destination.index)

	// 	// @ts-ignore
	// 	setItems(updatedItems)
	// }

	// const onDragEnd = (result) => {
	// 	if (!result.destination) {
	// 		return
	// 	}

	// 	const updatedItems = reorder(answers, result.source.index, result.destination.index)

	// 	// @ts-ignore
	// 	setAnswers(updatedItems)
	// }

	const theFactProps = {
		dropData: ['whatever', 'you', 'put', 'DropTarget'],
		dropElem: [],
		containerElem: [],
		target: []
	}

	// const [items, setItems] = useState(['táo', 'nho', 'cam', 'chuối'])

	// const handleDrop = (e) => {
	// 	const droppedItem = e.dragData
	// 	setItems([...items, droppedItem])
	// }

	const itemsNormal = {
		available: [
			{
				id: 1,
				uuid: '52f9df20-9393-4c4d-b72c-7bfa4398a4477',
				title: 'What is Lorem Ipsum?',
				subtitle: 'Lorem Ipsum is simply dummy',
				updatedAt: '6 days ago'
			},
			{
				id: 2,
				uuid: '52f9df20-9393-4c4d-b72c-7bfa4398a448',
				title: 'Why do we use it?',
				subtitle: 'The point of using at its layout',
				updatedAt: '2 days ago'
			},
			{
				id: 3,
				uuid: '52f9df20-9393-4c4d-b72c-7bfa4398a449',
				title: 'Where does it come from?',
				subtitle: 'Contrary to popular belief, Lorem Ipsum is not simply',
				updatedAt: '3 days ago'
			}
		],

		assigned: [
			{
				id: 5,
				uuid: '52f9df20-9393-4c4d-b72c-7bfa4398a450',
				title: 'Where can I get some?',
				subtitle: 'There are many variations',
				updatedAt: '6 days ago'
			},
			{
				id: 6,
				uuid: '52f9df20-9393-4c4d-b72c-7bfa4398a451',
				title: 'Morbi sagittis tellus a efficitur',
				subtitle: 'Etiam mollis eros eget mi.',
				updatedAt: '2 days ago'
			}
		]
	}

	const [items, setItems] = useState(itemsNormal)

	const removeFromList = (list: any, index: any) => {
		const result = Array.from(list)
		const [removed] = result.splice(index, 1)
		return [removed, result]
	}

	const addToList = (list: any, index: any, element: any) => {
		const result = Array.from(list)
		result.splice(index, 0, element)
		return result
	}

	const onDragEnd = (result: any) => {
		if (!result.destination) {
			console.log(result)
			return
		}
		const listCopy: any = { ...items }
		const sourceList = listCopy[result.source.droppableId]
		const [removedElement, newSourceList] = removeFromList(sourceList, result.source.index)
		listCopy[result.source.droppableId] = newSourceList

		const destinationList = listCopy[result.destination.droppableId]
		listCopy[result.destination.droppableId] = addToList(destinationList, result.destination.index, removedElement)
		setItems(listCopy)
	}

	return (
		<>
			{!isEdit && !isChangeInfo && (
				<PrimaryButton onClick={openCreate} icon="add" background="green" type="button">
					Thêm câu hỏi
				</PrimaryButton>
			)}

			{!!isEdit && (
				<div onClick={openEdit} className="cc-update-group-button">
					<FiEdit size={18} className="mr-2 mt-[-2px]" />
					Cập nhật
				</div>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
				width={800}
				open={visible}
				onCancel={() => !loading && setVisible(false)}
				footer={
					<>
						<PrimaryButton disable={loading} onClick={() => setVisible(false)} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton loading={loading} onClick={submitQuestion} className="ml-2" background="blue" icon="save" type="button">
							Lưu
						</PrimaryButton>
					</>
				}
			>
				<div className="grid grid-cols-4 gap-x-4">
					<Form form={form} onFinish={_submit} layout="vertical" className="col-span-4 grid grid-cols-4 gap-x-4">
						<Form.Item label="Điểm" name="Point" className="col-span-4" required rules={formRequired}>
							<NumericFormat
								id="input-point"
								onChange={(event) => form.setFieldValue('Point', event.target.value)}
								className="primary-input px-2 w-full"
								thousandSeparator
							/>
						</Form.Item>

						<Form.Item className="col-span-4" name="Content" label="Nội dung câu hỏi" required rules={formRequired}>
							<PrimaryEditor
								id={`quest-content-${new Date().getTime()}`}
								height={210}
								initialValue={defaultData?.Content || ''}
								onChange={(event) => form.setFieldValue('Content', event)}
							/>
						</Form.Item>
					</Form>

					{!!textError && <div className="col-span-4 text-danger mb-[10px]">{textError}</div>}

					<div className="col-span-4">
						<>
							<DragDropContext onDragEnd={onDragEnd}>
								<div className="">
									<List title="" onDragEnd={onDragEnd} name="assigned">
										{items.assigned.map((item, index) => (
											<Draggable draggableId={item.uuid} index={index} key={item.id} direction="horizontal">
												{(provided, snapshot) => (
													<div className="" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
														<div className="flex w-full flex-shrink-0 cursor-move bg-[#D21320] px-[8px] py-[2px] rounded-[6px]">
															<div className="font-[600] text-[16px] text-[#fff]">{item.title}</div>
														</div>
													</div>
												)}
											</Draggable>
										))}
									</List>

									<div className="mt-[16px]">
										<List title="" onDragEnd={onDragEnd} name="available">
											{items.available.map((item, index) => (
												<Draggable key={item.id} draggableId={item.id + ''} index={index} direction="horizontal">
													{(provided: DraggableProvided | any, snapshot: DraggableStateSnapshot) => (
														<div
															className="flex-shrink-0"
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
														>
															{console.log('-- xxx provided: ', provided)}
															<div className="flex w-full cursor-move bg-[#D21320] px-[8px] py-[2px] rounded-[6px]">
																<div className="font-[600] text-[16px] text-[#fff]">{item.title}</div>
															</div>
														</div>
													)}
												</Draggable>
											))}
										</List>
									</div>
								</div>
							</DragDropContext>
						</>

						{/* <div>
							<div className="p-[16px] bg-[#e7e7e7] flex items-center gap-[8px] mb-[16px]">
								<DropTarget
									targetKey="fruit"
									onHit={handleDrop}
									targetStyle={{
										backgroundColor: 'lightgray',
										height: '100px',
										border: '2px dashed #aaa',
										borderRadius: '5px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '18px',
										fontWeight: 'bold',
										color: '#333'
									}}
								>
									Drop here
								</DropTarget>
							</div>

							<div className="p-[16px] bg-[#e7e7e7] flex items-center gap-[8px]">
								{items.map((item, index) => (
									<DragDropContainer key={index} draggableData={item}>
										<div className="bg-[green] p-[4px] rounded-sm">{item}</div>
									</DragDropContainer>
								))}
							</div>
						</div> */}

						{/* <DragDropContainer>
							<div>Look, I'm Draggable!</div>
						</DragDropContainer> */}

						{/* <DragDropContainer targetKey="foo" {...theFactProps}>
							<div>Drag Me!</div>
						</DragDropContainer>

						<DropTarget targetKey="foo">
							<p>I'm a valid drop target for the object above since we both have the same targetKey!</p>
						</DropTarget> */}

						{/* <DropTarget onHit={this.handleDrop} targetKey={this.props.targetKey} dropData={{ name: this.props.name }}>
							<DropTarget onHit={this.handleDrop} targetKey="boxItem" dropData={{ name: this.props.name }}>
								<div className="box">
									{this.state.items.map((item, index) => {
										return (
											<BoxItem key={item.uid} uid={item.uid} kill={this.kill} index={index} swap={this.swap}>
												{item.label}
											</BoxItem>
										)
									})}
								</div>
							</DropTarget>
						</DropTarget> */}

						{/* <div style={{ overflow: 'scroll', height: 200, background: 'red' }}>
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable droppableId="droppable" direction="horizontal">
									{(provided, snapshot) => (
										<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, answers.length)} {...provided.droppableProps}>
											{answers.map((item, index) => (
												<div>
													<Draggable key={item?.timestamp} draggableId={item?.timestamp} index={index}>
														{(provided, snapshot) => (
															<div style={getItemStyle(snapshot?.isDragging, provided.draggableProps.style)}>
																<div
																	className="pl-[4px] h-[30px] ml-[-8px] mr-[8px] all-center"
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<MdOutlineDragIndicator color="#000" size={18} />
																</div>
																<Input placeholder="Nhập đáp án" className="!w-fit !min-w-[50px]" value={item?.Content} />
															</div>
														)}
													</Draggable>
												</div>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						</div> */}
					</div>

					<div className="col-span-4 inline-flex mt-2">
						<PrimaryButton onClick={createAnswer} type="button" background="yellow" icon="add" className="!pr-2">
							Thêm đáp án
						</PrimaryButton>
					</div>

					<>xxx</>

					{/* {answers.map((answer, index) => (
						<>
							{answer?.Enable != false && (
								<div className="w800:col-span-2 col-span-4 mt-4 inline-flex items-center">
									<Checkbox
										defaultChecked={answer?.Correct}
										onChange={(event) => onChangeAnswerCheck(event.target.checked, index)}
										className="mr-3 h-[36px] custom-checkbox"
									/>

									<Input
										onChange={(event) => onChangeAnswer(event.target.value, index)}
										value={answer?.Content}
										disabled={loading}
										className="primary-input"
									/>

									<PrimaryButton
										onClick={() => _removeAnswer(answer)}
										className="!text-[red] hover:!text-[#d00d0d]"
										type="button"
										background="transparent"
									>
										<X />
									</PrimaryButton>
								</div>
							)}
						</>
					))} */}
				</div>
			</Modal>
		</>
	)
}

export default SortAnswerForm
