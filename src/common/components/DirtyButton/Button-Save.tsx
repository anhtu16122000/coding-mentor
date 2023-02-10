import React, { FC } from 'react'
import Loader from './Loader'
import styles from './styles.module.css'

const INLINE =
	'm486.996094 64.382812-39.378906-39.378906c-16-16.023437-37.695313-25.003906-60.332032-25.003906h-328.617187c-32.40625 0-58.667969 26.261719-58.667969 58.667969v394.664062c0 32.40625 26.261719 58.667969 58.667969 58.667969h394.664062c32.40625 0 58.667969-26.261719 58.667969-58.667969v-328.617187c0-22.636719-8.980469-44.332032-25.003906-60.332032zm-401.664063 68.949219v-53.332031c0-8.832031 7.167969-16 16-16h224c8.832031 0 16 7.167969 16 16v53.332031c0 8.832031-7.167969 16-16 16h-224c-8.832031 0-16-7.167969-16-16zm170.667969 293.335938c-53.011719 0-96-42.988281-96-96 0-53.015625 42.988281-96 96-96s96 42.984375 96 96c0 53.011719-42.988281 96-96 96zm0 0'

const OUTLINE =
	'm420.284 0h-360.284c-33.084 0-60 26.916-60 60v392c0 33.084 26.916 60 60 60h392c33.084 0 60-26.916 60-60v-360.284zm-263.284 40h119v76h40v-76h40v96c0 11.028-8.972 20-20 20h-159c-11.028 0-20-8.972-20-20zm239 432h-279v-176c0-11.028 8.972-20 20-20h239c11.028 0 20 8.972 20 20zm76-20c0 11.028-8.972 20-20 20h-16v-176c0-33.084-26.916-60-60-60h-239c-33.084 0-60 26.916-60 60v176h-17c-11.028 0-20-8.972-20-20v-392c0-11.028 8.972-20 20-20h57v96c0 33.084 26.916 60 60 60h159c33.084 0 60-26.916 60-60v-96h7.716l68.284 68.284z'

const ButtonSave: FC<TDirtyButton> = (props) => {
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

export default ButtonSave
