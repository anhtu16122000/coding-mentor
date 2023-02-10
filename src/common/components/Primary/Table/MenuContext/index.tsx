import React, { useMemo } from 'react'
import { Edit, Trash } from 'react-feather'

const Popup = ({ record, visible, x, y, menuContext }) => {
	const initMenuContext = useMemo(() => {
		return menuContext.map((menu) => {
			console.log('menu: ', menu)
			const ComponentItem = menu.components
			return (
				<>
					<ComponentItem />
					{menu.text}
				</>
			)
			// switch (menu) {
			// 	case 'edit':
			// 		return (
			// 			<>
			// 				<Edit size={20} />
			// 				<span>Cập nhật</span>
			// 			</>
			// 		)
			// 	case 'remove':
			// 		return (
			// 			<>
			// 				<Trash size={20} />
			// 				<span>Xóa</span>
			// 			</>
			// 		)
			// }
		})
	}, [menuContext])
	return (
		visible && (
			<ul className="context-menu-table" style={{ left: `${x}px`, top: `${y}px` }}>
				{initMenuContext.map((menu) => (
					<li className="menu-context-item">{menu}</li>
				))}
			</ul>
		)
	)
}

export default Popup
