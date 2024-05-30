// Utility function to convert price and add currency
const formatPrice = priceInCents => `${(priceInCents / 100).toFixed(2)} €`;

// Utility function to construct diet string
const constructDiet = participant => {
    let diet = [];
    if (participant.isVegan) diet.push('Végan');
    if (participant.hasAllergies) diet.push('Allergique');
    return diet.join(', ');
};

const parseTeam = (team) => {
    let parsedTeam = { ...team }

    parsedTeam.participants = parsedTeam.participants.map(participant => {


        return {
            ...participant,
            gender: participant.gender === 'preferNotToSay' ? 'NC' : participant.gender
        };
    }).sort((a, b) => a.id - b.id);

    return parsedTeam;
}


const parseTeamDashboard = team => team.map(({ participants, sport, status, amountToPayInCents, amountPaidInCents, ...rest }) => ({
    ...rest,
    sport: sport.sport,
    len: participants.length,
    amountPaidInCents: amountPaidInCents,
    amountToPayInCents: amountToPayInCents,
    productsData: participants.reduce((acc, { products }) => {
        products?.forEach(({ name }) => acc[name] = (acc[name] || 0) + 1);
        return acc;
    }, {}),
    status: ['Validated', 'PrincipalList'].includes(status) ? status : "Waiting",
    price: formatPrice(amountToPayInCents),
}));


export { parseTeam, parseTeamDashboard }
