type IBackgroundNewsFeed = IBaseApi<{
	ID: number
	FileName: string
}>

type INewsFeedComment = IBaseApi<{
	Avatar: string
	ID: number
	UserInformationID: number
	FullNameUnicode: string
	NewsFeedID: number
	CommentContent: string
	isReply: boolean
}>

type INewsFeedCommentReply = IBaseApi<{
	ID: number
	NewsFeedCommentID: number
	UserInformationID: number
	FullNameUnicode: string
	ReplyContent: string
	Avatar: string
}>

type INewsFeedLike = IBaseApi<{
	ID: number
	UserInformationID: number
	FullNameUnicode: string
	NewsFeedID: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}>

type IUserBranch = IBaseApi<{
	ID: number
	UserInfomationID: number
	FullNameUnicode: string
	BranchID: number
	BranchName: string
}>

type IUserGroupNewsFeed = IBaseApi<{
	ID: number
	GroupNewsFeedID: number
	GroupNewsFeedName: string
	UserInformationID: number
	FullNameUnicode: string
	RoleID: number
	RoleName: string
	Avatar: string
}>

type INewsFeed = IBaseApi<{
	ID: number
	UserInformationID: number
	FullNameUnicode: string
	Avatar: string
	RoleID: number
	RoleName: string
	GroupNewsFeedID: number
	GroupNewsFeedName: string
	Content: string
	TypeFile: number
	isComment: boolean
	CommentCount: number
	isLike: boolean
	LikeCount: number
	NewsFeedFile: {
		ID: number
		NameFile: string
		Type: number
		TypeName: string
		UID: string
		Thumnail: string
		//
		name?: string
		type?: string
		preview?: string
		uid?: string
		url?: string
		Enable?: boolean
	}[]
	NewsFeedBranch: {
		ID: number
		BranchID: number
		BranchName: string
	}[]
}>

type IGroupNewsFeed = IBaseApi<{
	ID: number
	Name: string
	BackGround: string
	Administrators: number
	FullNameUnicode: string
	CourseID: number
	CourseName: string
	BranchID: number
	BranchName: string
}>
