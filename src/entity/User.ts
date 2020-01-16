import * as bcrypt from 'bcryptjs';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TokenDto } from '../auth';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@ObjectType()
@Entity()
export class User {
  public constructor(user?: Partial<User>) {
    if (user) {
      Object.assign(this, user);
    }
  }

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field(() => String)
  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Field()
  @CreateDateColumn({ name: 'date_created' })
  createDate: Date;

  @Field()
  @UpdateDateColumn({ name: 'date_updated' })
  updateDate: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  /**
   * Returns user object fields relevant to our JWT
   */
  toTokenDto() {
    return {
      userId: this.id,
      role: this.role,
    } as TokenDto;
  }
}
