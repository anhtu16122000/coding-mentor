import { useRouter } from 'next/router'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { MdArrowForwardIos } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { openSubmitModal } from '~/store'
import ButtonQuestion from '../ButtonQuestion'

const TAEFooter = ({ visible, onToggle, questions, curQuest, onClickQuest, testInfo }) => {
	const router = useRouter()
	const dispatch = useDispatch()

	return (
		<>
			{visible && (
				<div className="exam-23-footer">
					<div className="flex flex-col flex-1 items-start">
						<div onClick={onToggle} className="ex-23-f-button">
							<MdArrowForwardIos className="rotate-90 mr-[8px]" />
							<div className="font-[500]">Câu hỏi ({questions.length})</div>
						</div>

						<div className="flex flex-wrap gap-y-[8px] items-center no-select">
							{questions.map((item, index) => {
								const activated = curQuest?.IeltsQuestionId == item?.IeltsQuestionId
								const thisKey = `quest-num-${index}`

								return <ButtonQuestion key={thisKey} isActivated={activated} data={item} onClick={() => onClickQuest(item)} />
							})}

							{questions.length == 0 && <div className="text-[red]">Chưa có câu hỏi</div>}
						</div>
					</div>

					{/* {router?.asPath.includes('take-an-exam') && testInfo?.Type != 1 && ( */}
					<div
						onClick={() => dispatch(openSubmitModal())}
						className="h-[34px] cursor-pointer no-select px-[8px] rounded-[6px] all-center text-[#fff] bg-[#D21320] hover:bg-[#1867cf]"
					>
						<IoPaperPlaneOutline color="#fff" size={20} />
						<div className="ml-[4px]">Nộp bài</div>
					</div>
					{/* )} */}
				</div>
			)}
		</>
	)
}

export default TAEFooter
