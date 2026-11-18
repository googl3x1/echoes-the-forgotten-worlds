import {collectionLearning} from './collection-data.js';
import {extraLearning} from './expansion-data.js';
// Authored learning goals, tied to the same primary evidence as each exhibit.
export const learning = {...extraLearning,...collectionLearning,
 opportunity: {
  chapterParts:[0,2,1],
  parts:[
   {prompt:'Can you find my cameras?',hint:'Look for the pair of eyes on top of the tall mast.',simple:'My cameras were my eyes. They sent pictures of rocks and the landscape to my team on Earth.',discovery:'The pictures helped scientists choose which rocks to investigate.',ref:'opp'},
   {prompt:'Can you find what powered me?',hint:'Look for the wide, flat panels on my back.',simple:'My solar panels turned sunlight into electricity. That electricity powered my instruments.',discovery:'Dust and darkness can reduce the power available to a solar-powered rover.',ref:'opp'},
   {prompt:'Can you find my rock tools?',hint:'Look for the folded arm at the front, below the deck.',simple:'My arm brought tools close to rocks. A tiny camera looked at small details, and another tool rubbed rock surfaces.',discovery:'Pictures and measurements together helped scientists investigate ancient water.',ref:'opp'}
  ]
 },
 eagle:{
  chapterParts:[2,0,1],
  parts:[
   {prompt:'Can you find the stage that stayed?',hint:'Look below the crew cabin for the broad, gold-covered lower stage.',simple:'This is the descent stage. It helped Eagle land and stayed on the Moon when the astronauts left.',discovery:'Only this lower stage remained at Tranquility Base. The full model shows the vehicle during the mission.',ref:'apollo'},
   {prompt:'Can you find the astronauts’ way back?',hint:'Look for the upper cabin, above the gold descent stage.',simple:'This is the ascent stage. It carried the astronauts away from the surface and back toward lunar orbit.',discovery:'A complete Lunar Module model has two stages, but the landing site does not have both standing there.',ref:'apollo'},
   {prompt:'Can you find my landing feet?',hint:'Look at the ends of the four long legs.',simple:'The legs and wide footpads supported Eagle when it landed on the lunar surface.',discovery:'The landing structure belongs to the descent stage that remained at the site.',ref:'catalogue'}
  ]
 },
 insight:{
  chapterParts:[2,1,0],
  parts:[
   {prompt:'Can you find my power supply?',hint:'Look for the two large, round panels on either side.',simple:'My solar panels collected sunlight and turned it into electricity.',discovery:'Dust covered the panels over time and reduced how much power they could make.',ref:'orbit'},
   {prompt:'Can you find my listening instrument?',hint:'Look on the ground beside the lander for a small round cover connected by a tether.',simple:'Under this cover, my seismometer measured tiny vibrations in the ground. Scientists call many of these events marsquakes.',discovery:'Those vibrations helped scientists investigate the crust, mantle, and core of Mars.',ref:'seismic'},
   {prompt:'Can you find my helping arm?',hint:'Look on top of the deck for the raised, jointed arm.',simple:'My robotic arm placed instruments on the ground beside me.',discovery:'The seismometer listened from the ground, rather than from the vibrating deck.',ref:'seismic'}
  ]
 }
};

export function challengeFor(id,chapter){const exhibit=learning[id];if(!exhibit)return null;const index=exhibit.chapterParts[chapter];return {index,...exhibit.parts[index]};}
export function evaluatePart(id,target,index){const exhibit=learning[id],part=exhibit?.parts[index];if(!part)return null;const correct=target===null||target===undefined||target===index;return {correct,part,hint:correct?'':exhibit.parts[target]?.hint||''};}
