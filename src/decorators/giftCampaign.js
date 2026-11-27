const giftCampaign = {
  canEdit: function () {
    return this.actionable.includes("update");
  },
  canPublish: function () {
    return this.actionable.includes("publish");
  },
  canRevoke: function () {
    return this.actionable.includes("destroy");
  },
};

export default giftCampaign;
