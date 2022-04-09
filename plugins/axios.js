export default function ({ $axios, redirect }) {
  $axios.onError(error => {
    switch (parseInt(error.response && error.response.status)) {
      case 401:
        redirect('/login')
        break
      case 403:
        redirect('/forbidden')
        break
      case 404:
        redirect('/not-found')
        break
      default:
        redirect('/error')
     }
  })
}
