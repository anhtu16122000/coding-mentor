import React, { FC, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import LoadingEditor from './loading'
import plugins from './plugins'
import toolbar from './toolbar'
import styles from './styles.module.scss'

let curQuestion = 1

const PrimaryEditor: FC<TPrimaryEditor> = (props) => {
	const { initialValue, height, id, inline, skin, menubar, apiKey, init, ref, noFullscreen } = props
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
					toolbar: `${!noFullscreen ? 'fullscreen' : 'customfullscreen |'} ${toolbar}`,
					quickBar: false,
					contextmenu: false,
					content_style:
						'input {border: 0px; background: #d3d3d3; max-width: 80px; width: auto; border-radius: 6px; font-size: 16px; padding: 2px 8px; outline: none !important; margin: 2px 4px !important;}',

					setup: function (editor) {
						editor.ui.registry.addButton('customInsertButton', {
							icon: 'comment-add',
							tooltip: 'Thêm câu hỏi',
							onAction: () => {
								console.log('--- editorRef: ', editorRef)

								const nowTimeStamp: number = getTimeStamp() // Timestamp
								const textSelected: string = editorRef.current.selection.getContent()

								console.log('--- textSelected: ', textSelected)

								const textInsert: string = ` <span style="color: #fff;margin-left: 4px;width: 20px;height: 20px; display: inline-flex; align-items: center; justify-content: center; background: #1890ff; border-radius: 999px;">${curQuestion}</span><input class="exam-blank-input" id="input-${nowTimeStamp}"></input>`

								editor.insertContent(textInsert) // Add textInsert to editor value

								const thisText = editorRef.current.getContent()

								console.log('--- thisText: ', thisText)

								const theBlanks = thisText

								// console.log('---- theBlanks: ', theBlanks)

								// if (theBlanks.length > 0) {
								// 	for (let i = 0; i < theBlanks.length; i++) {
								// 		const blank = theBlanks[i]

								// 		console.log('---- blank: ', blank)
								// 	}
								// }

								// _addHandle()
								// createNewComment({ ID: nowTimeStamp, Text: textSelected })
							}
						})

						editor.ui.registry.addButton('customfullscreen', {
							icon: 'fullscreen', // Sử dụng icon fullscreen có sẵn
							tooltip: 'Full Screen', // Chú thích khi di chuột qua nút
							onAction: function () {
								const theBabyForm = document.getElementById('the-baby-form')
								const thisEditor = document.getElementsByClassName('tox tox-tinymce')
								const thisEditorFullscreen = document.getElementsByClassName('tox-tbtn')
								if (theBabyForm.style.display == 'none') {
									theBabyForm.style.display = 'grid'
									if (thisEditor.length > 0) {
										thisEditor[0].setAttribute('style', 'height: 210px')
									}
									if (thisEditorFullscreen.length > 0) {
										thisEditorFullscreen[0].setAttribute('style', 'background: #fff')
									}
								} else {
									theBabyForm.style.display = 'none'
									if (thisEditor.length > 0) {
										thisEditor[0].setAttribute('style', 'height:' + (window.innerHeight - 250) + 'px')
									}
									if (thisEditorFullscreen.length > 0) {
										thisEditorFullscreen[0].setAttribute('style', 'background: #d7d7d7')
									}
								}
							}
						})
					}
				}}
			/>
		</div>
	)
}

export default PrimaryEditor
