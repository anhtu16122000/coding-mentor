import { DependencyList, useCallback, useEffect, useRef } from 'react'

const debounceImpl = (cb, delay: number) => {
	let isDebounced = null
	return (...args) => {
		clearTimeout(isDebounced)
		isDebounced = setTimeout(() => cb(...args), delay)
	}
}

export function debounce(func, delay) {
	let timeout
	return function () {
		if (timeout) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(() => {
			func()
		}, delay)
	}
}

export const useDebounce = (cb, delay: number, deps?: DependencyList) => {
	const cbRef = useRef(cb)

	useEffect(() => {
		cbRef.current = cb
	})

	return useCallback(
		debounceImpl((...args) => cbRef.current(...args), delay),
		deps
	)
}
