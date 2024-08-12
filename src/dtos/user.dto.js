export class UserDto {
  constructor(user) {
    this.id = user?.id;
    this.first_name = user?.first_name;
    this.last_name = user?.last_name;
    this.email = user?.email;
    this.mobile_no = user?.mobile_no;
    this.profile_pic = user?.profile_pic;
    this.wallet = user?.wallet;
    this.user_type_id = user?.user_type_id;
    this.status = user?.status;
    this.user_type = user?.UserType?.user_type;
    this.referral_code = user?.ReferralCode?.code;
    this.created_at = user?.created_at;
    this.portal = user?.UserType?.ReferralPercents.map((portal) => ({
      id: portal?.id,
      portal: portal?.portal,
      percentage: portal?.percentage,
    }));
  }
}

export class BankDetailsDto {
  constructor(bank) {
    this.id = bank?.id;
    this.acc_name = bank?.acc_name;
    this.acc_no = bank?.acc_no;
    this.ifsc_code = bank?.ifsc_code;
    this.aadhar_no = bank?.aadhar_no;
  }
}
