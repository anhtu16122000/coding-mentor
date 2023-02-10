import React, { FC } from 'react'
import Loader from './Loader'
import styles from './styles.module.css'

const INLINE =
	'M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048 c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251 l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251 c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165 c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0 c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z'

const OUTLINE =
	'M437.126,74.939c-99.826-99.826-262.307-99.826-362.133,0C26.637,123.314,0,187.617,0,256.005s26.637,132.691,74.993,181.047c49.923,49.923,115.495,74.874,181.066,74.874s131.144-24.951,181.066-74.874C536.951,337.226,536.951,174.784,437.126,74.939z M409.08,409.006c-84.375,84.375-221.667,84.375-306.042,0c-40.858-40.858-63.37-95.204-63.37-153.001s22.512-112.143,63.37-153.021c84.375-84.375,221.667-84.355,306.042,0C493.435,187.359,493.435,324.651,409.08,409.006z M341.525,310.827l-56.151-56.071l56.151-56.071c7.735-7.735,7.735-20.29,0.02-28.046 c-7.755-7.775-20.31-7.755-28.065-0.02l-56.19,56.111l-56.19-56.111c-7.755-7.735-20.31-7.755-28.065,0.02 c-7.735,7.755-7.735,20.31,0.02,28.046l56.151,56.071l-56.151,56.071c-7.755,7.735-7.755,20.29-0.02,28.046 c3.868,3.887,8.965,5.811,14.043,5.811s10.155-1.944,14.023-5.792l56.19-56.111l56.19,56.111 c3.868,3.868,8.945,5.792,14.023,5.792c5.078,0,10.175-1.944,14.043-5.811C349.28,331.117,349.28,318.562,341.525,310.827z'

const ButtonCancel: FC<TDirtyButton> = (props) => {
	const { children, className, background, shadow, color, onClick, iconSize, icon, loading, radius, disabled } = props

	const bg = background ? background : ''
	const thisStyle = { background: disabled || loading ? '#b77477' : bg, color: color ? color : '', borderRadius: radius || 6 }

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
			<div onClick={onClickButton} className={styles.ButtonCancel + ' ' + styles.Shadow + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				{children}
			</div>
		)
	}

	if (!!children && shadow == 'md') {
		return (
			<div onClick={onClickButton} className={styles.ButtonCancel + ' ' + styles.ShadowMd + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				{children}
			</div>
		)
	}

	if (!!children) {
		return (
			<div onClick={onClickButton} className={styles.ButtonCancel + ' ' + className} style={thisStyle}>
				{!loading && <DirtyIcon />}
				{!!loading && <Loader iconSize={iconSize} />}
				{children}
			</div>
		)
	}

	return (
		<div onClick={onClickButton} className={styles.ButtonCancel + ' ' + className} style={{ ...thisStyle, padding: 8 }}>
			{!loading && <DirtyIcon />}
			{!!loading && <Loader iconSize={iconSize} />}
		</div>
	)
}

export default ButtonCancel
