export const getUpdatedTable = (matches, initialTable) => {
	let clonedTable = initialTable;
	for (let m in matches) {
		const match = matches[m];
		const team1 = match.t1;
		const team2 = match.t2;
		const winningTeam = match.win;
		const losingTeam = match.win === team1 ? team2 : team1;
		const winningTeamRow = clonedTable[winningTeam];
		const losingTeamRow = clonedTable[losingTeam];
		clonedTable = {
			...clonedTable,
			[winningTeam]: {
				...winningTeamRow,
				m: winningTeamRow.m + 1,
				w: winningTeamRow.w + 1,
				p: winningTeamRow.p + 2,
			},
			[losingTeam]: {
				...losingTeamRow,
				m: losingTeamRow.m + 1,
				l: losingTeamRow.l + 1,
			},
		};
	}
	return clonedTable;
};

// const makeScenario = (title, matches, required) => {
// 	const result = { title };
// 	const matchData = {};
// 	for (let key in matches) {
// 		if (key in required) {
// 			matchData[key] = {
// 				...matches[key],
// 				win: required[key],
// 			};
// 		} else {
// 			matchData[key] = {
// 				...matches[key],
// 				win: matches[key][`t${Math.floor(Math.random() * 2) + 1}`],
// 				note: "Doesn't matter",
// 			};
// 		}
// 	}
// 	result.matchData = matchData;
// 	return result;
// };

const getTop4 = (matchData, initialTable) => {
	const updatedTable = getUpdatedTable(matchData, initialTable);
	const sortedTable = Object.keys(updatedTable).sort((t1, t2) => {
		const a = updatedTable[t1];
		const b = updatedTable[t2];
		if (a.p === b.p) {
			return parseFloat(b.nrr) - parseFloat(a.nrr);
		}
		return b.p - a.p;
	});
	return sortedTable.slice(0, 4).join("-");
};

export const getScenarios = (matches, initialTable) => {
	// return [
	// 	makeScenario("RCB", matches, {
	// 		67: "rcb",
	// 		69: "mi",
	// 	}),
	// 	makeScenario("DC", matches, {
	// 		67: "rcb",
	// 		69: "dc",
	// 	}),
	// ];
	const scenarios = new Set();
	const possibleScenarios = [];

	if (
		matches &&
		initialTable &&
		Object.keys(matches).length > 0 &&
		Object.keys(initialTable).length > 0
	) {
		const matchKeys = Object.keys(matches);
		const remainingMatches = matchKeys.length;

		const getPossibleOutComes = (matchData, matchKeys, currentKey) => {
			if (currentKey === remainingMatches) {
				const top4 = getTop4(matchData, initialTable);
				const result = { title: top4, matchData };
				if (!scenarios.has(top4)) {
					possibleScenarios.push(result);
					scenarios.add(top4);
				}
			} else {
				const key = matchKeys[currentKey];
				const match = matches[key];
				if (match) {
					const matchDataWhent1Wins = {
						...matchData,
						[key]: { ...match, win: match.t1 },
					};
					getPossibleOutComes(matchDataWhent1Wins, matchKeys, currentKey + 1);

					const matchDataWhent2Wins = {
						...matchData,
						[key]: { ...match, win: match.t2 },
					};
					getPossibleOutComes(matchDataWhent2Wins, matchKeys, currentKey + 1);
				}
			}
		};
		getPossibleOutComes({}, matchKeys, 0);
		return possibleScenarios
			.map((value) => ({ value, sort: Math.random() }))
			.map(({ value }) => value);
	}

	//   return [];
};

export const filterPossibleOutcomes = (
	scenarios,
	selectedTeam,
	selectedPosition
) => {
	return scenarios.filter(
		(m) => m.title.split("-")[selectedPosition - 1] === selectedTeam
	);
};
