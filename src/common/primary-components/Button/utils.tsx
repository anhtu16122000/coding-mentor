import { FiPlusCircle } from 'react-icons/fi'
import styles from './styles.module.scss'
import { MdSave } from 'react-icons/md'
import { TbDatabaseImport } from 'react-icons/tb'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'

function getHoverClass(hover) {
	switch (hover) {
		case 'opacity':
			return styles['hover-opacity']

		case 'scale-out':
			return styles['hover-scale-out']

		case 'scale-in':
			return styles['hover-scale-in']

		default:
			return styles['hover-opacity']
	}
}

function getTypes(type) {
	switch (type) {
		case 'create':
			return {
				class: styles['btn-create'],
				icon: <FiPlusCircle size={16} />
			}

		case 'save':
			return {
				class: styles['btn-save'],
				icon: <MdSave size={18} />
			}

		case 'import':
			return {
				class: styles['btn-import'],
				icon: <TbDatabaseImport size={18} />
			}

		case 'export':
			return {
				class: styles['btn-export'],
				icon: <PiMicrosoftExcelLogoFill size={18} />
			}

		case 'edit':
			return {
				class: styles['btn-edit'],
				icon: <FaEdit size={18} />
			}

		case 'delete':
			return {
				class: styles['btn-delete'],
				icon: <FaRegTrashAlt size={15} />
			}

		default:
			return {
				class: '',
				icon: null
			}
	}
}

export { getHoverClass, getTypes }
