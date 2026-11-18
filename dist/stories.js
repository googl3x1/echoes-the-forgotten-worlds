import {collectionStories} from './collection-data.js';
import {extraStories} from './expansion-data.js';
export const stories={...extraStories,...collectionStories,
 opportunity:[
  {title:'I arrived with a question.',line:'Had this world ever known water?',text:'I came to Mars in 2004 with cameras for eyes and instruments to investigate the rocks. My team on Earth was looking for the traces of a very different past.',image:'opportunity-shadow.jpg',caption:'Opportunity’s shadow · mission-era mosaic',ref:'opp'},
  {title:'The smallest clues changed the story.',line:'A whole environment, hidden in tiny spheres.',text:'My instruments studied mineral concretions nicknamed “blueberries.” Their composition and surroundings helped scientists infer an ancient watery environment. Water left clues even after the landscape changed.',image:'blueberries.jpg',caption:'Microscopic Imager · April 19, 2004 · about 3 cm across',ref:'water'},
  {title:'My journey became an archive.',line:'Ninety Martian days became nearly fifteen Earth years.',text:'I travelled 45.16 kilometers. My last communication arrived during a dust storm in June 2018; the mission formally ended in February 2019. My wheels stopped, but the observations I sent home can still be studied.',image:'mars-landscape.jpg',caption:'Victoria crater panorama · Opportunity mission archive',ref:'opp'}
 ],
 eagle:[
  {title:'Two stages. One extraordinary landing.',line:'I brought two explorers to another world.',text:'In July 1969, Neil Armstrong and Buzz Aldrin descended to the Moon in Eagle. Michael Collins remained in lunar orbit. The landing was only half of the journey: the crew still needed a way back.',image:'eagle-surface.jpg',caption:'Apollo 11 surface photograph · July 1969',ref:'apollo'},
  {title:'Part of me had to stay.',line:'The stage left behind helped the crew leave.',text:'My lower descent stage remained at Tranquility Base. The upper ascent stage departed with the astronauts. The complete Lunar Module model shows both parts; it is not what stands on the surface today.',image:'eagle-poster.png',caption:'Complete Lunar Module design · includes both stages',ref:'apollo'},
  {title:'An orbiting camera found the traces.',line:'A landing becomes a place in history.',text:'LROC imagery documents the descent stage and trails left at the Apollo 11 site. Nearby experiments have their own identities and stories. Together, those records help us understand what remains.',image:'apollo-site-labeled.jpg',caption:'Apollo 11 site · annotated LROC orbital photograph',ref:'lroc'}
 ],
 insight:[
  {title:'I explored by staying still.',line:'My destination was beneath my feet.',text:'I landed in Elysium Planitia in November 2018. I was not a rover. My job was to investigate Mars from one place, listening for clues about the deep interior of a rocky planet.',image:'insight-poster.jpg',caption:'InSight selfie mosaic · March–April 2019',ref:'insight'},
  {title:'A vibration can carry a world.',line:'The surface was the beginning of the measurement.',text:'My seismometer listened from the ground. Scientists used seismic waves to investigate the crust, mantle, and core. I did not drill to the core: the waves carried information from layers I could not directly reach.',image:'insight-poster.jpg',caption:'SEIS was deployed on the ground beside the lander',ref:'seismic'},
  {title:'Even silence leaves something to study.',line:'The lander stopped. The observations continued.',text:'Dust on my panels reduced my power, and operations ended in December 2022. A HiRISE observation from October 23, 2024 documents the dusty lander. Even after a mission ends, its site can remain a subject of science.',image:'insight-orbit.jpg',caption:'HiRISE orbital observation · October 23, 2024',ref:'orbit'}
 ]
};
