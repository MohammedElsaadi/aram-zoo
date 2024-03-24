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
    <div className='teamPlayerContainer'>
        <h2>{props.title} - {props.team.length}/5</h2>
        {props.team.map(player => (
        <div key={player.id} className='PlayerCard'>
        <div>
            <button className='changeButton' onClick={() => props.changeTeam(player)}>change team</button>
            </div>
            <div>
            <span className='playerName'>{player.name}</span>
            <span className='champCount'>{player.champions.length} Champs</span>
            </div>
            <div>
            <button className='removeButton' onClick={() => props.removeTeam(player)}>remove</button>
            </div>
            </div>
      ))}
    </div>
  );
}

export default Team_slot;