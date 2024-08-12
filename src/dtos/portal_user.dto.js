export class PortalUserDto {
  constructor(user) {
    this.id = user?.id;
    this.referral_code = user?.referral_code;
    this.name = user?.name;
    this.mobile_no = user?.mobile_no;
    this.email = user?.email;
    this.portal = user?.portal;
    this.plan_amount = user?.plan_amount;
    this.referral_amount = user?.referral_amount;
    this.referral_percent = user?.referral_percent;
    this.created_at = user?.created_at;
  }
}

export class PortalRegUserDto {
  constructor(user) {
    this.id = user?.id;
    this.user_id = user?.ReferralCode?.user_id;
    this.referral_code = user?.referral_code;
    this.name = user?.name;
    this.mobile_no = user?.mobile_no;
    this.email = user?.email;
    this.portal = user?.portal;
    this.created_at = user?.created_at;
  }
}
