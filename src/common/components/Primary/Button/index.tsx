import { Spin } from 'antd'
import { FC } from 'react'
import { PlusCircle } from 'react-feather'
import { AiFillPrinter, AiOutlineCheckCircle, AiOutlineEye, AiOutlineFileSearch } from 'react-icons/ai'
import { BiHide, BiReset, BiSearchAlt2 } from 'react-icons/bi'
import { FaSort } from 'react-icons/fa'
import { FiEdit, FiSave, FiSend, FiTrash2, FiXCircle } from 'react-icons/fi'
import { IoEnterOutline, IoPowerSharp } from 'react-icons/io5'
import { MdOutlinePayments, MdOutlineZoomInMap, MdOutlineZoomOutMap } from 'react-icons/md'
import { RiArrowDownSFill, RiArrowUpSFill, RiCalculatorLine, RiExchangeLine } from 'react-icons/ri'
import { RxInput } from 'react-icons/rx'
import { SiMicrosoftexcel } from 'react-icons/si'
import { TbDownload, TbShoppingCartPlus, TbUpload } from 'react-icons/tb'

const PrimaryButton: FC<IPrimaryButton> = (props) => {
	const { background, children, icon, type, onClick, className, disable, loading, iconClassName, mobileIconOnly } = props

	function getBG() {
		if (!!disable || !!loading) {
			return 'bg-[#cacaca] hover:bg-[#bababa] focus:bg-[#acacac] cursor-not-allowed'
		} else {
			if (background == 'green') {
				return 'bg-[#4CAF50] hover:bg-[#449a48] focus:bg-[#38853b]'
			}
			if (background == 'blue') {
				return 'bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf]'
			}
			if (background == 'red') {
				return '!bg-[#C94A4F] hover:!bg-[#b43f43] focus:!bg-[#9f3136]'
			}
			if (background == 'yellow') {
				return 'bg-[#FFBA0A] hover:bg-[#e7ab11] focus:bg-[#d19b10]'
			}
			if (background == 'black') {
				return 'bg-[#000] hover:bg-[#191919] focus:bg-[#313131]'
			}
			if (background == 'primary') {
				return 'bg-[#D21320] hover:bg-[#e51b29] focus:bg-[#D21320]'
			}
			if (background == 'purple') {
				return 'bg-[#8E24AA] hover:bg-[#7B1FA2] focus:bg-[#8E24AA]'
			}
			if (background == 'disabled') {
				return 'bg-[#cacaca] hover:bg-[#bababa] focus:bg-[#acacac] cursor-not-allowed'
			}
			if (background == 'orange') {
				return 'bg-[#FF9800] hover:bg-[#f49302] focus:bg-[#f49302] cursor-not-allowed'
			}
			if (background == 'transparent') {
				return 'bg-[] hover:bg-[] focus:bg-[]'
			}
		}
	}

	function getColor() {
		if (!!disable || !!loading) {
			return 'text-white'
		} else {
			if (background == 'green') {
				return 'text-white '
			}
			if (background == 'blue') {
				return 'text-white '
			}
			if (background == 'red') {
				return 'text-white '
			}
			if (background == 'yellow') {
				return 'text-black'
			}
			if (background == 'black') {
				return 'text-white'
			}
			if (background == 'primary') {
				return 'text-white'
			}
			if (background == 'purple') {
				return 'text-white'
			}
			if (background == 'disabled') {
				return 'text-white'
			}
		}
	}

	const iconClass = iconClassName || ''

	function getIcon() {
		if (icon == 'sort') {
			return <FaSort size={18} className={iconClass} />
		}
		if (icon == 'add') {
			return <PlusCircle size={18} className={iconClass} />
		}
		if (icon == 'cart') {
			return <TbShoppingCartPlus size={20} className={iconClass} />
		}
		if (icon == 'edit') {
			return <FiEdit size={18} className={iconClass} />
		}
		if (icon == 'cancel') {
			return <FiXCircle size={18} className={iconClass} />
		}
		if (icon == 'save') {
			return <FiSave size={18} className={iconClass} />
		}
		if (icon == 'remove') {
			return <FiTrash2 size={18} className={iconClass} />
		}
		if (icon == 'check') {
			return <AiOutlineCheckCircle size={18} className={iconClass} />
		}
		if (icon == 'exchange') {
			return <RiExchangeLine size={22} className={iconClass} />
		}
		if (icon == 'eye') {
			return <AiOutlineEye size={20} className={iconClass} />
		}
		if (icon == 'print') {
			return <AiFillPrinter size={20} className={iconClass} />
		}
		if (icon == 'hide') {
			return <BiHide size={18} className={iconClass} />
		}
		if (icon == 'file') {
			return <AiOutlineFileSearch size={18} className={iconClass} />
		}
		if (icon == 'download') {
			return <TbDownload size={22} className={iconClass} />
		}
		if (icon == 'upload') {
			return <TbUpload size={22} className={iconClass} />
		}
		if (icon == 'reset') {
			return <BiReset size={20} className={iconClass} />
		}
		if (icon == 'search') {
			return <BiSearchAlt2 size={20} className={iconClass} />
		}
		if (icon == 'excel') {
			return <SiMicrosoftexcel size={18} className={iconClass} />
		}
		if (icon == 'power') {
			return <IoPowerSharp size={20} className={iconClass} />
		}
		if (icon == 'enter') {
			return <IoEnterOutline size={20} className={iconClass} />
		}
		if (icon == 'send') {
			return <FiSend size={18} className={iconClass} />
		}
		if (icon == 'payment') {
			return <MdOutlinePayments size={18} className={iconClass} />
		}
		if (icon == 'arrow-up') {
			return <RiArrowUpSFill size={18} className={iconClass} />
		}
		if (icon == 'arrow-down') {
			return <RiArrowDownSFill size={18} className={iconClass} />
		}
		if (icon == 'calculate') {
			return <RiCalculatorLine size={18} className={iconClass} />
		}
		if (icon == 'full-screen') {
			return <MdOutlineZoomOutMap size={18} className={iconClass} />
		}
		if (icon == 'restore-screen') {
			return <MdOutlineZoomInMap size={18} className={iconClass} />
		}
		if (icon == 'input') {
			return <RxInput size={18} className={iconClass} />
		}
	}

	const _onClick = () => {
		if (type == 'button' && !disable && !!onClick) {
			onClick()
		}
	}
	return (
		<button
			disabled={!!disable || !!loading}
			type={type}
			onClick={(e) => {
				switch (icon) {
					case 'upload':
						break
					case 'excel':
						break
					default:
						e.stopPropagation()
						break
				}
				!disable && _onClick()
			}}
			className={`font-medium none-selection gap-[8px] rounded-lg h-[36px] px-[10px] inline-flex items-center justify-center !flex-shrink-0 ${getBG()} ${getColor()} ${className}`}
		>
			{!!loading && <Spin className="loading-base !ml-0 !mt-[1px]" />}
			{!!icon && !loading && getIcon()}
			{mobileIconOnly ? <div className="hidden w600:inline">{children}</div> : children}
		</button>
	)
}

export default PrimaryButton
