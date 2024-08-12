export class ReferralCodeDto {
  constructor(user) {
    this.referral_code = user?.ReferralCode?.code;
    this.referral_data = user?.UserType?.ReferralPercents.map((portal) => ({
      portal: portal?.portal,
      percentage: portal?.percentage,
    }));
  }     
}
