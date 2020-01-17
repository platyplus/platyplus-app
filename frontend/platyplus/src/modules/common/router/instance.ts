import VueRouter from 'vue-router'
let router: VueRouter
export const setRouter = (value: VueRouter) => (router = value)
export const getRouter = () => router
