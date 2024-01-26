import React, { FC, useEffect, useState } from 'react'
import { ShowNostis } from '~/common/utils'
import { deleteNews, getComments, getNewsDetail } from './utils'
import { Modal } from 'antd'
import RestApi from '~/api/RestApi'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import ItemContent from './ItemContent'

const NewsItem: FC<{ item: TNews; index: number; onRefresh: Function }> = (props) => {
	const { item, index, onRefresh } = props
	const { Id, CreatedBy, GroupName, RoleName, CreatedOn, Content } = item

	const [loadingLike, setLoadingLike] = useState(false)
	const [loadingComment, setLoadingComment] = useState(false)
	const [showComment, setShowComment] = useState(false)
	const [comments, setComments] = useState<Array<TComment>>([])
	const [filterComments, setFilterComment] = useState({ pageIndex: 1, pageSize: 1, newsFeedId: item.Id || null })
	const [totalComment, setTotalComment] = useState(0)
	const [details, setDetails] = useState<any>({})

	const [currentComment, setCurrentComment] = useState('')

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

	function _clickComment() {
		if (!showComment) {
			setFilterComment({ pageIndex: 1, pageSize: 1, newsFeedId: item.Id || null })
		}
		setShowComment(!showComment)
	}

	function showAllComment(event) {
		event ? setFilterComment({ ...filterComments, pageSize: 999 }) : setFilterComment({ ...filterComments, pageSize: 1 })
	}

	function refreshComment() {
		getNewsDetail(Id, setDetails)
		getComments(filterComments, setComments, setLoadingComment, setTotalComment)
	}

	const [visible, setVisible] = useState<boolean>(false)

	// KHÚC NÀY CHẠY DEADLINE NÊN ĐỂ ĐỠ, MỐT LÀM GỌN SAU
	return (
		<>
			<ItemContent
				_like={_like}
				comments={comments}
				deleteNews={deleteNews}
				details={details}
				index={index}
				item={item}
				loadingComment={loadingComment}
				loadingLike={loadingLike}
				onRefresh={onRefresh}
				refreshComment={refreshComment}
				showAllComment={showAllComment}
				showComment={showComment}
				totalComment={totalComment}
				Id={Id}
				RoleName={RoleName}
				_clickComment={_clickComment}
				_comment={_comment}
				Content={Content}
				CreatedBy={CreatedBy}
				CreatedOn={CreatedOn}
				GroupName={GroupName}
				setVisible={setVisible}
				visible={visible}
				currentComment={currentComment}
				setCurrentComment={setCurrentComment}
			/>

			<Modal
				width={700}
				closable={false}
				className="cc-news news-item-modal"
				footer={null}
				open={visible}
				onCancel={() => setVisible(false)}
			>
				<ItemContent
					_like={_like}
					comments={comments}
					deleteNews={deleteNews}
					details={details}
					index={index}
					item={item}
					loadingComment={loadingComment}
					loadingLike={loadingLike}
					onRefresh={onRefresh}
					refreshComment={refreshComment}
					showAllComment={showAllComment}
					showComment={showComment}
					totalComment={totalComment}
					Id={Id}
					RoleName={RoleName}
					_clickComment={_clickComment}
					_comment={_comment}
					Content={Content}
					CreatedBy={CreatedBy}
					CreatedOn={CreatedOn}
					GroupName={GroupName}
					setVisible={setVisible}
					visible={visible}
					currentComment={currentComment}
					setCurrentComment={setCurrentComment}
					isModal
				/>
			</Modal>
		</>
	)
}

export default NewsItem
