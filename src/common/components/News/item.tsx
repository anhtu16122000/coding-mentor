import React, { FC, useEffect, useRef, useState } from 'react'
import { AiFillDelete, AiFillLike } from 'react-icons/ai'
import { BiLike } from 'react-icons/bi'
import { FaTelegramPlane } from 'react-icons/fa'
import { GoCommentDiscussion } from 'react-icons/go'
import { ShowNostis, log } from '~/common/utils'
import ListComment from './Comment/list'
import { deleteNews, getComments, getLiked, getNewsDetail, getTimeSince } from './utils'
import NewsFiles from './files'
import { FiMoreVertical } from 'react-icons/fi'
import { Popconfirm, Popover } from 'antd'
import Avatar from '../Avatar'
import Router from 'next/router'
import RestApi from '~/api/RestApi'
import BaseLoading from '../BaseLoading'
import { encode } from '~/common/utils/common'
import PrimaryTooltip from '../PrimaryTooltip'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import ShowMore from '../ShowMore'
import CreateNews from './Create'

const ButtonPost: FC<TNewType> = (props) => {
	const { onClick, title, icon, loading, activated } = props

	return (
		<div onClick={(e) => onClick(e)} className="cc-news-create-type">
			{loading ? (
				<div className="mr-[8px]">
					<BaseLoading.Blue />
				</div>
			) : (
				icon
			)}
			<span style={{ color: activated ? '#1E88E5' : '#000' }}>{title}</span>
		</div>
	)
}

