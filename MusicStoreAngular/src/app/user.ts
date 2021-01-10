/*
export class AuthUser {
  username: string;
  password: string;
}*/

export class User {
  username: string;
  password: string;
  date_joined: string;
  isStaff: boolean;

  constructor(username: string, password: string, date_joined: string, isStaff: boolean) {
    this.username = username;
    this.password = password;
    this.isStaff = isStaff;
    this.date_joined = dateJoined;
  }

}
