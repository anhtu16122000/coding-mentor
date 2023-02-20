import { Popover } from 'antd'
import React, { useState } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { FiMoreVertical } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { getDate } from '~/common/utils/super-functions'
import { RootState } from '~/store'
import Avatar from '../../Avatar'
import Loading from '../../BaseLoading'
import PrimaryTooltip from '../../PrimaryTooltip'
import MenuContext from '../menu-context'
import { deleteComment, getTimeSince } from '../utils'
import { putComment } from './comment-utils'
import Reply from './reply'

function CommentItem({ item, onRefresh }) {
	const user = useSelector((state: RootState) => state.user.information)

	const [showMenu, setShowMenu] = useState(false)
	const [showEdit, setShowEdit] = useState(false)
	const [currentComment, setCurrentComment] = useState('')
	const [showReply, setShowReply] = useState(false)

	const { Id, Content, CreatedIdBy, CreatedBy, CreatedOn, CommentedAvatar } = item

	function deleteThisComment() {
		setShowMenu(false)
		deleteComment(Id, onRefresh)
		setShowReply(false)
	}

	const menuContent = (
		<MenuContext
			data={item}
			onDelete={deleteThisComment}
			onEdit={() => {
				setCurrentComment(Content)
				setShowMenu(false)
				setShowEdit(true)
			}}
		/>
	)

	return (
		<>
			{!showEdit && (
				<>
					<div className="cc-comment-item">
						<Avatar uri={CommentedAvatar} className="cc-news-avatar" />
						<div className="relative cc-comment-content">
							<div className="cc-comment-user-name mr-[20px]">{CreatedBy}</div>

							{user.UserInformationId == CreatedIdBy && (
								<Popover
									open={showMenu}
									onOpenChange={setShowMenu}
									placement="rightTop"
									content={menuContent}
									title={null}
									showArrow={false}
									trigger="click"
								>
									<div className="cc-comment-menu">
										<FiMoreVertical />
									</div>
								</Popover>
							)}
							<div className="cc-comment-text">{Content}</div>
						</div>
						<div className="cc-comment-menu" />
					</div>
					<div>
						<div className="news-cmt-info">
							<PrimaryTooltip id={`cmt-since-${Id}`} place="left" content={getDate(CreatedOn).full}>
								<div className="mr-2 hover:underline">{getTimeSince(CreatedOn)}</div>
							</PrimaryTooltip>
							•
							<div onClick={() => setShowReply((pre) => !pre)} className="news-cmt-info-text none-selection">
								Trả lời
							</div>
						</div>

						{showReply && <Reply comment={item} />}
					</div>
				</>
			)}
		</>
	)
}

function ListComment({ data, onShowAll, totalComment, onRefresh }) {
	const [showAll, setShowAll] = useState(false)

	function clickShowAll() {
		onShowAll(!showAll)
		setShowAll(!showAll)
	}

	return (
		<div className="cc-list-comment">
			{data.map((comment) => {
				return <CommentItem key={comment.Id} item={comment} onRefresh={onRefresh} />
			})}

			{totalComment > 1 && (
				<div onClick={clickShowAll} className="cc-comment-more">
					{!showAll ? 'Hiện tất cả' : 'Ẩn bớt'}
				</div>
			)}
		</div>
	)
}

export default ListComment
