class Leader {
  constructor (leaderId, name, title, photo) {
    this.leaderId = leaderId
    this.name = name
    this.title = title
    this.photo = photo
  }

  toJson () {
    return {
      leaderId: this.leaderId,
      name: this.name,
      title: this.title,
      photo: this.photo
    }
  }
}

export default Leader
