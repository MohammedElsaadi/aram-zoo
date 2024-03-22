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
}

function Player_pool(props: Player_pool_props) {
  return (
    <div className='PlayerContainer'>
      {props.players.map(player => (
        <div key={player.id} className='PlayerCard'>
            <button onClick={() => props.moveTeam1(player)}>team1</button>
            <span>{player.name} - {player.champions.length} Champs</span>
            <button onClick={() => props.moveTeam2(player)}>team2</button>
        </div>
      ))}
    </div>
  );
}

export default Player_pool;