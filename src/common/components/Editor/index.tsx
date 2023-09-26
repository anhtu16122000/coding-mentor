import React, { FC, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import LoadingEditor from './loading'
import plugins from './plugins'
import toolbar from './toolbar'
import styles from './styles.module.scss'
import crypto from 'crypto'
import { useDispatch } from 'react-redux'
import { setQuestions } from '~/store/createQuestion'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const PrimaryEditor: FC<TPrimaryEditor> = (props) => {
	const { initialValue, height, id, inline, skin, menubar, apiKey, init, ref, noFullscreen } = props
	const { onInit, onChange, onBlur, isFillInBlank } = props

	let editorRef = useRef(null)

	function generateShortHash(input) {
		const hash = crypto.createHash('md5').update(input.toString()).digest('hex')
		return hash.substring(0, 6) // Lấy 6 ký tự đầu của giá trị hash
	}

	const [loading, setLoading] = useState(true)

	function _init(evt, editor) {
		editorRef.current = editor
		setLoading(false)

		!!onInit && onInit()
	}

	const quest = useSelector((state: RootState) => state.createQuestion.Questions)

	function _editorChange() {
		!!onChange && onChange(editorRef.current.getContent())

		const questionTags = editorRef.current?.dom.doc.getElementsByClassName('b-in')

		if (questionTags.length == quest.length) {
			return
		}

		if (questionTags && questionTags.length > 0) {
			for (let i = 0; i < questionTags.length; i++) {
				// @ts-ignore
				questionTags[i].placeholder = `(${i + 1})`
			}
		}

		const newQuestionTag: any = editorRef.current?.dom.doc.getElementsByClassName('b-in')
		dispatch(setQuestions([...newQuestionTag]))
	}

	function _blur() {
		!!onBlur && onBlur()
	}

	// GET NOW TIMESTAMP
	function getTimeStamp() {
		return new Date().getTime() // Example: 1653474514413
	}

	const customInputClass =
		'.b-in {border: 0px; text-align: center; background: #d3d3d3; max-width: 80px; width: auto; border-radius: 6px; font-size: 16px; padding: 2px 8px; outline: none !important; margin: 2px 4px !important;}'
	const indexBlockClass =
		'.idx-b {color: #fff; margin-left: 4px; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; background: #1890ff; border-radius: 999px;}'

	const dispatch = useDispatch()

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
					toolbar: `fullscreen ${toolbar}`,
					quickBar: false,
					contextmenu: false,
					content_style: `${customInputClass} ${indexBlockClass}`,

					setup: function (editor) {
						isFillInBlank &&
							editor.ui.registry.addButton('customInsertButton', {
								icon: 'comment-add',
								tooltip: 'Thêm câu hỏi',
								onAction: () => {
									const nowTimeStamp: number = getTimeStamp() // Timestamp
									const textInsert: string = ` <input class="b-in" disabled id="ip-${generateShortHash(nowTimeStamp)}"></input>`
									editor.insertContent(textInsert) // Add textInsert to editor value
								}
							})
					}
				}}
			/>
		</div>
	)
}

export default PrimaryEditor
