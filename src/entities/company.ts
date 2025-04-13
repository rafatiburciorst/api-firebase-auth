import { randomUUID } from 'node:crypto'
import type { User } from './users.js'

interface CompanyProps {
  id?: string
  logo: string
  cpfCnpj: string
  razaoSocial: string
  nomeFanasia: string
  telefone: string
  horarioDeFuncionamento: string
  endereco: string
  localizacao: string
  taxaDeEntrega: string
  ativa?: boolean
  user: User
}

export class Company {
  public id?: string
  public logo: string
  public cpfCnpj: string
  public razaoSocial: string
  public nomeFanasia: string
  public telefone: string
  public horarioDeFuncionamento: string
  public endereco: string
  public localizacao: string
  public taxaDeEntrega: string
  public ativa?: boolean
  public user: User

  constructor(props: CompanyProps) {
    this.id = props.id
    this.logo = props.logo
    this.cpfCnpj = props.cpfCnpj
    this.razaoSocial = props.razaoSocial
    this.nomeFanasia = props.nomeFanasia
    this.telefone = props.telefone
    this.horarioDeFuncionamento = props.horarioDeFuncionamento
    this.endereco = props.endereco
    this.localizacao = props.localizacao
    this.taxaDeEntrega = props.taxaDeEntrega
    this.ativa = props.ativa ?? true
    this.user = props.user
  }

  static create(props: Omit<CompanyProps, 'id'>) {
    const company = new Company({
      id: randomUUID(),
      ...props,
    })

    return company
  }

  toJson() {
    return {
      logo: this.logo,
      cpfCnpj: this.cpfCnpj,
      razaoSocial: this.razaoSocial,
      nomeFanasia: this.nomeFanasia,
      telefone: this.telefone,
      horarioDeFuncionamento: this.horarioDeFuncionamento,
      endereco: this.endereco,
      localizacao: this.localizacao,
      taxaDeEntrega: this.taxaDeEntrega,
      ativa: this.ativa,
      user: this.user.toJson(),
    }
  }
}
