import cx from 'classnames'
import DraggableList from 'react-draggable-list'
import GroupContainer from '../Group'
import React, { FC, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPackage } from '~/store/globalState'
import { RootState } from '~/store'
import SectionForm from './form-section'
import { examSectionsApi } from '~/api/exam/section'
import { ShowNoti } from '~/common/utils'
import DragMenu from '../DragMenu'

type IDragContainer = {
	data?: Array<IPackage>
	setData?: Function
	onRefresh?: Function
}

interface PlanetProps {
	item: IPackage
	itemSelected: number
	dragHandleProps: object
	commonProps?: any
}
interface PlanetState {
	value: number
}

class SectionItem extends React.Component<PlanetProps, PlanetState> {
	state = { value: 0, menuVisible: false }

	getDragHeight() {
		return 36
	}

	render() {
		const { item, itemSelected, dragHandleProps, commonProps } = this.props

		const scale = itemSelected * 0.01 + 1
		const shadow = itemSelected * 1 + 0
		const dragged = itemSelected !== 0

		return (
			<div className={cx('item ex-det-sec-item', { dragged })} style={{ transform: `scale(${scale})`, borderWidth: shadow }}>
				<div className="dragHandle mt-[8px] ml-2" {...dragHandleProps} />
				<div className="iflex-full">
					<div className="ex-det-sec-name">{item?.Name}</div>
					<div className="menu mr-3 mt-[1px]">
						<DragMenu item={item} onRefresh={commonProps.onRefresh} />
					</div>
				</div>
				<div className="ex-det-sec-content">{item?.Explanations}</div>
				<GroupContainer section={item} data={item.ExerciseGroups} onRefresh={commonProps.onRefresh} />
			</div>
		)
	}
}

const SectionContainer: FC<IDragContainer> = (props) => {
	const { onRefresh } = props

	let sectionRef = useRef()

	const dispatch = useDispatch()
	const sections = useSelector((state: RootState) => state.globalState.currentPackage)

	function _onChangeSectionPosition(newList) {
		// Change index field
		let newIndexList = []
		newList.forEach((item, index) => {
			newIndexList.push({ ...item, Index: index + 1 })
		})

		// Apply new array
		dispatch(setCurrentPackage(newIndexList))

		// Convert data into {Id: xxx, Index: xxx}
		const indexTem = []
		newIndexList.forEach((item, index) => {
			indexTem.push({ Id: item.Id, Index: index + 1 })
		})

		putNewList({ Items: indexTem })
	}

	async function putNewList(params) {
		try {
			const response = await examSectionsApi.changeIndex(params)
			if (response.status === 200 && !!onRefresh) {
				onRefresh()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	return (
		<div className="drag-list mt-3">
			<div className="drag-section">
				<div className="mx-4" ref={sectionRef}>
					<DraggableList
						itemKey="Id"
						template={SectionItem}
						list={sections}
						commonProps={{ onRefresh: onRefresh }}
						onMoveEnd={(newList: Array<IPackage>) => _onChangeSectionPosition(newList)}
						container={() => document.body}
					/>
				</div>
			</div>

			<div className="ex-det-cre-section">
				<SectionForm />
			</div>
		</div>
	)
}

export default SectionContainer
