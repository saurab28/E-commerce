import {ref} from 'vue'
import Cookies from "js-cookie"

const isLoggedIn = ref<boolean>(false)



const authorization = () => {
  const check_login = Cookies.get('token')
  if (check_login) {
    isLoggedIn.value = true
  }
  const checkAuthorization = () => {
    isLoggedIn.value = !isLoggedIn.value
  }
  return {isLoggedIn,checkAuthorization}

}

export default authorization
