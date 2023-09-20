import { AxiosError } from 'axios'

const errorHandling = (error: AxiosError) => {
    console.log(error)

    if (error.response) {
        const data: any = error.response.data
        const res = error.response
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (res.status === 500) {
            return 'Server is broken'
        } else if (res.status === 404 || res.status === 400) {
            return data
        } else if (res.status === 401) {
        }
        console.log(res.data)
        console.log(res.status)
        console.log(res.headers)
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
    }
}

export default errorHandling
