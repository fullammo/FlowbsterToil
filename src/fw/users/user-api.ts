import { Observable } from 'rxjs/Observable';
import { User } from 'app/core/models/user';

/**
 * A signature class for providing a user authentication service interface.
 */
export abstract class UserApi {
  // signIn: (
  //   username: string,
  //   password: string,
  //   rememberMe: boolean
  // ) => Observable<any>;

  /**
   * The User provided as a subscribable data stream.
   */
  user: Observable<User>;

  /**
   * A signature method for signing out of the platform.
   */
  signOut: () => void;
  // changePassword :

  /**
   * The UserAPI must provide a Promise based method for google based authentication.
   */
  googleLogin: () => Promise<void>;

  /**
   * Signature method to navigate to the authenticated platform URL-s.
   */
  navigate: () => void;

}
