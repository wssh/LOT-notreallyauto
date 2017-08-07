module.exports = function crTest(dispatch) {
	
	let CID = null;
	let boss = undefined;
	let teleLocation = null;
	
	const coordinateMap = [[70993.828125, 155509.953125, 3478.227783203125], [72248.4375,159849.765625,2854], [72463.6328125,162240.1875,2853.322021484375], [73104.3046875,155589.765625,2234.411865234375], [73209.65625,158450.921875,2229.521484375], [71611.5703125,157522.3125,2228.7236328125], [70465.3046875,155429.328125,2231.2939453125], [68307.8359375,156852.265625,2229.168701171875], [74461.1484375,159158.453125,1605.59216308593375], [71429.46875,160388.078125,1605.34521484375]]
	const TRIGGER_ITEM = 6560;
	const bossId = [476,4000];
	
	var counter = 1;
	var bossDead = false;
	var lotbool = false;
	
	dispatch.hook('S_LOGIN', 1, event => {
		CID = event.cid;
	})
	
	dispatch.hook('C_USE_ITEM', 1, event => {
		if (event.item === TRIGGER_ITEM && lotbool == true) {
			bossTele(coordinateMap[++counter]);
			return false;
		}
	});
	
	dispatch.hook('cChat', 1 , (event) => {
		if(event.message.includes('!lot')){
			dispatch.hookOnce('S_SPAWN_ME', 1, event => {
				if(coordinateMap[0][0] == event.x && coordinateMap[0][1] == event.y && coordinateMap[0][2] == event.z)
				{
					spawnTele();
					lotbool = true;
					return false;
				}
				//console.log(event.x + ' ' + event.y + ' ' + event.z + ' ' + event.w);
				//console.log(coordinates[0][0] + ' ' + coordinates[0][1] + ' ' + coordinates[0][2]);
			})
			return false;
		}
	});
	
	dispatch.hook('S_BOSS_GAGE_INFO', 2, (event) => {
		if (event.huntingZoneId === bossId[0] && event.templateId === bossId[1]) {
			boss = event;
		}

		if (boss) {
			let bossHp = bossHealth();
			if (bossHp <= 0 && boss.huntingZoneId === bossId[0] && boss.templateId === bossId[1]) {
				counter = 1;
				lotbool = false;
			}
		}
	 })

	 
	function bossHealth() {
		return (boss.curHp / boss.maxHp);
	}
	
	function spawnTele()
	{
		dispatch.toClient('S_SPAWN_ME', 1, {
			target: CID,
			x: coordinateMap[1][0],
			y: coordinateMap[1][1],
			z: coordinateMap[1][2],
			alive: 1,
			unk: 0
		})
	}
	
		function bossTele(coordinates)
	{
		teleLocation = {
			x: coordinates[0],
			y: coordinates[1],
			z: coordinates[2]
		};
		dispatch.toClient('S_INSTANT_MOVE', 1, Object.assign(teleLocation, { id: CID}))
	}
}

