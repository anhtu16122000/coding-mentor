function path(root: string, sublink: string) {
	return `${root}${sublink}`
}

const ROOTS_FINANCE = '/finance'
export const ROOTS_VERIFY = '/verify'

export const PATH_FINANCE = {
	root: ROOTS_FINANCE,
	payment: path(ROOTS_FINANCE, '/payment')
}
