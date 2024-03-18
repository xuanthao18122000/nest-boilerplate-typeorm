export interface IAzureExpressUser extends Express.User {
  preferred_username: string;
  oid: string;
}
