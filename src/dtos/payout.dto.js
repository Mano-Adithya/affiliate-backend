export class payourtDetailsDTO {
  constructor(payout) {
    this.id = payout?.id;
    this.userId = payout?.user_id;
    this.payoutId = payout?.payout_id;
    this.entity = payout?.entity;
    this.fund_account_id = payout?.fund_account_id;
    this.fund_account = JSON.parse(payout?.fund_account);
    this.amount = payout?.amount;
    this.currency = payout?.currency;
    this.fees = payout?.fees;
    this.tax = payout?.tax;
    this.status = payout?.status;
    this.purpose = payout?.purpose;
    this.mode = payout?.mode;
    this.narration = payout?.narration;
    this.merchant_id = payout?.merchant_id;
    this.created_at = payout?.created_at;
  }
}
