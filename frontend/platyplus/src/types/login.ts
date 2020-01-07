// TODO generate the types from the authentication service in the same way as for the metadata service
export interface LoginInputPayload {
  username: string
  password: string
}
export interface LoginPayload {
  id: string
  token: string
}
