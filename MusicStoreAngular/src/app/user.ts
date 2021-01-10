/*
export class AuthUser {
  username: string;
  password: string;
}*/

export class User {
  username: string;
  password: string;
  date_joined: string;
  is_staff: boolean;

  constructor(username: string, password: string, date_joined: string, is_staff: boolean) {
    this.username = username;
    this.password = password;
    this.is_staff = is_staff;
    this.date_joined = date_joined;
  }

}
