
const isParticipantEmpty = (participant) => {

    return participant.email === null &&
        participant.lastname === null &&
        participant.firstname === null &&
        participant.dateOfBirth === null &&
        participant.gender === null 
        
}

const parseRegisterTeamRequest = (participants) => { // remove empty participants

    return participants.filter(participant => !isParticipantEmpty(participant));
}




export { isParticipantEmpty, parseRegisterTeamRequest }