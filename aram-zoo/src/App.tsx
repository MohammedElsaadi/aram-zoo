import React, { useEffect, useState } from 'react';
import './App.css';
import Player_pool from './components/Player_pool';
import PlayerData from './resources/player_data.json';
import Team_slot from './components/Team_slot';
import AlwaysAvailableChamps from './resources/aram_pool.json';

interface PlayerCard {
  id: number;
  name: string;
  champions: string[];
}

// interface AramChamps {
//   alwaysAvailable: string[];
// }

function App() {

  const [players, setPlayers] = useState<PlayerCard[]>([]);
  const [AramChamps, setAramChamps] = useState(new Array());
  const [team1, setTeam1] = useState<PlayerCard[]>([]);
  const [team2, setTeam2] = useState<PlayerCard[]>([]);
  const [team1Champs, setTeam1Champs] = useState(new Array());
  const [team2Champs, setTeam2Champs] = useState(new Array());
  const [rerolls, setRerolls] = useState(2);
  const [selectedChamps, setSelectedChamps] = useState(new Array());

  useEffect(() => {
    setPlayers(PlayerData);
    setAramChamps(AlwaysAvailableChamps);
  }, []);
  
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const parsedValue = parseInt(value,10)
    setRerolls(parsedValue);
  };

  const moveTeam1 = (player: {id: number; name: string; champions: string[]}) => {
    setTeam1([...team1, player]);
    setPlayers(players.filter(p => p.id !== player.id));
  };

  const moveTeam2 = (player: {id: number; name: string; champions: string[]}) => {
    setTeam2([...team2, player]);
    setPlayers(players.filter(p => p.id !== player.id));
  };

  const removeTeam = (player: {id: number; name: string; champions: string[]}) => {
    setPlayers([...players, player]);
    setTeam1(team1.filter(p => p.id !== player.id));
    setTeam2(team2.filter(p => p.id !== player.id));
  };

  const changeTeam = (player: {id: number; name: string; champions: string[]}) => {
    if (team1.filter(p => p.id === player.id).length > 0){
      setTeam2([...team2, player]);
      setTeam1(team1.filter(p => p.id !== player.id));
    }else{
      setTeam1([...team1, player]);
      setTeam2(team2.filter(p => p.id !== player.id));
    }
  };

  const generateChampionPools = () => {
    let team1ChampPool = generateUniqueChampsForEachPlayer(team1);
    let team2ChampPool = generateUniqueChampsForEachPlayer(team2);
    setTeam1Champs(team1Champs => [...team1Champs, ...team1ChampPool]);
    setTeam2Champs(team2Champs => [...team2Champs, ...team2ChampPool]);
  };

  const combineAndRemoveDupes = (champs: string[]) => {
    let combinedList = new Array();
    
    combinedList = combinedList.concat(champs, AramChamps);

    combinedList = Array.from(new Set(combinedList));
    
    return combinedList;
  };

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const pickRandomUniqueChamps = (combinedList: string[], numChamps: number) => {
    const shuffledList = shuffleArray([...combinedList]);
    return shuffledList.slice(0, numChamps);
  };

  const generateUniqueChampsForEachPlayer = (team: PlayerCard[]) => {
  
      let playerChamps = new Array();
      let combinedList = new Array();
      let teamChamps = new Array();
      team.forEach(player => {
        combinedList = combineAndRemoveDupes(player.champions);
        playerChamps = pickRandomUniqueChamps(combinedList, 1 + rerolls);

        playerChamps.forEach(champ => {
          while (selectedChamps.includes(champ)){
            champ = pickRandomUniqueChamps(combinedList, 1)[0];
          }
        });
        setSelectedChamps(selectedChamps => [...selectedChamps, ...playerChamps]);
        teamChamps = teamChamps.concat(playerChamps);
      });
      return teamChamps;
  };

  var team1ChampIcons = team1Champs.map(champ => <img src={"https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/" +champ +".png"}></img>);
  var team2ChampIcons = team2Champs.map(champ => <img src={"https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/" +champ +".png"}></img>);


  return (
    <div className="AppContainer">
      <div className="App-Header">
        <h1>ARAM ZOO</h1>
        <h2>10-Man Custom Aram Roller</h2>
        <h3>Includes</h3>
        <select value={rerolls} onChange={handleSelectChange}>
          <option>0</option>
          <option>1</option>
          <option selected>2</option>
          <option>3</option>
        </select>
        <h3> re-rolls</h3>
      </div>
      <div className='App-Body'>
        <div className='players'>
          <h2>Players</h2>
          <Player_pool players={players} moveTeam1={moveTeam1} moveTeam2={moveTeam2}></Player_pool>
        </div>
        <div className='teamContainer'>
          <div className='team'>
            <Team_slot title="Team 1" team={team1} removeTeam={removeTeam} changeTeam={changeTeam}></Team_slot>
          </div>
          <div className='team'>
            <Team_slot title="Team 2" team={team2} removeTeam={removeTeam} changeTeam={changeTeam}></Team_slot>
          </div>
        </div>
        </div>
        <div>
        <div className='generateContainer'>
          <button onClick={() => {
            setSelectedChamps(selectedChamps => new Array());
            setTeam1Champs(team1Champs => new Array());
            setTeam2Champs(team2Champs => new Array());
            generateChampionPools();
            }}>
              Generate Team Champion Pools
          </button>
        </div>
        <div className='ChampionPool'>
          <div className='pools'>
            <h2> Team 1 Champion Pool</h2>
            {team1ChampIcons}
          </div>
          <div className='pools'>
            <h2> Team 2 Champion Pool</h2>
            {team2ChampIcons}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
