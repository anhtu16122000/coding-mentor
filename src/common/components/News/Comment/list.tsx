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
	const [loadingComment, setLoadingComment] = useState(false)
	const [inputFocused, setInputFocused] = useState(false)

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
			showEdit={user.UserInformationId == CreatedIdBy}
		/>
	)

	function _comment() {
		putComment({
			apiParams: { Id: Id, Content: currentComment },
			setLoading: setLoadingComment,
			onSuccess: () => {
				{
					onRefresh()
					setCurrentComment('')
					setShowEdit(false)
					setShowReply(true)
				}
			}
		})
	}

	function onEditComment() {
		if (!!currentComment && !loadingComment && currentComment !== Content) _comment()
	}

	const [showReply, setShowReply] = useState(false)

	function inputKeyup(event) {
		if (event.keyCode == 13 && !!currentComment && !loadingComment) _comment()
		if (event.keyCode == 27) setShowEdit(false)
	}

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

			{!!showEdit && (
				<>
					<div className="cc-news-create-comment mt-[16px]">
						<Avatar uri={user.Avatar} className="cc-news-avatar" />
						<div onClick={() => {}} className="relative cc-comment-input">
							<input
								onKeyUp={inputKeyup}
								disabled={loadingComment}
								placeholder="Nhập nhận xét..."
								value={currentComment}
								onChange={(event) => setCurrentComment(event.target.value)}
								onFocus={() => setInputFocused(true)}
								onBlur={() => setInputFocused(false)}
							/>
							<div onClick={onEditComment} className="cc-comment-submit">
								{loadingComment ? (
									<Loading.Blue />
								) : (
									<FaTelegramPlane
										size={20}
										color={!currentComment || currentComment == Content ? '#0000003d' : '#1E88E5'}
										className="ml-[-2px]"
									/>
								)}
							</div>
						</div>
						<PrimaryTooltip id={`cmt-cancel-${Id}`} place="right" content="Huỷ">
							<div onClick={() => setShowEdit(false)} className="news-cancel-input">
								<IoMdClose size={22} color="#E53935" />
							</div>
						</PrimaryTooltip>
					</div>

					{inputFocused && (
						<div className="the-option text-[12px] text-[#E53935] mt-[8px] font-[500] ml-[56px]">
							Nhấn ESC để hủy
							{!!currentComment && currentComment !== item?.commentContent && (
								<>
									, <div className="text-[#1E88E5] inline-flex">Enter để lưu</div>
								</>
							)}
						</div>
					)}
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
