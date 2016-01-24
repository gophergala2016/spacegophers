export class State extends Object{
  constructor() {
    super();
  }

  setUserId(userID) {
    this._userID = userID;
  }

  getUserId() {
    return this._userID;
  }

  setGophers(gophers) {
    this._gophers = gophers;
  }

  getGophers() {

  }
}