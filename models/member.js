class Member {

  constructor(member_id, name, party, constituency, region, photo, profile) {
    this.member_id = member_id;
    this.name = name;
    this.party = party;
    this.constituency = constituency;
    this.region = region;
    this.photo = photo;
    this.profile = profile;
  }

  toJson () {
    return {
      'member_id': this.member_id, 'name': this.name, 'party': this.party,
      'constituency': this.constituency, 'region': this.region,
      'photo': this.photo, 'profile': this.profile
    };
  }
}

export default Member;