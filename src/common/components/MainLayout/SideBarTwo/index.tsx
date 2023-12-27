import { MenuItems } from '~/common/libs/routers/type'
import MyLink from '../../MyLink'
import styles from './style.module.scss'

type NewType = {
	menus: MenuItems[]
	pathUrlKeys: string[]
	openMenuMobile: boolean
	closeMenuMobile: (e: any) => void
	isOpen: boolean
}

type TSideBarTwoProps = NewType

const SideBarTwo = (props: TSideBarTwoProps) => {
	const { menus, pathUrlKeys, openMenuMobile, closeMenuMobile, isOpen } = props
	const currentPathName = pathUrlKeys[pathUrlKeys.length - 1]
	return (
		<aside className={`${styles.root} menu-bar none-selection ${openMenuMobile ? 'mobile' : ''}`}>
			<div onClick={closeMenuMobile} className={`right-menu ${openMenuMobile ? 'right-menu-active' : ''}`} />

			<div className={`menu-child-bg `}></div>

			<div className={`menu-child  ${!isOpen && `close-app  `}`}>
				<div className="app-header-logo flex items-center justify-center">
					<a href="/">
						<img className={isOpen ? 'logo-img h-[40px]' : 'logo-img-none'} src="/images/logo-2.jpg" />
					</a>
				</div>

				<div className="mt-0 !overflow-scroll-y h-[100%] scrollable">
					<div className="h-[100%]">
						{menus.map((menu) => {
							const { label, key, children = [] } = menu
							return (
								<div key={key}>
									<p className="text-left mt-4 ml-[15px] text-[#8B8B8B] text-[14px]">{label}</p>
									<div className="width-[100%] h-[1px] bg-[#DFE5F1] my-2" />
									<div>
										{children.map((menuItem: MenuItems) => {
											const { label, key, icon } = menuItem
											const active = currentPathName === key
											return (
												<ul key={key}>
													<MyLink
														href={key as string}
														nextLinkRest={{ prefetch: false }}
														DisplayComponent={
															<li
																className={`
                                  flex hover:bg-[#F4F5F8] ${active ? styles.blueSvg : ''}  
                                  ${active ? 'border-l-[4px] bg-[#E9F3FD] border-[#0177FB] pl-[22px]' : ' pl-[26px]'} 
                                  gap-3 py-2 pb-2 my-1 items-center
                                `}
															>
																{icon}
																<p
																	className={`text-[16px]  ${
																		active ? '!text-[#0177FB]' : '!text-[#141736]'
																	}  font-[400] text-ellipsis line-clamp-1	`}
																>
																	{label}
																</p>
															</li>
														}
													/>
												</ul>
											)
										})}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</aside>
	)
}

export default SideBarTwo
