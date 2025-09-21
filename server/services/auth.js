const sessionIdToUserMap = new Map();

function setUser(id, user) {
  return sessionIdToUserMap.set(id, user);
}

function getUser(id) {
  return sessionIdToUserMap.get(id);
}

function removeUser(id) {
  return sessionIdToUserMap.delete(id);
}

module.exports = {
  setUser,
  getUser,
  removeUser,
};
