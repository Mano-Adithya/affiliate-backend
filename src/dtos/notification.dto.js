export class NotifiactionDTO {
  constructor(notification) {
    this.id = notification?.id;
    this.content = notification?.content;
    this.type = notification?.type;
    this.user_type = notification?.user_type;
    this.read_at = notification?.read_at;
    this.created_at = notification?.created_at;
  }
}
