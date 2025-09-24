import {ref} from 'vue'
import type { Ref } from "vue"
type fil = {
    filterCategory : Ref<string>
}
const filterCategory  = ref<string>("")
const filter = () : fil => {
    return {filterCategory}
}

export default filter