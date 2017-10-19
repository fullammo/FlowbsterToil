import { Observable } from 'rxjs/Observable';
import { User } from 'app/core/user';

export abstract class UserApi {
  // signIn: (
  //   username: string,
  //   password: string,
  //   rememberMe: boolean
  // ) => Observable<any>;
  user: Observable<User>;
  signOut: () => void;
  // changePassword :
  googleLogin: () => Promise<void>;
}
