import React, { FC } from 'react'
import PrimaryButton from '../Primary/Button'

const ModalFooter: FC<IModalFooter> = (props) => {
	const { hideCancel, hideOK, cancelText, buttonFull, okText, children, layout, position, onCancel, onOK, loading } = props

	function getLayout() {
		return layout == 'vertical' ? 'flex flex-col' : layout == 'horizontal' ? 'flex flex-column' : 'inline-flex'
	}

	function getPosition() {
		return position == 'end' ? 'justify-end' : position == 'left' ? 'justify-start' : 'justify-center'
	}

	return (
		<div className={`${getLayout()} ${getPosition()} w-full ${buttonFull ? 'flex' : ''}`}>
			{!hideCancel && (
				<PrimaryButton
					className={`${buttonFull ? 'flex-1' : ''}`}
					onClick={() => !!onCancel && onCancel()}
					background="red"
					icon="cancel"
					type="button"
				>
					{cancelText || 'Hủy'}
				</PrimaryButton>
			)}

			{!hideCancel && !hideOK && <div className="ml-3 mt-2" />}

			{!hideOK && (
				<PrimaryButton
					className={`${buttonFull ? 'flex-1' : ''}`}
					loading={loading}
					disable={loading}
					onClick={() => !!onOK && onOK()}
					type="button"
					icon="save"
					background="blue"
				>
					{okText || 'Lưu'}
				</PrimaryButton>
			)}
			{children}
		</div>
	)
}

export default ModalFooter
