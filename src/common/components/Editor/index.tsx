import React, { FC, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import LoadingEditor from './loading'
import plugins from './plugins'
import toolbar from './toolbar'
import styles from './styles.module.scss'

const PrimaryEditor: FC<TPrimaryEditor> = (props) => {
	const { initialValue, height, id, inline, skin, menubar, apiKey } = props
	const { onInit, onChange, onBlur } = props

	const editorRef = useRef(null)

	const [loading, setLoading] = useState(true)

	function _init(evt, editor) {
		editorRef.current = editor
		setLoading(false)

		!!onInit && onInit(editor)
	}

	function _editorChange() {
		!!onChange && onChange(editorRef.current.getContent())
	}

	function _blur() {
		!!onBlur && onBlur()
	}

	return (
		<div className={styles.ccEditor}>
			<LoadingEditor hidden={!loading} />
			<Editor
				id={id || 'the-cc-editor'}
				apiKey={apiKey || 'lmr9ug3bh4iwjsrap9hgwgxqcngllssiraqluwto4slerrwg'}
				onInit={_init}
				initialValue={initialValue || ''}
				onEditorChange={_editorChange}
				onBlur={_blur}
				init={{
					skin: skin || 'oxide',
					content_css: 'writer',
					inline: inline || false, // true to remove iframe tag
					height: height || 500,
					menubar: menubar || false,
					plugins: plugins,
					toolbar: toolbar,
					quickBar: false,
					contextmenu: false,
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; max-width:100%; }'
				}}
			/>
		</div>
	)
}

export default PrimaryEditor
