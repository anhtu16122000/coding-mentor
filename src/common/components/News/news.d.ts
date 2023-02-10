type TListNews = TApiPani & {
	items: Array<TNews>
}

type TNews = {
	Avatar: string
	BackGroundUrl: string
	BranchIdList: [2]
	BranchNameList: ['Trung tâm Hà Nội']
	Color: any
	Content: string
	CreatedBy: string
	CreatedIdBy: number
	CreatedOn: string
	Enable: boolean
	FileList: any
	GroupName: string
	Id: number
	IsBackGround: boolean
	IsLike: number
	ModifiedBy: string
	ModifiedOn: string
	NewsFeedGroupId: any
	RoleName: string
	TotalComment: number
	TotalFile: any
	TotalLike: number
	TypeNameGroup: any
}

type TListLiked = TApiPani & {
	items: Array<TLiked>
}

type TLiked = {
	active: boolean
	code: string
	created: number
	createdBy: string
	deleted: boolean
	describe: string
	id: string
	name: string
	updated: number
	updatedBy: string

	isLike: boolean
	likedBy: string
	likedName: string
	likedThumbnail: string
	newsFeedId: string
}

type TComments = TApiPani & {
	items: Array<TComment>
}

type TComment = {
	active: boolean
	code: string
	created: number
	createdBy: string
	deleted: boolean
	describe: string
	id: string
	name: string
	updated: number
	updatedBy: string

	isLike: boolean
	likedBy: string
	likedName: string
	likedThumbnail: string
	newsFeedId: string
}
