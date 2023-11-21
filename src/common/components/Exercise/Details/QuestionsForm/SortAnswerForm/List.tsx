import React from 'react'
import { Droppable, DragDropContext, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd'

type ListProps = {
	children?: React.ReactNode
	title: string
	onDragEnd: (data: any) => void
	name: string
}

const List = ({ children, title, onDragEnd, name }: ListProps) => {
	return (
		<div className="flex-shrink-0">
			<Droppable droppableId={name} direction="horizontal">
				{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
					<div ref={provided.innerRef} className="">
						<div className="p-[8px] min-h-[80px] bg-[#f0f0f0] border-[1px] border-dashed rounded-[8px] gap-[8px] flex flex-wrap flex-grow-0 flex-row">
							{children}
							{provided.placeholder}
						</div>
					</div>
				)}
			</Droppable>
		</div>
	)
}

export default List

// bg-[#f0f0f0]
