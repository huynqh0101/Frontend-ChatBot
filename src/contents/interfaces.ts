export interface IRegister {
  name: string
  email: string
  password: string
  passwordconf: string
  image?: string
}

export interface ILogin {
  email: string
  password: string
}
