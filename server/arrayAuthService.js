const users = [
  {
    id: 1,
    name: 'hector',
    password: 'welcome1'
  }
];

module.exports = {
  findById: (jwtPayloadId) => users.find(user => user.id === jwtPayloadId),
  findByName: (name) => users.find(user => name === user.name)
}
