import React, { useEffect, useState } from 'react';
import './App.css';
import Player_pool from './components/Player_pool';
import PlayerData from './resources/player_data.json';
import Team_slot from './components/Team_slot';
import AlwaysAvailableChamps from './resources/aram_pool.json';
import AllChamps from './resources/all_champs.json';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, TextField } from '@mui/material';


interface PlayerCard {
  id: number;
  name: string;
  champions: string[];
}

// interface AramChamps {
//   alwaysAvailable: string[];
// }

function App() {

  const [players, setPlayers] = useState<PlayerCard[]>(PlayerData);
  const [AramChamps, setAramChamps] = useState(AlwaysAvailableChamps);
  const [team1, setTeam1] = useState<PlayerCard[]>([]);
  const [team2, setTeam2] = useState<PlayerCard[]>([]);
  const [team1Champs, setTeam1Champs] = useState(new Array());
  const [team2Champs, setTeam2Champs] = useState(new Array());
  const [rerolls, setRerolls] = useState(2);
  const [selectedChamps, setSelectedChamps] = useState(new Array());
  const [allChamps, setAllChamps] = useState(AllChamps)
  const [showPlayerCreator, setShowPlayerCreator] = useState(false);
  const [useAramChamps, setUseAramChamps] = useState(true);
  const [useFreeChamps, setUseFreeChamps] = useState(true);
  const [playerCreatorSelectedChamps, setPlayerCreatorSelectedChamps] = useState(new Array());
  const [playerCreatorName, setPlayerCreatorName] = useState("");
  let totalChamps = new Array();
  
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const parsedValue = parseInt(value,10)
    setRerolls(parsedValue);
  };

  const handlePlayerCreator = (event: React.MouseEvent) => {
    setPlayerCreatorSelectedChamps(playerCreatorSelectedChamps => allChamps);
    setPlayerCreatorName("");
    setShowPlayerCreator(!showPlayerCreator);
  };

  const handleGenerateJSON = () => {
    const newPlayerCard: PlayerCard = {
      id: PlayerData.length+1,
      name: playerCreatorName,
      champions: playerCreatorSelectedChamps
    };
    return JSON.stringify(newPlayerCard);
  };

  const handlePlayerName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerCreatorName(event.target.value);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>, imageName: string) => {
    if (!playerCreatorSelectedChamps.includes(imageName)){
      setPlayerCreatorSelectedChamps(playerCreatorSelectedChamps => [...playerCreatorSelectedChamps, imageName]);
    }else{
      setPlayerCreatorSelectedChamps(playerCreatorSelectedChamps => playerCreatorSelectedChamps.filter(c => c!== imageName));
    }
    const target = event.target as HTMLImageElement;
    target.classList.toggle('darken');
  };

  const moveTeam1 = (player: {id: number; name: string; champions: string[]}) => {
    if (team1.length < 5){
      setTeam1([...team1, player]);
      setPlayers(players.filter(p => p.id !== player.id));
    } else {
      alert("Team 1 is Full");
    }
  };

  const moveTeam2 = (player: {id: number; name: string; champions: string[]}) => {
    if (team2.length < 5){
      setTeam2([...team2, player]);
      setPlayers(players.filter(p => p.id !== player.id));
    } else {
      alert("Team 2 is Full");
    }
  };

  const removeTeam = (player: {id: number; name: string; champions: string[]}) => {
    setPlayers([...players, player]);
    setTeam1(team1.filter(p => p.id !== player.id));
    setTeam2(team2.filter(p => p.id !== player.id));
  };

  const changeTeam = (player: {id: number; name: string; champions: string[]}) => {
    if (team1.filter(p => p.id === player.id).length > 0){
      if (team2.length < 5){
        setTeam2([...team2, player]);
        setTeam1(team1.filter(p => p.id !== player.id));
      } else {
        alert("Team 2 is Full");
      }
    }else{
      if (team1.length < 5){
        setTeam1([...team1, player]);
        setTeam2(team2.filter(p => p.id !== player.id));
      } else {
        alert("Team 1 is Full");
      }
    }
  };

  const generateChampionPools = () => {
    let team1ChampPool = generateUniqueChampsForEachPlayer(team1);
    // setSelectedChamps(prevSelectedChamps => [...prevSelectedChamps, team1ChampPool]);
    let team2ChampPool = generateUniqueChampsForEachPlayer(team2);
    // setSelectedChamps(prevSelectedChamps => [...prevSelectedChamps, team1ChampPool]);
    setTeam1Champs(team1Champs => [...team1Champs, ...team1ChampPool]);
    setTeam2Champs(team2Champs => [...team2Champs, ...team2ChampPool]);
  };

  const combineAndRemoveDupes = (champs: string[]) => {
    let combinedList = new Array();
    
    combinedList = combinedList.concat(champs, useAramChamps ? AramChamps : []);

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
      let noDupeCombinedList = new Array();
      team.forEach(player => {
        combinedList = combineAndRemoveDupes(player.champions);
        noDupeCombinedList = combinedList.filter(c => !totalChamps.includes(c));
        playerChamps = pickRandomUniqueChamps(combinedList, 1 + rerolls);
        console.log(player.name + " has the following champs: " + playerChamps);

        for (let p = 0; p < playerChamps.length; p++){
          // console.log("selected champs so far is: " + [...teamChamps]);
          while (totalChamps.includes(playerChamps[p])){
            noDupeCombinedList = combinedList.filter(c => !playerChamps.includes(c));
            console.log("found a dupe and it is: " + playerChamps[p]);
            playerChamps[p] = pickRandomUniqueChamps(noDupeCombinedList, 1)[0];
          }
        }
        teamChamps = teamChamps.concat(playerChamps);
        totalChamps = totalChamps.concat(teamChamps);
      });
      return teamChamps;
  };
  

  var team1ChampIcons = team1Champs.map(champ => <img className="teamChampPics" src={"https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/" +champ +".png"}></img>);
  var team2ChampIcons = team2Champs.map(champ => <img className="teamChampPics" src={"https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/" +champ +".png"}></img>);
  var allChampIcons = allChamps.map(champ => <img className="PlayerCreatorImage" onClick={(event) => handleImageClick(event, champ)} src={"https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/" +champ +".png"}></img>);

  //note to future self: if the player creator is hidden then the state of the images becomes reset because we hide it by setting to null
  //so we need to make sure to also update the playercreator selected champs
  const label =  { 'aria-label': 'include ARAM default pool (65 champs)' };

  const boxStyle = {
    overflowY: 'scroll',
    scrollbarGutter: 'stable',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 680,
    height: 400,
    borderRadius: '12px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const formStyle = {
    margin: '5px',
    height: '50px'
  };

  return (
    <div className="AppContainer">
        <h1>ARAM ZOO</h1>
        <h4>10-Man Custom Aram Roller</h4>
        
      <div className='App-Body'>
        <div className='players'>
          <h2>Players</h2>
          <Player_pool players={players} moveTeam1={moveTeam1} moveTeam2={moveTeam2} handlePlayerCreator={handlePlayerCreator}></Player_pool>
        </div>
              <Modal
                open={showPlayerCreator}
                onClose={handlePlayerCreator}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={boxStyle}>
                  <FormControl sx={formStyle}>
                    <TextField className='inputText' required id="outlined-basic" label="Username" variant="outlined" value={playerCreatorName} onChange={handlePlayerName}/>
                  </FormControl>
                  {allChampIcons}
                  <button className='GenerateButton' onClick={() => navigator.clipboard.writeText(handleGenerateJSON())}>Generate JSON</button>
                  <a href='https://github.com/MohammedElsaadi/aram-zoo/edit/main/aram-zoo/src/resources/player_data.json'>Commit Player Data to Github</a>
                </Box>
              </Modal>
        <div className='teams'>
        <h2>Teams</h2>
        <div className='teamContainer'>
          <div className='team team1Area'>
            <Team_slot title="Team 1" team={team1} removeTeam={removeTeam} changeTeam={changeTeam}></Team_slot>
          </div>
          <div className='team team2Area'>
            <Team_slot title="Team 2" team={team2} removeTeam={removeTeam} changeTeam={changeTeam}></Team_slot>
          </div>
        </div>
        </div>
        <div className='generateAndPoolsContainer'>
        <h2>Champion Pools</h2>
        <div className='generateAndPoolsArea'>
        <div className='generateContainer'>
        <div className='generateArea'>
          <button className='poolsButton' onClick={() => {
            setSelectedChamps(selectedChamps => new Array());
            setTeam1Champs(team1Champs => new Array());
            setTeam2Champs(team2Champs => new Array());
            generateChampionPools();
            }}>
              Generate Team Champion Pools
          </button>
          <label className="rerollLabel">Number of re-rolls per person: </label>
        <select className="rerollSelect" value={rerolls} onChange={handleSelectChange}>
          <option>0</option>
          <option>1</option>
          <option selected>2</option>
          <option>3</option>
        </select>
        <FormControlLabel className='checkBoxes' control={<Checkbox onChange={() => setUseAramChamps(!useAramChamps)} defaultChecked />} label="Include ARAM Default Champions (65 Champs)" />
        </div>
        </div>
        <div className='pools'>
        <div className='ChampionPoolContainer'>
          <div className='pool team1Area'>
            <div className='iconContainer'>
            <h2> Team 1 Champion Pool</h2>
            {team1ChampIcons}
            </div>
          </div>
          <div className='pool team2Area'>
            <div className='iconContainer'>
            <h2> Team 2 Champion Pool</h2>
            {team2ChampIcons}
            </div>
          </div>
      </div>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default App;
