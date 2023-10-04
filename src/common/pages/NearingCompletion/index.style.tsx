import styled from 'styled-components'

export const ContainerInput = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

export const ContainerMinusIcon = styled.div`
	border: 1px solid #dfdfdf;
	border-bottom-left-radius: 5px;
	border-top-left-radius: 5px;
	height: 30px;
	padding: 0 4px;
	&:hover {
		border-color: #3498db;
	}
`
export const ContainerPlusIcon = styled.div`
	border: 1px solid #dfdfdf;
	border-bottom-right-radius: 5px;
	border-top-right-radius: 5px;
	height: 30px;
	padding: 0 4px;
	&:hover {
		border-color: #3498db;
	}
`
