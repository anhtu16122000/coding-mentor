import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { _format } from '~/common/utils'

type IForm = {
	data: any
	defaultValues: any
	printAreaRef: any
}

export const FormPrintImport: React.FC<IForm> = ({ defaultValues, data, printAreaRef }) => {
	useEffect(() => {}, [data])

	return (
		<div ref={printAreaRef} className="form-print-import px-tw-8 py-tw-4">
			<div className="content">{ReactHtmlParser(data)}</div>
		</div>
	)
}
