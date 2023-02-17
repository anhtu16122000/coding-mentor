import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { deleteReply, getTimeSince } from '../utils'
import { FiMoreVertical } from 'react-icons/fi'
import { Popover } from 'antd'
import { FaTelegramPlane } from 'react-icons/fa'
import Loading from '../../BaseLoading'
import { getCommentReply, putReply } from './comment-utils'
import { ShowNostis } from '~/common/utils'
import Avatar from '../../Avatar'
import MenuContext from '../menu-context'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'
import { getDate } from '~/common/utils/super-functions'
import RestApi from '~/api/RestApi'
import PrimaryTooltip from '../../PrimaryTooltip'

const ReplyItem = (props) => {
	const { indexRe, item, onRefresh } = props

	const user = useSelector((state: RootState) => state.user.information)

	const { Id, ReplyAvatar, Content, CreatedBy, CreatedIdBy, CreatedOn } = item

	const [showMenu, setShowMenu] = useState(false)
	const [currentReply, setCurrentReply] = useState('')
	const [showEdit, setShowEdit] = useState(false)
	const [loading, setLoading] = useState(false)
	const [inputFocused, setInputFocused] = useState(false)

	function deleteThisReply() {
		setShowMenu(false)
		deleteReply(Id, onRefresh)
	}

	function _comment() {
		putReply({
			apiParams: { Id: Id, Content: currentReply },
			setLoading: setLoading,
			onSuccess: () => {
				{
					onRefresh()
					setCurrentReply('')
					setShowEdit(false)
				}
			}
		})
	}

	function onEditComment() {
		if (!!currentReply && !loading && currentReply !== Content) _comment()
	}

	const menuContent = (
		<MenuContext
			data={item}
			onDelete={() => deleteThisReply()}
			onEdit={() => {
				setCurrentReply(Content)
				setShowMenu(false)
				setShowEdit(true)
			}}
			showEdit={user.UserInformationId == CreatedIdBy}
		/>
	)

	function inputKeyUp(event) {
		if (event.keyCode == 13 && !!currentReply && !loading) _comment()
		if (event.keyCode == 27) setShowEdit(false)
	}
	return (
		<>
			{!showEdit && (
				<>
					<div key={`rep-${indexRe}`} className="cc-comment-item">
						<Avatar className="cc-news-avatar" uri={ReplyAvatar} />
						<div className="relative cc-comment-content">
							<div className="cc-comment-user-name mr-[20px]">{CreatedBy}</div>
							{user.UserInformationId == CreatedIdBy && (
								<Popover
									open={showMenu}
									onOpenChange={(e) => setShowMenu(e)}
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
					<div className="w-full flex ali-center ml-[56px] mt-[4px] font-[500] text-[12px]">
						<PrimaryTooltip id={`cmt-since-${Id}`} place="top" content={getDate(CreatedOn).full}>
							<div className="mr-2 hover:underline">{getTimeSince(CreatedOn)}</div>
						</PrimaryTooltip>
					</div>
				</>
			)}

			{!!showEdit && (
				<>
					<div className="cc-news-create-comment mt-[16px]">
						<Avatar className="cc-news-avatar" uri={user.Avatar} />
						<div onClick={() => {}} className="relative cc-comment-input">
							<input
								onKeyUp={inputKeyUp}
								disabled={loading}
								placeholder="Nhập nhận xét..."
								value={currentReply}
								onChange={(event) => setCurrentReply(event.target.value)}
								onFocus={() => setInputFocused(true)}
								onBlur={() => setInputFocused(false)}
							/>
							<div onClick={onEditComment} className="cc-comment-submit">
								{loading ? (
									<Loading.Blue />
								) : (
									<FaTelegramPlane
										size={20}
										color={!currentReply || currentReply == Content ? '#0000003d' : '#1E88E5'}
										className="ml-[-2px]"
									/>
								)}
							</div>
						</div>
						<PrimaryTooltip id={`cmt-rep-cancel-${Id}`} place="right" content="Huỷ">
							<div onClick={() => setShowEdit(false)} className="cursor-pointer pl-[8px] pr-[2px] py-[8px]">
								<IoMdClose size={22} color="#E53935" />
							</div>
						</PrimaryTooltip>
					</div>
					{inputFocused && (
						<div className="the-option text-[12px] text-[#E53935] mt-[8px] font-[500] ml-[56px]">
							Nhấn ESC để hủy
							{!!currentReply && currentReply != Content && (
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

function Reply(props) {
	const { comment } = props

	const user = useSelector((state: RootState) => state.user.information)

	const { Id, Content } = comment

	const [replies, setReplies] = useState([])
	const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 2, newsFeedCommentId: Id })
	const [loading, setLoading] = useState(false)
	const [total, setTotal] = useState(0)
	const [showAll, setShowAll] = useState(false)
	const [currentReply, setCurrentReply] = useState('')

	useEffect(() => {
		getCommentReply({ apiParams: filter, setData: setReplies, setLoading: setLoading, setTotal: setTotal })
	}, [filter])

	function onReply() {
		if (!!currentReply && !loading && currentReply !== Content) postReply()
	}

	async function postReply() {
		setLoading(true)
		try {
			const response = await RestApi.post('NewsFeedReply', { NewsFeedCommentId: Id, Content: currentReply })
			if (response.status == 200) {
				getCommentReply({ apiParams: filter, setData: setReplies, setLoading: setLoading, setTotal: setTotal })
				setCurrentReply('')
			}
		} catch (error) {
			ShowNostis.error(error.message)
		} finally {
			setLoading(true)
		}
	}

	function _showAll() {
		if (!showAll) {
			setFilter({ ...filter, pageSize: 9999 })
		} else {
			setFilter({ ...filter, pageSize: 2 })
		}
		setShowAll(!showAll)
	}

	function inputKeyUp(event) {
		if (event.keyCode === 13 && !!currentReply && !loading) onReply()
	}

	return (
		<div className="ml-[56px]">
			<div className="cc-news-create-comment mt-[16px]">
				<Avatar className="cc-news-avatar" uri={user?.Avatar} />
				<div onClick={() => {}} className="relative cc-comment-input">
					<input
						onKeyUp={inputKeyUp}
						disabled={loading}
						placeholder="Nhập nhận xét..."
						value={currentReply}
						onChange={(event) => setCurrentReply(event.target.value)}
					/>
					<div onClick={onReply} className="cc-comment-submit">
						{loading ? (
							<Loading.Blue />
						) : (
							<FaTelegramPlane size={20} color={!currentReply ? '#0000003d' : '#1E88E5'} className="ml-[-2px]" />
						)}
					</div>
				</div>
			</div>
			<div className="cc-list-comment">
				{replies.map((replyItem, indexRe) => {
					return (
						<ReplyItem
							key={`xts-${indexRe}`}
							item={replyItem}
							indexRe={indexRe}
							onRefresh={() => getCommentReply({ apiParams: filter, setData: setReplies, setLoading: setLoading, setTotal: setTotal })}
						/>
					)
				})}
				{total > 2 && (
					<div onClick={_showAll} className="cc-comment-more">
						{!showAll ? 'Hiện tất cả' : 'Ẩn bớt'}
					</div>
				)}
			</div>
		</div>
	)
}

export default Reply
