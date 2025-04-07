import { randomUUID } from 'node:crypto'

export interface UserProps {
  id: string
  name: string
  email: string
  password?: string
}

export class User {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly password: string | undefined
  constructor({ id, name, email, password }: UserProps) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
  }

  static create({ name, email, password }: Omit<UserProps, 'id'>) {
    return new User({
      id: randomUUID(),
      name,
      email,
      password,
    })
  }
}
