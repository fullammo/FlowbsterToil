/**
 * Represent a User that has logged in to use the FlowbsterToil platform.
 */
export interface User {

  /**
   * The unique identifier of the User.
   */
  uid: string;

  /**
   * The user account's email address.
   */
  email: string;

  /**
   * The user account attached image URL.
   */
  photoURL?: string;

  /**
   * An optional display name if the User has chosen one.
   */
  displayName?: string;
}
