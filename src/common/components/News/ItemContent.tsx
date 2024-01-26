import React, { FC, useEffect, useRef, useState } from 'react'
import { AiFillDelete, AiFillLike } from 'react-icons/ai'
import { BiLike } from 'react-icons/bi'
import { FaTelegramPlane } from 'react-icons/fa'
import { GoCommentDiscussion } from 'react-icons/go'
import ListComment from './Comment/list'
import { getLiked, getTimeSince } from './utils'
import NewsFiles from './files'
import { FiMoreVertical } from 'react-icons/fi'
import { Popconfirm, Popover } from 'antd'
import Avatar from '../Avatar'
import BaseLoading from '../BaseLoading'
import PrimaryTooltip from '../PrimaryTooltip'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import CreateNews from './Create'
import { encode } from '~/common/utils/common'
import Router from 'next/router'
import moment from 'moment'
import ShowMore from './components/ShowMore'

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

const ItemContent = (props) => {
	const {
		item,
		index,
		CreatedBy,
		_clickComment,
		_like,
		loadingLike,
		GroupName,
		details,
		RoleName,
		CreatedOn,
		Id,
		refreshComment,
		onRefresh,
		deleteNews,
		Content,
		showComment,
		loadingComment,
		_comment,
		comments,
		showAllComment,
		totalComment,
		visible,
		setVisible,
		currentComment,
		setCurrentComment,
		isModal
	} = props

	const menuRef = useRef(null)

	const user = useSelector((state: RootState) => state.user.information)

	const [showAll, setShowAll] = useState<boolean>(true)

	function deleteThisComment() {
		refreshComment()
		menuRef.current?.close()
		deleteNews(Id, onRefresh)
	}

	const [isShowPopover, setIsShowPopover] = useState(false)

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

	const [showButton, setShowButton] = useState<boolean>(false)

	useEffect(() => {
		const idContent = !visible ? 'news-item-content-' : 'news-item-content-x-'

		const thisElement = document.getElementById(idContent + item?.Id)
		const desiredLineCount = 2

		if (thisElement) {
			// Tính toán chiều cao mong muốn dựa trên số dòng
			const lineHeight = parseInt(window.getComputedStyle(thisElement).lineHeight)
			const maxHeight = lineHeight * desiredLineCount

			// Kiểm tra chiều cao thực tế
			if (thisElement.scrollHeight > maxHeight) {
				!showButton && setShowButton(true)
			} else {
				showButton && setShowButton(false)
			}
		}
	}, [item?.Id, visible])

	function inpuKeyUp(event) {
		if (event.keyCode == 13 && !!currentComment && !loadingComment) _comment()
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
										<div className="mx-[8px] mt-[2px] inline-block">➤</div>
										<PrimaryTooltip place="right" id={`group-${item?.Id}-${index}`} content={`Nhóm: ${GroupName}`}>
											<div onClick={_clickGroup} className="cc-news-poster-name cc-news-poster-group">
												{GroupName}
											</div>
										</PrimaryTooltip>
									</>
								)}

								{item?.BranchNameList && (
									<>
										{item.BranchNameList.map((name, index) => {
											if (index > 0) {
												return ''
											}

											return (
												<>
													<div className="mx-[8px] mt-[2px] inline-block">➤</div>
													<PrimaryTooltip place="right" id={`branch-${item?.Id}-${index}`} content={`Trung tâm: ${name}`}>
														<div className="cc-news-poster-name cc-news-poster-group">{name}</div>
													</PrimaryTooltip>
												</>
											)
										})}

										{item.BranchNameList.length > 1 && (
											<Popover
												title="Danh sách trung tâm"
												content={item.BranchNameList.map((name, index) => (
													<li className="text-[14px] text-[#000000] font-[600] mt-[4px]" key={name + Math.random() * 1000}>
														{name}
													</li>
												))}
												placement="rightTop"
												trigger="click"
												overlayClassName="show-arrow"
											>
												<div className="flex items-center">
													<div className="text-[16px] font-[600]">,</div>
													<div className="cc-news-poster-name cc-news-poster-group ml-[4px] !text-[#1E88E5] cursor-pointer">
														xem thêm...
													</div>
												</div>
											</Popover>
										)}
									</>
								)}
							</div>

							<div className="flex row-center">
								{!!RoleName && <div className={`cc-news-post-role ${RoleName == 'Admin' ? 'is-admin' : ''}`}>{RoleName}</div>}
								<PrimaryTooltip place="right" id={`since-${Id}`} content={moment(new Date(CreatedOn)).format('HH:mm DD/MM/YYYY')}>
									<div className="cc-news-post-since hover:underline">{getTimeSince(CreatedOn)}</div>{' '}
								</PrimaryTooltip>
							</div>
						</div>
					</div>
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
				<ShowMore
					Content={Content}
					isModal={isModal}
					item={item}
					setShowAll={setShowAll}
					setVisible={setVisible}
					showAll={showAll}
					showButton={showButton}
				/>

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
										style={{ outline: 'none' }}
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

export default ItemContent
