class Member {
  constructor (memberId, name, party, constituency, region, photo, profile) {
    this.memberId = memberId
    this.name = name
    this.party = party
    this.constituency = constituency
    this.region = region
    this.photo = photo
    this.profile = profile
  }

  toJson () {
    return {
      memberId: this.memberId,
      name: this.name,
      party: this.party,
      constituency: this.constituency,
      region: this.region,
      photo: this.photo,
      profile: this.profile
    }
  }
}

export default Member
