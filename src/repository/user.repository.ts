import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public findOneByEmailOrUsername(emailOrUsername: string): Promise<User | undefined> {
    return (
      this.createQueryBuilder('user')
        // Ignore case when comparing
        .where('LOWER(user.username) = LOWER(:emailOrUsername)', {
          emailOrUsername,
        })
        .orWhere('LOWER(user.email) = LOWER(:emailOrUsername)', { emailOrUsername })
        .getOne()
    );
  }

  public findOneByEmailAndOrUsername(email: string, username: string) {
    return (
      this.createQueryBuilder('user')
        // Ignore case when comparing
        .where('LOWER(user.username) = LOWER(:username)', {
          username,
        })
        .orWhere('LOWER(user.email) = LOWER(:email)', { email })
        .getOne()
    );
  }

  public findOneByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  public findOneByUsername(username: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', { username })
      .getOne();
  }

  public async exists({ emailOrUsername, email, username }: ExistsQueryArgs): Promise<boolean> {
    if (emailOrUsername !== undefined) {
      return !!(await this.findOneByEmailOrUsername(emailOrUsername));
    }

    if (email && username) {
      return !!(await this.findOneByEmailAndOrUsername(email, username));
    }

    return Promise.resolve(false);
  }
}

interface ExistsQueryArgs {
  emailOrUsername?: string;
  email?: string;
  username?: string;
}
