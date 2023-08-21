import React, { FC, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import LoadingEditor from './loading'
import plugins from './plugins'
import toolbar from './toolbar'
import styles from './styles.module.scss'

const PrimaryEditor: FC<TPrimaryEditor> = (props) => {
	const { initialValue, height, id, inline, skin, menubar, apiKey, init, ref } = props
	const { onInit, onChange, onBlur } = props

	let editorRef = useRef(null)

	const [loading, setLoading] = useState(true)

	function _init(evt, editor) {
		editorRef.current = editor
		setLoading(false)
	}

	function _editorChange() {
		!!onChange && onChange(editorRef.current.getContent())
	}

	function _blur() {
		!!onBlur && onBlur()
	}

	// GET NOW TIMESTAMP
	function getTimeStamp() {
		return new Date().getTime() // Example: 1653474514413
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
					...init,
					skin: skin || 'oxide',
					content_css: 'writer cc-main-editor',
					inline: inline || false, // true to remove iframe tag
					height: height || 500,
					menubar: menubar || false,
					plugins: plugins,
					toolbar: `${!init ? 'fullscreen' : 'customfullscreen |'} ${toolbar}`,
					quickBar: false,
					contextmenu: false,
					content_style:
						'input {border: 0px; background: #d3d3d3; max-width: 80px; width: auto; border-radius: 6px; font-size: 16px; padding: 2px 8px; outline: none !important; margin: 0px 4px !important;}',

					// toolbar_sticky: true,
					toolbar_sticky_offset: 100,

					setup: function (editor) {
						editor.ui.registry.addButton('customInsertButton', {
							icon: 'comment-add',
							tooltip: 'Thêm nhận xét',
							onAction: () => {
								console.log('--- editorRef: ', editorRef)

								const nowTimeStamp: number = getTimeStamp() // Timestamp
								const textSelected: string = editorRef.current.selection.getContent()

								console.log('--- textSelected: ', textSelected)

								const textInsert: string = `<input class="exam-blank-input" id="input-${nowTimeStamp}"></input>`

								editor.insertContent(textInsert) // Add textInsert to editor value

								// _addHandle()
								// createNewComment({ ID: nowTimeStamp, Text: textSelected })
							}
						})
					},
					toolbar_sticky: true
				}}
			/>
		</div>
	)
}

export default PrimaryEditor
