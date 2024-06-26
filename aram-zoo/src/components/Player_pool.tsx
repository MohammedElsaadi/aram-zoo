import React from 'react';
import player_data from '../resources/player_data.json'

interface PlayerCard {
    id: number;
    name: string;
    champions: string[];
}

interface Player_pool_props {
    players: PlayerCard[];
    moveTeam1: (card: PlayerCard) => void;
    moveTeam2: (card: PlayerCard) => void;
    handlePlayerCreator: (event: React.MouseEvent) => void;
}

function Player_pool(props: Player_pool_props) {
  return (
    <div className='PlayerContainer'>
      {props.players.map(player => (
        <div key={player.id} className='PlayerCard'>
          <div>
            <button className='team1Button' onClick={() => props.moveTeam1(player)}>team1</button>
            </div>
            <div>
            <span className='playerName'>{player.name}</span>
            <span className='champCount'>{player.champions.length} Champs</span>
            </div>
            <div>
            <button className='team2Button' onClick={() => props.moveTeam2(player)}>team2</button>
            </div>
        </div>
      ))}
      <button className='createButton' onClick={(event) => props.handlePlayerCreator(event)}>Create Player</button>
    </div>
  );
}

export default Player_pool;