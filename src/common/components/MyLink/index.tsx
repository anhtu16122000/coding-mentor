import Link, { LinkProps } from 'next/link'

type TMyLinkProps = {
	href: string
	disable?: boolean
	DisplayComponent: React.ReactNode
	nextLinkRest?: Omit<LinkProps, 'href'>
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const MyLink: React.FC<TMyLinkProps> = (props) => {
	const { href, DisplayComponent, nextLinkRest = {}, disable = false, ...rest } = props

	if (disable) {
		return <>{DisplayComponent}</>
	}
	return (
		<Link href={href} {...nextLinkRest} passHref>
			<a {...rest}>{DisplayComponent}</a>
		</Link>
	)
}
export default MyLink
