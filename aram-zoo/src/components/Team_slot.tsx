import React, { useState } from 'react';

interface PlayerCard {
    id: number;
    name: string;
    champions: string[];
}

interface Team_slot_props {
    team: PlayerCard[];
    title: string;
    removeTeam: (card: PlayerCard) => void;
    changeTeam: (card: PlayerCard) => void;
}

function Team_slot(props: Team_slot_props) {
  return (
    <div>
        <h2>{props.title}</h2>
        <h4>{props.team.length}/5</h4>
        {props.team.map(player => (
        <div key={player.id} className='PlayerCard'>
            <button onClick={() => props.changeTeam(player)}>change team</button>
            <span>{player.name} - {player.champions.length} Champs</span>
            <button onClick={() => props.removeTeam(player)}>remove</button>
        </div>
      ))}
    </div>
  );
}

export default Team_slot;