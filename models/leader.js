class Leader {
  constructor(leader_id, name, title, photo) {
    this.leader_id = leader_id;
    this.name = name;
    this.title = title;
    this.photo = photo;
  }

  toJson () {
    return {
      'leader_id': this.leader_id, 'name': this.name, 'title': this.title,
      'photo': this.photo
    };
  }
}

export default Leader;