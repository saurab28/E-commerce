import {ref} from 'vue'
const isModal = ref<boolean>(false)
const loginModal = () => {
  const toogleModal = () => {
    isModal.value = ! isModal.value
  }
  return {isModal,toogleModal}

}

export default loginModal
