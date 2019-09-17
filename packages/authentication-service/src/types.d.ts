interface Role {
  name: string
}

interface RoleNode {
  role: Role
}

export interface User {
  id: string
  password: string
  roles: RoleNode[]
}

export interface LoginPayload {
  username: string
  password: string
}

export interface Token {
  userId: string
}
