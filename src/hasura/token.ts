import { store } from 'src/store'
export const getEncodedToken = () => store.getters['user/encodedToken']
