import type { Knex } from 'knex'

type Table =
  | 'accounts'
  | 'cities'
  | 'phone_numbers'
  | 'inspectors'
  | 'companies'
  | 'company_contact_persons'
  | 'company_questionnaires'
  | 'company_objects'

interface Command<T> {
  create: (data: Partial<T>) => Promise<T>
  update: (id: number, data: Partial<T>) => Promise<T | undefined>
  delete: (id: number) => Promise<number>
}

type Fields<T> = Array<keyof T> | Partial<T>

interface Query<T> {
  find: (condition: Partial<T>, fields?: Fields<T>) => Promise<T[] | []>
  findOne: (identifierOrCondition: number | Partial<T>, fields?: Fields<T>) => Promise<T | undefined>
  exist: (identifierOrCondition: number | Partial<T>) => Promise<boolean>
}

type Repository<T> = Command<T> & Query<T>

export abstract class BaseRepository<T> implements Repository<T> {
  constructor (
    public readonly knex: Knex,
    public readonly table: Table
  ) {}

  public get qb (): Knex.QueryBuilder {
    return this.knex(this.table)
  }

  async create (data: Partial<T>): Promise<T> {
    const [output] = await this.qb
      .insert<T>(data)
      .returning('*')

    return output
  }

  async update (id: number, data: Partial<T>): Promise<T | undefined> {
    const [output] = await this.qb
      .where('id', id)
      .update(data)
      .returning('*')

    return output
  }

  async delete (id: number): Promise<number> {
    return await this.qb
      .where('id', id)
      .del()
  }

  async find (condition: Partial<T>, fields?: Fields<T>): Promise<T[] | []> {
    const query = this.qb.where(condition)

    if (fields == null) {
      void query.select('*')
    } else {
      void query.select(fields)
    }

    return await query
  }

  async findOne (identifierOrCondition: number | Partial<T>, fields?: Fields<T>): Promise<T | undefined> {
    let query = this.qb

    if (typeof identifierOrCondition === 'number') {
      query = this.qb.where('id', identifierOrCondition)
    } else {
      query = this.qb.where(identifierOrCondition)
    }

    if (fields == null) {
      void query.select('*')
    } else {
      void query.select(fields)
    }

    const result = await query.first()
    return result
  }

  async exist (identifierOrCondition: number | Partial<T>): Promise<boolean> {
    const query = this.qb.select(this.knex.raw('count(*) as count'))

    if (typeof identifierOrCondition === 'number') {
      void query.where('id', identifierOrCondition)
    } else {
      void query.where(identifierOrCondition)
    }

    const exist = await query.first()

    // eslint-disable-next-line eqeqeq
    return exist.count != 0
  }
}
