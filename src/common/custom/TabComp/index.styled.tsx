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
	background-color: ${(props) => (props.checked ? '#D21320' : '#dadada')};
	color: ${(props) => (props.checked ? '#fff' : '#000')};
	padding: 5px 10px;
	margin-right: 5px;
	cursor: pointer;
	user-select: none;
	transition: all 0.2s ease;
	&:hover {
		transform: translateY(-2);
		box-shadow: 0 3px 10px 0 #d21320;
		background-color: #d21320;
	}
`
