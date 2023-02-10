type IParentMenu = {
	tabname: string
	title: string
	icon: any
}

type IChildMenu = {
	menuname: string
	title: string
	menukey: string
	children?: Array<
		{
			TypeItem: string
			Key: string
			Route: string
			Icon: any
			Text: string
			ItemType?: string
			TitleSub?: string
		} & any
	>
} & any
