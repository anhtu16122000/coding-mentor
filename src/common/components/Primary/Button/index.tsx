import { Spin, Tooltip } from 'antd'
import { FC } from 'react'
import { PlusCircle } from 'react-feather'
import { AiFillPrinter, AiOutlineCheckCircle, AiOutlineEye, AiOutlineFileSearch } from 'react-icons/ai'
import { BiHide, BiReset, BiSearchAlt2 } from 'react-icons/bi'
import { FiEdit, FiSave, FiSend, FiTrash2, FiXCircle } from 'react-icons/fi'
import { IoEnterOutline, IoPowerSharp } from 'react-icons/io5'
import { MdOutlinePayments } from 'react-icons/md'
import { RiArrowDownSFill, RiArrowUpSFill, RiExchangeLine } from 'react-icons/ri'
import { SiMicrosoftexcel } from 'react-icons/si'
import { TbDownload, TbShoppingCartPlus, TbUpload } from 'react-icons/tb'

const PrimaryButton: FC<IPrimaryButton> = (props) => {
	const { background, children, icon, type, onClick, className, disable, loading } = props

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
				return 'bg-[#1b73e8] hover:bg-[#1369da] focus:bg-[#1b73e8]'
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
			if (background == 'disabled') {
				return 'text-white'
			}
		}
	}

	function getIcon() {
		if (icon == 'add') {
			return <PlusCircle size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'cart') {
			return <TbShoppingCartPlus size={20} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'edit') {
			return <FiEdit size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'cancel') {
			return <FiXCircle size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'save') {
			return <FiSave size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'remove') {
			return <FiTrash2 size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'check') {
			return <AiOutlineCheckCircle size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'exchange') {
			return <RiExchangeLine size={22} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'eye') {
			return <AiOutlineEye size={20} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'print') {
			return <AiFillPrinter size={20} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'hide') {
			return <BiHide size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'file') {
			return <AiOutlineFileSearch size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'download') {
			return <TbDownload size={22} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'upload') {
			return <TbUpload size={22} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'reset') {
			return <BiReset size={20} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'search') {
			return <BiSearchAlt2 size={20} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'excel') {
			return <SiMicrosoftexcel size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'power') {
			return <IoPowerSharp size={20} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'enter') {
			return <IoEnterOutline size={20} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'send') {
			return <FiSend size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'payment') {
			return <MdOutlinePayments size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'arrow-up') {
			return <RiArrowUpSFill size={18} className={!!children ? 'mr-2' : ''} />
		}
		if (icon == 'arrow-down') {
			return <RiArrowDownSFill size={18} className={!!children ? 'mr-2' : ''} />
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
			className={`font-medium none-selection rounded-lg h-[36px] px-[10px] inline-flex items-center justify-center ${getBG()} ${getColor()} ${className}`}
		>
			{!!loading && <Spin className="loading-base mr-3" />}
			{!!icon && !loading && getIcon()}
			{children}
		</button>
	)
}

export default PrimaryButton
