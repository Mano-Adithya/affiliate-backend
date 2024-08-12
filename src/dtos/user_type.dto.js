export class UserTypeDto {
  constructor(user) {
    this.id = user?.id;
    this.user_type = user?.user_type;
    this.status = user?.status;
    this.created_at = user?.created_at;
    this.portal = user?.ReferralPercents.map((portal) => ({
      id: portal?.id,
      portal: portal?.portal,
      percentage: portal?.percentage,
    }));
  }
}