const NewsItem: FC<{ item: TNews; index: number; onRefresh: Function }> = (props) => {
	const { item, index, onRefresh } = props
	const { Id, CreatedBy, GroupName, RoleName, CreatedOn, Content } = item

	const menuRef = useRef(null)

	const [loadingLike, setLoadingLike] = useState(false)
	const [loadingComment, setLoadingComment] = useState(false)
	const [showComment, setShowComment] = useState(false)
	const [comments, setComments] = useState<Array<TComment>>([])
	const [filterComments, setFilterComment] = useState({ pageIndex: 1, pageSize: 1, newsFeedId: item.Id || null })
	const [totalComment, setTotalComment] = useState(0)
	const [details, setDetails] = useState<any>({})
	const [isShowPopover, setIsShowPopover] = useState(false)

	const user = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		setDetails(item)
	}, [item])

	useEffect(() => {
		if (showComment) getComments(filterComments, setComments, setLoadingComment, setTotalComment)
	}, [filterComments])

	function _setDetail(params) {
		setDetails(params)
		setLoadingLike(false)
	}

	async function _like() {
		setLoadingLike(true)
		try {
			const response = await RestApi.post('NewsFeedLike', { newsFeedId: Id })
			if (response.status == 200) {
				getNewsDetail(Id, _setDetail)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoadingLike(false)
		}
	}

	const [currentComment, setCurrentComment] = useState('')

	async function _comment() {
		if (!!currentComment && !loadingComment) {
			setLoadingComment(true)
			try {
				const response = await RestApi.post('NewsFeedComment', { NewsFeedId: Id, Content: currentComment })
				if (response.status == 200) {
					getComments(filterComments, setComments, setLoadingComment, setTotalComment)
					setCurrentComment('')
					getNewsDetail(Id, setDetails)
				}
			} catch (error) {
				ShowNostis.error(error.message)
			}
			setLoadingComment(false)
		}
	}

	function deleteThisComment() {
		refreshComment()
		menuRef.current?.close()
		deleteNews(Id, onRefresh)
	}

	const menuContent = (
		<div className="cc-comment-menu-main w-[110px]">
			<Popconfirm
				showArrow={false}
				placement="right"
				onConfirm={() => deleteThisComment()}
				title="Xoá bài đăng này ?"
				cancelText="Hủy"
				okText="Xóa"
			>
				<div className="cc-comment-menu-item">
					<AiFillDelete className="text-[#E53935]" size={18} />
					<span>Xoá</span>
				</div>
			</Popconfirm>

			{user.UserInformationId == item?.CreatedIdBy && (
				<span onClick={() => setIsShowPopover(false)}>
					{/* {getNewsPer(permission, 'NewsFeed-DeleteItem') && <div className="cc-hr my-[4px] mx-[4px]" />} */}
					<CreateNews onRefresh={onRefresh} isEdit={true} defaultData={item} onOpen={() => menuRef.current?.close()} />
				</span>
			)}
		</div>
	)

	function _clickGroup() {
		Router.push({ pathname: '/news', query: { group: encode(item.NewsFeedGroupId) } })
	}

	function _clickComment() {
		if (!showComment) {
			setFilterComment({ pageIndex: 1, pageSize: 1, newsFeedId: item.Id || null })
		}
		setShowComment(!showComment)
	}

	function inpuKeyUp(event) {
		if (event.keyCode == 13 && !!currentComment && !loadingComment) _comment()
	}

	function showAllComment(event) {
		event ? setFilterComment({ ...filterComments, pageSize: 999 }) : setFilterComment({ ...filterComments, pageSize: 1 })
	}

	function refreshComment() {
		getNewsDetail(Id, setDetails)
		getComments(filterComments, setComments, setLoadingComment, setTotalComment)
	}

	return (
		<div className="cc-news-item" key={`li-`} id={`li-${index}-32`}>
			<div className="cc-news-item-header">
				<div className="cc-news-item-user py-[4px]">
					<div className="flex items-center">
						<Avatar uri={item?.Avatar} className="cc-news-avatar" />
						<div className="ml-[16px] mt-[-2px]">
							<div className="flex">
								<div className="cc-news-poster-name">{CreatedBy}</div>
								{!!GroupName && (
									<>
										<div className="mx-[8px] inline-block">➤</div>
										<PrimaryTooltip place="left" id={`group-${Id}`} content={GroupName}>
											<div onClick={_clickGroup} className="cc-news-poster-name cc-news-poster-group">
												{GroupName}
											</div>
										</PrimaryTooltip>
									</>
								)}
							</div>
							<div className="flex row-center">
								{!!RoleName && <div className={`cc-news-post-role ${RoleName == 'Admin' ? 'is-admin' : ''}`}>{RoleName}</div>}
								<PrimaryTooltip place="left" id={`since-${Id}`} content={CreatedOn}>
									<div className="cc-news-post-since hover:underline">{getTimeSince(CreatedOn)}</div>{' '}
								</PrimaryTooltip>
							</div>
						</div>
					</div>
					{item.BranchNameList && (
						<ul className="cc-center-branch-news">
							{item.BranchNameList &&
								item.BranchNameList.map((name, index) => {
									if (index > 2) return
									else
										return (
											<li className="cc_li" key={name + Math.random() * 1000}>
												{name}
											</li>
										)
								})}

							{item.BranchNameList.length > 3 && (
								<Popover
									content={item.BranchNameList.map(
										(name, index) =>
											index > 2 && (
												<li className="text-[12px] text-[#b1b1b1]" key={name + Math.random() * 1000}>
													{name}
												</li>
											)
									)}
									showArrow
									placement="rightTop"
								>
									<li className="cursor-pointer select-none cc_li">. . .</li>
								</Popover>
							)}
						</ul>
					)}
				</div>

				{user?.RoleId == 1 && (
					<Popover
						ref={menuRef}
						placement="rightTop"
						content={menuContent}
						title={null}
						onOpenChange={(newOpen: boolean) => setIsShowPopover(newOpen)}
						open={isShowPopover}
						showArrow={false}
						trigger="click"
					>
						<div className="cc-news-item-menu">
							<FiMoreVertical size={18} />
						</div>
					</Popover>
				)}
			</div>

			<div className="cc-news-item-body">
				<div className="cc-news-item-content">
					<ShowMore lines={3}>
						<span>{Content}</span>
					</ShowMore>
				</div>

				{!!details?.FileList && (
					<div className="cc-news-item-files">
						<NewsFiles files={details?.FileList} />
					</div>
				)}
			</div>

			<div className="cc-news-item-footer">
				<div className="cc-footer-top">
					<div className="cc-news-likes">
						{!!details?.TotalLike && (
							<>
								<AiFillLike size={20} className="mr-[8px] text-[#1E88E5]" />
								<div className="number-of-likes">{getLiked(details, user.UserInformationId).text}</div>
							</>
						)}
					</div>

					{!!details?.TotalComment && <div className="number-of-likes">{details?.TotalComment} nhận xét</div>}
				</div>

				<div className="cc-hr my-[8px] mx-[-6px]" />

				<div className="cc-footer-bottom">
					<ButtonPost
						onClick={_like}
						title="Thích"
						loading={loadingLike}
						activated={!!details?.IsLike}
						icon={
							!!details?.IsLike ? <AiFillLike size={18} className="mr-[8px] text-[#1E88E5]" /> : <BiLike size={18} className="mr-[8px]" />
						}
					/>

					<ButtonPost onClick={_clickComment} title="Nhận xét" icon={<GoCommentDiscussion size={18} className="mr-[8px] text-[#000]" />} />
				</div>
				{showComment && (
					<div className="cc-news-comment">
						<div className="cc-hr my-[8px] mt-[14px] mx-[-6px]" />
						<div className="cc-comments">
							<div className="cc-news-create-comment">
								<Avatar uri={user.Avatar} className="cc-news-avatar" />
								<div className="relative cc-comment-input">
									<input
										onKeyUp={inpuKeyUp}
										disabled={loadingComment}
										placeholder="Nhập nhận xét..."
										value={currentComment}
										onChange={(event) => setCurrentComment(event.target.value)}
									/>
									<div onClick={_comment} className="cc-comment-submit">
										{loadingComment ? (
											<BaseLoading.Blue />
										) : (
											<FaTelegramPlane size={20} color={!currentComment ? '#0000003d' : '#1E88E5'} className="ml-[-2px]" />
										)}
									</div>
								</div>
							</div>
							<ListComment data={comments} onShowAll={showAllComment} totalComment={totalComment} onRefresh={refreshComment} />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default NewsItem
