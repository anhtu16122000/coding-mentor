import React, { FC } from 'react'
import Loader from './Loader'
import styles from './styles.module.css'

const INLINE =
	'm511.673 237.706c-61.494-74.31-154.579-145.84-251.85-145.84-97.29 0-190.397 71.58-251.85 145.84-10.63 12.84-10.63 31.48 0 44.32 15.45 18.67 47.84 54.71 91.1 86.2 108.949 79.312 212.311 79.487 321.5 0 43.26-31.49 75.65-67.53 91.1-86.2 10.599-12.815 10.654-31.438 0-44.32zm-251.85-89.84c61.76 0 112 50.24 112 112s-50.24 112-112 112-112-50.24-112-112 50.24-112 112-112z'

const OUTLINE =
	'M508.745,246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818,239.784,3.249,246.035 c-4.332,5.936-4.332,13.987,0,19.923c4.569,6.257,113.557,153.206,252.748,153.206s248.174-146.95,252.748-153.201 C513.083,260.028,513.083,251.971,508.745,246.041z M255.997,385.406c-102.529,0-191.33-97.533-217.617-129.418 c26.253-31.913,114.868-129.395,217.617-129.395c102.524,0,191.319,97.516,217.617,129.418 C447.361,287.923,358.746,385.406,255.997,385.406z M255.997,154.725c-55.842,0-101.275,45.433-101.275,101.275s45.433,101.275,101.275,101.275 s101.275-45.433,101.275-101.275S311.839,154.725,255.997,154.725z M255.997,323.516c-37.23,0-67.516-30.287-67.516-67.516 s30.287-67.516,67.516-67.516s67.516,30.287,67.516,67.516S293.227,323.516,255.997,323.516z'

const ButtonEye: FC<TDirtyButton> = (props) => {
	const { children, className, background, shadow, color, loading, onClick, iconSize, icon, radius, disabled } = props

	const bg = background ? background : ''
	const thisStyle = { background: disabled || loading ? '#659ed2' : bg, color: color ? color : '', borderRadius: radius || 6 }

	function onClickButton() {
		if (!!onClick && !disabled && !loading) onClick()
	}

	const DirtyIcon = () => {
		return (
			<>
				{!!icon && icon != 'none' && (
					<svg
						height={iconSize || 16}
						width={iconSize || 16}
						viewBox="0 0 512 512"
						style={{ marginRight: 8 }}
						fill={color ? color : '' || '#fff'}
					>
						{icon == 'inline' && <path d={INLINE} />}
						{icon == 'outline' && <path d={OUTLINE} />}
					</svg>
				)}
			</>
		)
	}

	if (!!children && shadow == 'sm') {
		return (
			<div onClick={onClickButton} className={styles.ButtonSave + ' ' + styles.Shadow + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				{children}
			</div>
		)
	}

	if (!!children && shadow == 'md') {
		return (
			<div onClick={onClickButton} className={styles.ButtonSave + ' ' + styles.ShadowMd + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				{children}
			</div>
		)
	}

	if (!!children) {
		return (
			<div onClick={onClickButton} className={styles.ButtonSave + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				{children}
			</div>
		)
	}

	return (
		<div onClick={onClickButton} className={styles.ButtonSave + ' ' + className} style={{ ...thisStyle, padding: 8 }}>
			{!loading && <DirtyIcon />}
			{!!loading && <Loader iconSize={iconSize} />}
		</div>
	)
}

export default ButtonEye
