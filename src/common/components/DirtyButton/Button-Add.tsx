import React, { FC } from 'react'
import Loader from './Loader'
import styles from './styles.module.css'

const INLINE =
	'm256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm112 277.332031h-90.667969v90.667969c0 11.777344-9.554687 21.332031-21.332031 21.332031s-21.332031-9.554687-21.332031-21.332031v-90.667969h-90.667969c-11.777344 0-21.332031-9.554687-21.332031-21.332031s9.554687-21.332031 21.332031-21.332031h90.667969v-90.667969c0-11.777344 9.554687-21.332031 21.332031-21.332031s21.332031 9.554687 21.332031 21.332031v90.667969h90.667969c11.777344 0 21.332031 9.554687 21.332031 21.332031s-9.554687 21.332031-21.332031 21.332031zm0 0'

const OUTLINE =
	'M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659S472.341,136.705,472.341,256S375.295,472.341,256,472.341z M355.148,234.386H275.83v-79.318c0-10.946-8.864-19.83-19.83-19.83s-19.83,8.884-19.83,19.83v79.318h-79.318c-10.966,0-19.83,8.884-19.83,19.83s8.864,19.83,19.83,19.83h79.318v79.318c0,10.946,8.864,19.83,19.83,19.83s19.83-8.884,19.83-19.83v-79.318h79.318c10.966,0,19.83-8.884,19.83-19.83S366.114,234.386,355.148,234.386z'

const ButtonAdd: FC<TDirtyButton> = (props) => {
	const { children, className, background, shadow, color, onClick, iconSize, icon, loading, radius, disabled } = props

	const bg = background ? background : ''
	const thisStyle = { background: disabled || loading ? '#89b984' : bg, color: color ? color : '', borderRadius: radius || 6 }

	function onClickButton() {
		if (!!onClick && !disabled && !loading) onClick()
	}

	const DirtyIcon = () => {
		return (
			<>
				{!!icon && icon != 'none' && (
					<svg height={iconSize || 16} width={iconSize || 16} viewBox="0 0 512 512" fill={color ? color : '' || '#fff'}>
						{icon == 'inline' && <path d={INLINE} />}
						{icon == 'outline' && <path d={OUTLINE} />}
					</svg>
				)}
			</>
		)
	}

	if (!!children && shadow == 'sm') {
		return (
			<div onClick={onClickButton} className={styles.ButtonAdd + ' ' + styles.Shadow + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				<div className={styles.childText}>{children}</div>
			</div>
		)
	}

	if (!!children && shadow == 'md') {
		return (
			<div onClick={onClickButton} className={styles.ButtonAdd + ' ' + styles.ShadowMd + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				<div className={styles.childText}>{children}</div>
			</div>
		)
	}

	if (!!children) {
		return (
			<div onClick={onClickButton} className={styles.ButtonAdd + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				<div className={styles.childText}>{children}</div>
			</div>
		)
	}

	return (
		<div onClick={onClickButton} className={styles.ButtonAdd + ' ' + className} style={{ ...thisStyle, padding: 8 }}>
			{!loading && <DirtyIcon />}
			{!!loading && <Loader iconSize={iconSize} />}
		</div>
	)
}

export default ButtonAdd
