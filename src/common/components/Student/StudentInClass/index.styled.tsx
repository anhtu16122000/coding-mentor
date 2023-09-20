import styled from 'styled-components'

export const StylePaymentMethods = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
`
export const StylePaymentMethodsItems = styled.div`
	display: flex;
	flex-direction: column;
	width: 100px;
`
export const StylePaymentMethodsAvatar = styled.img<{ isChecked: boolean }>`
	border: ${(props) => (props.isChecked ? '1px solid #1B73E8' : '')};
	border-radius: 10px;
	transition: all 0.2s ease;
	transform: ${(props) => (props.isChecked ? 'translateY(-2)' : 'scale(1)')};
	box-shadow: ${(props) => (props.isChecked ? '0 3px 10px 0 #1B73E8' : '')};
	cursor: pointer;
	height: 100px;
`
export const StylePaymentMethodsLable = styled.div<{ isColumn: boolean }>`
	display: flex;
	flex-direction: row;
	margin-top: 3px;
	alignitems: center;
	justify-content: center;
	font-size: ${(props) => (props.isColumn ? 12 : 14)}px;
`
export const StyleContainerDropdown = styled.div`
	display: flex;
	height: 36px;
	border: 1px solid #dfdfdf;
	cursor: pointer;
	alignitems: center;
	border-radius: 6px;
`
