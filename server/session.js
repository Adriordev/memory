
const sessions = new Map()

const saveSession = (sessionID, dataSession) =>{
 sessions.set(sessionID, dataSession)
}
const loadSession = (sessionID) =>{
return sessions.get(sessionID)
}

module.exports = {saveSession, loadSession}