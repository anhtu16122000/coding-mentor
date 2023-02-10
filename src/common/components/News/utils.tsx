import RestApi from '~/api/RestApi'
import { ShowNostis, ShowNoti, log } from '~/common/utils'

/**
 * Function get list of news
 * @param params {pageSize, PageIndex...}
 * @param setData Callback function
 * @param setTotalItem Callback function
 */
export async function getNews(params, setData, setTotalItem, preData) {
	console.time('- Get NewsFeed')
	try {
		const response = await RestApi.get<TListNews>('NewsFeed', params)
		if (response.status == 200) {
			if (params.pageIndex == 1) {
				setData(response.data.data)
				setTotalItem(response.data.totalRow)
			} else {
				setData([...preData, ...response.data.data])
			}
		} else {
			if (params.pageIndex == 1) {
				setData([])
				setTotalItem(0)
			} else {
				setData([...preData])
			}
		}
	} catch (error) {
		ShowNostis.error(error?.message)
	}
	console.timeEnd('- Get NewsFeed')
}

export async function getLikes(newsFeedId, setLikes, setLoadingLike) {
	try {
		const response = await RestApi.get<TListLiked>('NewsFeedLike', {
			pageIndex: 1,
			pageSize: 9999999,
			newsFeedId: newsFeedId
		})
		if (response.status == 200) {
			setLikes(response.data.data.items)
		}
	} catch (error) {
		ShowNostis.error(error.message)
	} finally {
		setLoadingLike(false)
	}
}

export function getTimeSince(date: string | number) {
	if (!!date) {
		const xxxx = new Date().getTime() - new Date(date).getTime()
		const paramFormated: any = new Date(new Date().getTime() - xxxx)

		const dateNow: any = new Date()

		var seconds = Math.floor((dateNow - paramFormated) / 1000)

		var interval = seconds / 31536000

		if (interval > 1) {
			return Math.floor(interval) + ' năm trước'
		}

		interval = seconds / 2592000
		if (interval > 1) {
			return Math.floor(interval) + ' tháng trước'
		}

		interval = seconds / 86400
		if (interval > 1 && interval < 2) {
			return 'Hôm qua'
		}
		if (interval > 1) {
			return Math.floor(interval) + ' ngày trước'
		}

		interval = seconds / 3600
		if (interval > 1) {
			return Math.floor(interval) + ' giờ trước'
		}

		interval = seconds / 60
		if (interval > 1) {
			return Math.floor(interval) + ' phút trước'
		}

		if (seconds < 30) {
			return 'Vừa xong'
		}

		return Math.floor(seconds) + ' giây trước'
	} else {
		return 'Không rõ'
	}
}

export function getLiked(details, userId) {
	let temp = ''

	if (details.TotalLike > 0) {
		if (details.TotalLike == 1 && !!details?.IsLike) {
			temp = 'Bạn đã thích'
		}

		if (details.TotalLike == 1 && !details?.IsLike) {
			temp = '1 người đã thích'
		}

		if (details.TotalLike > 1) {
			temp = details.TotalLike + ' người đã thích'
		}

		if (details.TotalLike > 1 && !!details?.IsLike) {
			temp = 'Bạn và ' + (details.TotalLike - 1) + ' người đã thích'
		}
	}

	return { text: temp }
}

export async function getComments(params, setComments, setLoadingComment, setTotalComment) {
	try {
		const response = await RestApi.get<TListLiked>('NewsFeedComment', params)
		if (response.status == 200) {
			setComments(response.data.data)
			setTotalComment(response.data.totalRow)
		} else {
			setComments([])
			setTotalComment(0)
		}
	} catch (error) {
		ShowNostis.error(error.message)
	} finally {
		setLoadingComment(false)
	}
}

export function getStrLiked(likes: Array<TLiked>, userId: string) {
	let temp = ''

	for (let i = 0; i < likes.length; i++) {
		const element = likes[i]

		if (!!element?.isLike && i < 31) {
			if (i == 0) {
				temp = temp + `${element.likedName}`
			} else {
				temp = temp + `<br />${element.likedName}`
			}
		}
	}

	if (likes.length > 30) {
		temp = temp + `và ${likes.length - 30} người khác`
	}

	return temp
}

export async function deleteNews(id, callback) {
	try {
		const response = await RestApi.delete('NewsFeed', id)
		if (response.status == 200) {
			callback()
		}
	} catch (error) {
		ShowNostis.error(error.message)
	}
}

export async function deleteComment(id, callback) {
	try {
		const response = await RestApi.delete('NewsFeedComment', id)
		if (response.status == 200) {
			callback()
		}
	} catch (error) {
		ShowNostis.error(error.message)
	}
}

export async function getNewsDetail(id, setDetail) {
	try {
		const response = await RestApi.getByID<TListLiked>('NewsFeed', id)
		if (response.status == 200) {
			setDetail(response.data.data)
		}
	} catch (error) {
		ShowNostis.error(error.message)
	}
}

export async function deleteReply(id, callback) {
	try {
		const response = await RestApi.delete('NewsFeedReply', id)
		if (response.status == 200) {
			callback()
		}
	} catch (error) {
		ShowNostis.error(error.message)
	}
}
