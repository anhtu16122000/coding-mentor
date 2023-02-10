import React, { FC } from 'react'
import styles from './styles.module.css'

const Loader = ({ iconSize }) => {
	return <div className={styles.DirtyLoader} style={{ width: 18, height: 18, borderWidth: 18 / 6 }} />
}

export default Loader
