import ShowNoti from './ShowNoti'

class Notify {
	success = (message: string) => {
		ShowNoti('success', message)
	}
	error = (message: string) => {
		ShowNoti('error', message)
	}
	warning = (message: string) => {
		ShowNoti('warning', message)
	}
}

const ShowNostis = new Notify()
export default ShowNostis
