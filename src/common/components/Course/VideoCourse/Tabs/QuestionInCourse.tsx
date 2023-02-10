import { List } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { QuestionInVideoCourseApi } from '~/api/course/video-course/question-in-video-course'
import PrimaryButton from '~/common/components/Primary/Button'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import QuestionInCourseItem from '../QuestionInCourseItem'

export interface IQuestionInCourseProps {
	videoCourseID: number
}

export default function QuestionInCourse(props: IQuestionInCourseProps) {
	const user = useSelector((state: RootState) => state.user.information.RoleId)
	const { videoCourseID } = props
	const [dataSource, setDataSource] = useState<IQuestionInVideoCourse[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState({ videoCourseId: videoCourseID, pageSize: PAGE_SIZE, pageIndex: 1 })
	const [contentQuestion, setContentQuestion] = useState('')

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await QuestionInVideoCourseApi.getAll(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
			if (res.status == 204) {
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		getDataSource()
	}, [todoApi])

	const handleAddQuestion = async () => {
		setIsLoading({ type: 'ADD_QUESTION', status: true })
		try {
			let res = await QuestionInVideoCourseApi.addQuestion({ VideoCourseId: videoCourseID, Content: contentQuestion })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				setTodoApi({ ...todoApi })
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'ADD_QUESTION', status: false })
		}
	}

	return (
		<div className="container">
			<div>
				{(user == '3' || user == '2') && (
					<div className={`flex flex-col gap-2`}>
						<TextArea
							rows={4}
							className="rounded-lg"
							onChange={(e) => {
								setContentQuestion(e.target.value)
							}}
							placeholder="Nhập câu hỏi của bạn"
						/>
						<PrimaryButton
							background="blue"
							disable={isLoading.type == 'ADD_ANSWER' && isLoading.status}
							loading={isLoading.type == 'ADD_ANSWER' && isLoading.status}
							type="button"
							children={<span>Lưu</span>}
							className="ml-auto"
							icon="save"
							onClick={() => {
								handleAddQuestion()
							}}
						/>
					</div>
				)}
			</div>

			<div>
				<List
					grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
					dataSource={dataSource}
					renderItem={(item) => (
						<>
							<QuestionInCourseItem
								Item={item}
								onFetchData={() => {
									setTodoApi({ ...todoApi })
								}}
							/>
						</>
					)}
				/>
			</div>
		</div>
	)
}
