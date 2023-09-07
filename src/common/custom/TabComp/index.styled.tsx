import styled from 'styled-components'

export const StylePaymentStatusContainer = styled.div`
	display: flex;
	flex-direction: row;
`
export const StylePaymentStatusTotal = styled.span`
	font-size: 13px;
	font-weight: 400;
	margin-left: 5px;
`
export const StylePaymentStatusItem = styled.div<{ checked?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	height: 35px;
	background-color: ${(props) => (props.checked ? '#1B73E8' : '#dadada')};
	color: #fff;
	padding: 5px 10px;
	margin-right: 5px;
	cursor: pointer;
	user-select: none;
	transition: all 0.2s ease;
	&:hover {
		transform: translateY(-2);
		box-shadow: 0 3px 10px 0 #1b73e8;
		background-color: #1b73e8;
	}
`