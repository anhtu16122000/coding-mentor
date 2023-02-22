import React, { FC } from 'react'
import PrimaryButton from '../../Primary/Button'

type TFooterFilters = {
	onSubmit?: Function
	onReset?: Function
}

const FooterFilters: FC<TFooterFilters> = (props) => {
	const { onSubmit, onReset } = props

	function _onSubmit() {
		if (!!onSubmit) onSubmit()
	}

	function _onReset() {
		if (!!onReset) onReset()
	}

	return (
		<div className="w-full flex items-center">
			<PrimaryButton onClick={_onReset} background="red" type="button" icon="reset" className="flex-1">
				Khôi phục
			</PrimaryButton>
			<PrimaryButton onClick={_onSubmit} background="blue" type="button" icon="search" className="flex-1 ml-[16px]">
				Áp dụng
			</PrimaryButton>
		</div>
	)
}

export default FooterFilters
