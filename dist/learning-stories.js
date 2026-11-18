import {collectionLearningStories} from './collection-data.js';
// Original third-person learning narratives, grounded in the source records in data.js.
// These are educational narration, not quotations from astronauts or spacecraft.
const captions = {
  'opportunity-shadow.jpg': 'NASA/JPL-Caltech/Cornell · Opportunity’s shadow on the Martian surface, a historical mission image rather than a present-day view.',
  'mars-landscape.jpg': 'NASA/JPL-Caltech/Cornell · Opportunity’s Victoria crater panorama from Cape Verde, September 2006; this is not the rover’s final resting site.',
  'blueberries.jpg': 'NASA/JPL-Caltech/Cornell/USGS · Opportunity’s microscopic view near Fram Crater, April 19, 2004, with color information from Pancam; the scene is about three centimeters across.',
  'eagle-surface.jpg': 'NASA/Neil Armstrong · AS11-40-5927, July 20, 1969: Buzz Aldrin removes the Early Apollo Surface Experiments Package from Eagle before the ascent stage departs.',
  'apollo-site.jpg': 'NASA/Goddard Space Flight Center/Arizona State University · Later LROC orbital photograph of the Apollo 11 landing site, including the descent stage and astronaut trails; not a live view.',
  'apollo-site-labeled.jpg': 'NASA/Goddard Space Flight Center/Arizona State University · Annotated LROC orbital photograph of the Apollo 11 landing site, identifying separate surface artifacts and trails.',
  'insight-poster.jpg': 'NASA/JPL-Caltech · PIA23203, InSight’s second full selfie: a mosaic of images acquired March 15 and April 11, 2019, after its instruments were deployed off the deck.',
  'insight-final.jpg': 'NASA/JPL-Caltech · PIA25287, InSight’s final selfie, April 24, 2022, showing dust on the working lander; a dated mission observation, not its current appearance.',
  'insight-orbit.jpg': 'NASA/JPL-Caltech/University of Arizona · HiRISE observation of the retired InSight lander acquired October 23, 2024, documenting dust accumulation after surface operations ended.',
  'spirit-selfie.jpg': 'NASA/JPL/Cornell · PIA07371, Spirit’s self-portrait from sols 329–330, during its working mission; the image does not show its later immobilization at Troy.',
  'lrv-apollo17.jpg': 'NASA/Harrison H. Schmitt · AS17-134-20476, December 13, 1972: Gene Cernan beside the equipped Apollo 17 Lunar Roving Vehicle during the third surface excursion.',
  'lrv-apollo17-driving.jpg': 'NASA/Harrison H. Schmitt · AS17-147-22526, December 11, 1972: Gene Cernan checks the Apollo 17 rover before the camera, communications unit, and antennas were loaded.',
  'retroreflector-apollo11.jpg': 'NASA/Neil Armstrong · AS11-40-5952, July 20, 1969: the deployed Apollo 11 Laser Ranging Retro-Reflector, photographed on the lunar surface.',
  'surveyor3.jpg': 'NASA/Alan L. Bean · AS12-48-7121, November 20, 1969: Surveyor 3 photographed during Apollo 12’s visit, before selected components were carried back to Earth.',
  'surveyor3-apollo12.jpg': 'NASA/Alan L. Bean · AS12-48-7133, November 20, 1969: Pete Conrad examines Surveyor 3’s television camera before removal; Apollo 12’s Lunar Module stands in the background.',
  'alsep12.jpg': 'NASA/Alan L. Bean · AS12-47-6918, November 19, 1969: Apollo 12’s deployed passive seismic experiment in the foreground, central station behind it, and SIDE instrument on legs.',
  'alsep12-deployment.jpg': 'NASA/Charles Conrad Jr. · AS12-47-6919, November 19, 1969: Alan Bean deploys components of Apollo 12’s Lunar Surface Experiments Package.',
  'viking1-panorama.jpg': 'NASA/JPL · PIA03166, afternoon at Chryse Planitia: a Viking Lander 1 Camera 2 surface mosaic from the historical mission, with unfilled mosaic regions shown in black.',
  'viking1-first-panorama.jpg': 'NASA/JPL · PIA00383, Viking 1’s first panoramic surface view, July 20, 1976; parallel lines in the sky are imaging artifacts rather than Martian features.',
  'phoenix-panorama.jpg': 'NASA/JPL-Caltech/University of Arizona/Texas A&M University · PIA13804, a Phoenix deck and landing-site panorama assembled from images acquired in the first weeks after its May 25, 2008 landing.',
  'phoenix-ice-before.jpg': 'NASA/JPL-Caltech/University of Arizona/Texas A&M University · PIA10910, Phoenix’s Dodo-Goldilocks trench on sol 20 in 2008, before exposed ice pieces disappeared.',
  'phoenix-ice-after.jpg': 'NASA/JPL-Caltech/University of Arizona/Texas A&M University · PIA10911, the Dodo-Goldilocks trench on sol 24 in 2008, after small ice pieces had sublimated.',
};

function chapter(title, time, paragraphs, image, refs, extra = {}) {
  return {title, time, paragraphs, image, caption: captions[image], refs, ...extra};
}

export const learningStories = {...collectionLearningStories,
  opportunity: {
    tagline: 'A small rover learned to read a very old landscape.',
    chapters: [
      chapter('A geologist arrives inside a crater', 'MERIDIANI PLANUM · 2004', [
        'Opportunity arrived on Mars in 2004 and came to rest inside Eagle Crater. Around the little machine lay rocks and soil that could hold clues about a much older planet. Its assignment was to investigate the history of water, using observations gathered directly from the ground.',
        'The rover had a twin, Spirit, exploring a different part of Mars. Both were robotic geologists: machines that studied rocks for scientists far away on Earth. Opportunity’s original surface mission was planned for ninety Martian days, called sols. The record it eventually created would reach far beyond that beginning.',
      ], 'opportunity-shadow.jpg', ['opp', 'mer']),
      chapter('Eyes above the ground, tools beside a rock', 'THE ROVER AT WORK', [
        'Opportunity’s cameras stood on a mast, giving its team views across the landscape. Pictures helped scientists choose promising rocks and understand the surroundings of each measurement. Its wheels carried the instruments from one geological setting to another, making the journey itself part of the investigation.',
        'Closer to the ground, a robotic arm brought tools toward rocks and soil. A microscopic imager examined small structures, while a rock abrasion tool exposed surfaces for study. Solar arrays changed sunlight into electricity. Cameras, tools, movement, and power all supported the patient work of turning an unfamiliar place into evidence.',
      ], 'mars-landscape.jpg', ['opp', 'mer']),
      chapter('Tiny spheres tell a larger story', 'MINERAL EVIDENCE · 2004', [
        'Some of Opportunity’s most memorable clues were tiny mineral spheres nicknamed blueberries. They were not fruit. These small, rounded concretions contained the iron-bearing mineral hematite. A close-up photograph near Fram Crater showed details across a scene only about three centimeters wide.',
        'The photograph was one part of the evidence. Scientific measurements and the surrounding geology helped the team interpret how the minerals formed. Together, those observations supported an ancient watery environment. They described conditions in Mars’s past, rather than a river flowing beside the rover. Evidence for water also remained distinct from a discovery of living organisms.',
      ], 'blueberries.jpg', ['water', 'mer']),
      chapter('A journey becomes an archive', 'LAST CONTACT 2018 · MISSION COMPLETE 2019', [
        'Opportunity’s final communication reached Earth on June 10, 2018, during a planet-wide dust storm. NASA declared the mission complete on February 13, 2019. By then the solar-powered explorer had traveled far from its original landing place, ending its documented journey in Perseverance Valley.',
        'The rover remained on Mars, but its observations had already crossed the distance to Earth. Images, measurements, and route records preserved its work for further study. A historical photograph cannot show its exact appearance today. Its lasting scientific contribution is the evidence it gathered, linking a small machine’s travels with a much longer planetary history.',
      ], 'opportunity-shadow.jpg', ['opp', 'traverse', 'water']),
    ],
  },
  eagle: {
    tagline: 'Two stages made a landing possible; one became a lunar landmark.',
    chapters: [
      chapter('A spacecraft reaches a new shore', 'TRANQUILITY BASE · JULY 1969', [
        'In July 1969, Apollo 11’s Lunar Module, Eagle, carried Neil Armstrong and Buzz Aldrin to the Moon’s surface. Michael Collins remained in lunar orbit in the Command Module. The landing placed people and scientific equipment on ground that humans had never walked across before.',
        'Eagle was both transportation and a temporary base for the surface visit. Its shape reflected a very particular journey: descending to the Moon and then sending the crew back toward orbit. The spacecraft’s two stages served those different parts of the mission. That division explains why the artifact at Tranquility Base is only part of Eagle.',
      ], 'eagle-surface.jpg', ['apollo']),
      chapter('One spacecraft, two different departures', 'LANDING AND ASCENT', [
        'The lower descent stage supported Eagle’s landing. Its legs and footpads held the spacecraft above the surface while the astronauts prepared for their work outside. Above it stood the ascent stage, including the crew cabin that would be needed for the next part of the journey.',
        'When the astronauts departed, the ascent stage lifted away and the descent stage stayed at Tranquility Base. The complete engineering model represents both sections together. It illustrates the spacecraft’s design rather than the exact configuration now standing on the Moon. The remaining lower structure and the departed upper cabin belong to the same history, but they have different destinations.',
      ], 'eagle-surface.jpg', ['apollo', 'catalogue']),
      chapter('A landing makes surface science possible', 'THE APOLLO 11 SURFACE VISIT', [
        'Eagle’s contribution to science began with delivering the astronauts and their equipment safely to the surface. The crew could observe the ground, collect samples, and deploy experiments. Their scientific work depended on the landing system, even though the descent stage was not itself every experiment placed nearby.',
        'The resulting mission record contains several kinds of evidence: photographs, observations, returned samples, and equipment left on the Moon. Those pieces should be distinguished. A deployed instrument had its own purpose, while Eagle provided the means to reach the site. The story connects engineering with the opportunity to investigate a place directly.',
      ], 'eagle-surface.jpg', ['apollo', 'catalogue']),
      chapter('The stage that stayed can still be seen', 'LATER ORBITAL OBSERVATIONS', [
        'Later, the Lunar Reconnaissance Orbiter Camera photographed the Apollo 11 landing site from above. Its images document the descent stage and trails made during the astronauts’ surface activities. The orbital view connects the famous human visit with a real, recorded location on the Moon.',
        'NASA’s historical catalogue lists the descent stage and nearby equipment as separate artifacts. It is an inventory, not a live report of every surface detail. Together, the catalogue and photographs help preserve the meaning of Tranquility Base: a place where transportation became heritage, and where a short visit left a much longer record of exploration.',
      ], 'apollo-site-labeled.jpg', ['lroc', 'catalogue', 'apollo']),
    ],
  },
  insight: {
    tagline: 'A lander stayed still to investigate a world beneath its feet.',
    chapters: [
      chapter('An explorer that did not need to roam', 'ELYSIUM PLANITIA · NOVEMBER 2018', [
        'InSight landed in Elysium Planitia on November 26, 2018. It carried a scientific purpose different from a rover searching across many outcrops. This lander would remain in one place and investigate Mars’s deep interior, including layers hidden far beneath the visible surface.',
        'The ground around its legs became the beginning of a much deeper investigation. Instead of traveling down a tunnel or looking through the planet, scientists would study signals reaching the surface. The mission brought together a stable landing platform, instruments, an arm, and solar power. Each part supported observations that could help reveal how a rocky planet is built.',
      ], 'insight-poster.jpg', ['insight', 'seismic']),
      chapter('A very sensitive instrument meets the ground', 'DEPLOYING THE SEISMOMETER', [
        'InSight’s robotic arm placed its seismometer on the surface beside the lander. The instrument measured tiny vibrations in the ground. Its location mattered: the scientific work required careful measurements of Mars, rather than simply recording movement from a machine’s own deck.',
        'A seismometer turns motion into information that scientists can examine. InSight also carried a separate heat-flow probe, with a different job and a different challenge. That probe did not achieve its intended burial depth. Keeping the instruments distinct helps explain the mission accurately: seismic investigation succeeded without a drill reaching the core, while another planned measurement faced a serious limitation.',
      ], 'insight-poster.jpg', ['seismic']),
      chapter('Invisible layers leave measurable clues', 'THE CRUST, MANTLE, AND CORE', [
        'A vibration can carry information about the material it passes through. Scientists used InSight’s seismic measurements to investigate the crust, mantle, and core of Mars. These layers could not be photographed directly from the surface, but their properties affected the signals that reached the instrument.',
        'The important discovery was a new way of investigating an unseen planet through observations at one small site. Interpreting those measurements required scientific models and careful analysis. The results helped compare the interiors of rocky worlds. The lander’s stillness was therefore part of its strength: a stationary instrument could gather clues about structures far larger than the spacecraft itself.',
      ], 'insight-poster.jpg', ['seismic', 'insight']),
      chapter('Silence does not erase a scientific record', 'OPERATIONS END 2022 · ORBITAL VIEW 2024', [
        'Dust accumulated on InSight’s solar panels, reducing its ability to generate electricity. Operations ended in December 2022. The lander’s instruments became quiet, while the measurements already transmitted to Earth remained available for scientific study and comparison.',
        'The site could still be observed from orbit. A HiRISE image acquired on October 23, 2024 documented dust on the retired lander. That dated observation does not imply that InSight had restarted or that the image shows this very moment. It demonstrates another kind of scientific continuity: a machine that once observed Mars can later become an object observed by another mission.',
      ], 'insight-orbit.jpg', ['insight', 'orbit']),
    ],
  },
  spirit: {
    tagline: 'An unexpected track exposed a clue to a wetter Martian past.',
    chapters: [
      chapter('A twin takes a different road', 'GUSEV CRATER · 2004', [
        'Spirit arrived on Mars in 2004 with the same basic rover design as Opportunity. The twins, however, explored different landscapes. Spirit investigated Gusev crater and the Columbia Hills, carrying cameras and scientific tools into places its twin would never visit.',
        'The shared purpose was to investigate the history of water recorded in rocks and soil. A familiar-looking surface could have an unfamiliar past, and a picture alone could not explain every mineral. Spirit’s work connected views of the landscape with measurements made close to the ground. Its route became a sequence of places where scientific ideas could meet physical evidence.',
      ], 'spirit-selfie.jpg', ['spirit', 'mer']),
      chapter('A moving laboratory meets a difficulty', 'CAMERAS, SOLAR ARRAYS, AND AN ARM', [
        'Spirit’s mast cameras helped the team see its surroundings and choose scientific targets. Solar arrays supplied electricity, and a robotic arm brought instruments near the materials under investigation. Movement and close examination worked together: the rover could travel toward a promising place and then study it carefully.',
        'A wheel that no longer turned created a mechanical problem. As the rover dragged it across the ground, the wheel disturbed surface material and exposed brighter soil underneath. The difficulty did not automatically become a discovery. Scientific instruments still had to measure the exposed material before its significance could be understood.',
      ], 'spirit-selfie.jpg', ['spirit', 'spiritSilica', 'mer']),
      chapter('Bright soil becomes a scientific clue', 'SILICA-RICH MATERIAL · 2007', [
        'In 2007, an instrument on Spirit’s arm examined the bright soil exposed by its dragging wheel. The measurements revealed material rich in silica. The striking appearance had attracted attention, but the chemical measurement gave scientists a stronger basis for explaining the find.',
        'The team proposed that processes involving water had helped concentrate the silica. The result added evidence for a wetter Martian past, while leaving room for investigation of the precise geological story. It did not establish living organisms. Spirit’s discovery shows how useful evidence can emerge from an unexpected event when careful measurement follows an unusual observation.',
      ], 'spirit-selfie.jpg', ['spiritSilica', 'spirit']),
      chapter('The tracks end at Troy', 'LAST SIGNAL 2010 · RECOVERY ENDS 2011', [
        'Spirit became stuck in soft soil at a place called Troy in 2009. Its final communication reached Earth on March 22, 2010. NASA continued efforts to contact the rover before ending the recovery attempt on May 25, 2011. Those dates mark different parts of the mission’s ending.',
        'The rover remained on Mars, while its photographs and scientific measurements remained part of a growing archive on Earth. A shared rover model shows the engineering design, not Spirit’s final wheel damage or exact present condition. Its legacy includes the silica finding and the broader lesson that unexpected observations can become valuable evidence through patient scientific work.',
      ], 'spirit-selfie.jpg', ['spiritEnd', 'spiritSilica', 'spirit']),
    ],
  },
  lrv: {
    tagline: 'Four unusual wheels carried human exploration farther across the Moon.',
    chapters: [
      chapter('A car arrives where there are no roads', 'TAURUS-LITTROW · DECEMBER 1972', [
        'Apollo 17 brought Gene Cernan and Harrison Schmitt to the Taurus-Littrow valley in December 1972. Their Lunar Roving Vehicle gave the surface expedition a new reach. Instead of walking between every geological stop, the astronauts could travel with a vehicle carrying people and equipment.',
        'The rover was a scientific tool as well as transportation. Every journey supported the larger purpose of observing the lunar landscape and collecting samples. Apollo 15 and Apollo 16 had also used lunar rovers, each leaving its own vehicle behind. Apollo 17’s machine belonged to that small family of cars designed for exploration on another world.',
      ], 'lrv-apollo17-driving.jpg', ['apollo17', 'lrv']),
      chapter('An electric vehicle with wire-mesh tires', 'THE LUNAR ROVER DESIGN', [
        'The Lunar Roving Vehicle used electric batteries to power its wheels. Its four tires were made with woven wire mesh rather than being filled with air. Two seats carried the astronauts, while equipment storage and communications hardware helped support their work away from the Lunar Module.',
        'The high-gain antenna was part of that communication system. Wheels, seats, power, and communications solved different parts of the same exploration problem. A rover photograph taken before equipment was loaded shows a less complete configuration than later mission views. The changing appearance reflects preparation for work, rather than several different kinds of Apollo 17 vehicle.',
      ], 'lrv-apollo17.jpg', ['lrv', 'apollo17']),
      chapter('A wider journey means more places to study', 'GEOLOGICAL EXPLORATION', [
        'During Apollo 17, the rover covered about 35.7 kilometers. That travel connected geological stops across Taurus-Littrow and supported the crew’s observations and sample collection. The vehicle did not make every scientific interpretation itself; it carried the people and equipment that could investigate the ground.',
        'Its contribution is therefore measured partly in access. A useful rock or landscape becomes more informative when an expedition can reach it, observe its surroundings, and preserve a record. The rover helped extend that opportunity. Its wheels were part of a chain linking engineering, fieldwork, collected samples, and the scientific study that continued after the crew returned.',
      ], 'lrv-apollo17.jpg', ['apollo17', 'lrv']),
      chapter('The crew returned; the vehicle remained', 'THE APOLLO 17 SITE AFTER DEPARTURE', [
        'Cernan and Schmitt left the Moon, but their rover stayed in the Taurus-Littrow valley. The parked vehicle became one of the artifacts marking the expedition. Its story joins the hardware left on the surface with the observations and samples carried back toward Earth.',
        'Later Lunar Reconnaissance Orbiter Camera imagery documented the Apollo 17 site, including rover tracks and astronaut paths. Those later observations preserve traces of a completed journey. An illustrative rover model represents the design, while a mission photograph records a particular moment during use. Together, the different records help explain why an empty vehicle can still carry a scientific history.',
      ], 'lrv-apollo17.jpg', ['lrvArchive', 'apollo17', 'lrv']),
    ],
  },
  reflector: {
    tagline: 'A small panel answers incoming light without a battery or a radio.',
    chapters: [
      chapter('A quiet experiment beside the landing site', 'TRANQUILITY BASE · 1969', [
        'Apollo 11’s astronauts placed a laser-ranging reflector on the Moon in 1969. It was much smaller than the Lunar Module: an aluminum panel containing one hundred carefully shaped pieces of fused silica. Each piece was a corner-cube reflector, and together they formed a target for light sent from Earth.',
        'The experiment had no wheels or crew cabin. Its purpose depended on a relationship between equipment on two worlds. A ground station could send laser pulses toward the lunar array and detect returning light. The astronauts had left behind a small optical link that could support measurements long after their brief surface visit.',
      ], 'retroreflector-apollo11.jpg', ['reflector', 'reflectorScience', 'apollo']),
      chapter('A shape that returns light', 'PASSIVE OPTICAL EQUIPMENT', [
        'The Apollo 11 array holds its hundred corner cubes in a ten-by-ten grid on a panel about forty-six centimeters across. Their optical shape returns incoming light toward its source. The panel and support structure keep those small reflectors together as a surface experiment.',
        'This is passive reflection. The array does not create its own laser beam, transmit a radio message, or use a battery to send the light back. The energy for the measurement begins with the laser pulse sent from Earth. Equipment at the ground station then detects the faint return, completing an experiment whose parts are separated by space.',
      ], 'retroreflector-apollo11.jpg', ['reflector', 'reflectorPower', 'reflectorScience']),
      chapter('Travel time becomes a measurement', 'THE EARTH–MOON SYSTEM', [
        'Scientists measure the time taken by a laser pulse to travel to the Moon and return. That timing provides information about the distance between the ground station and the reflector. Repeated measurements help investigate the distance and motion of the Earth–Moon system.',
        'The important scientific product is therefore not a photograph taken by the panel. It is a series of carefully timed light returns interpreted by researchers. A small object on the Moon can support an investigation involving two moving worlds. The experiment demonstrates how the same physical hardware can contribute to a record that grows through measurements made at different times.',
      ], 'retroreflector-apollo11.jpg', ['reflectorScience', 'reflectorPower']),
      chapter('A different kind of silence', 'AN EXPERIMENT WITHOUT ONBOARD ELECTRICITY', [
        'The reflector remained at Tranquility Base when the Apollo 11 crew departed. Unlike a rover whose powered communications have ended, this optical array was never designed to speak by radio. Its lack of a battery does not give it the same kind of ending as an exhausted electrical system.',
        'Its scientific usefulness depends on returning incoming light and on the observing equipment on Earth. Historical photographs document its deployment, while engineering descriptions explain its design. They do not reveal every detail of its present surface condition. The array’s legacy is a reminder that an instrument can support science through its optical shape alone, without an onboard electrical power supply.',
      ], 'retroreflector-apollo11.jpg', ['reflectorPower', 'reflectorScience', 'catalogue']),
    ],
  },
  surveyor3: {
    tagline: 'A robot tested the lunar ground, then became a sample itself.',
    chapters: [
      chapter('A robot arrives before the footprints', 'OCEAN OF STORMS · APRIL 1967', [
        'Surveyor 3 landed on the Moon in April 1967, before astronauts had walked there. Its television camera looked across the surrounding ground, and its surface sampler could reach into the nearby soil. The mission combined seeing a place with testing the material beneath the lander.',
        'This was practical preparation for future exploration. Engineers needed observations about the surface that a human landing system would meet. A robot could investigate that unfamiliar ground while commands and pictures crossed the distance to Earth. Surveyor 3’s work began a story that would later bring people to the very place where the machine had settled.',
      ], 'surveyor3.jpg', ['surveyor3', 'apollo12']),
      chapter('Pictures show the scoop at work', 'REMOTELY COMMANDED SURFACE TESTS', [
        'The lander’s television camera and surface sampler complemented each other. The camera recorded the surroundings and the sampler’s work. The scoop dug and pressed lunar material, giving the team evidence about how the ground behaved when a machine touched and disturbed it.',
        'Solar power supported the lander’s working life, but the scientific task was more specific than simply surviving on the Moon. A surface’s appearance could not fully describe its strength or response to contact. By pairing images with physical tests, Surveyor 3 helped engineers move beyond a distant view toward a more useful understanding of the ground.',
      ], 'surveyor3.jpg', ['surveyor3']),
      chapter('The soil answers an engineering problem', 'BEFORE A HUMAN LUNAR LANDING', [
        'Surveyor 3’s sampler produced evidence that helped engineers understand the lunar surface before a human landing. Digging and pressing the material revealed behavior that photographs alone could not provide. The tests contributed to confidence that landing equipment could be supported by the ground.',
        'The result connected two kinds of science: observing the Moon and learning how a machine could operate there. The camera supplied context, while the sampler made the interaction measurable. Surveyor 3 did not need astronauts beside it to perform that early work. Its remote observations helped prepare a route from robotic investigation toward direct human exploration.',
      ], 'surveyor3.jpg', ['surveyor3', 'apollo12']),
      chapter('The visitors bring part of the robot home', 'LAST CONTACT 1967 · APOLLO 12 VISIT 1969', [
        'Surveyor 3’s final contact was May 4, 1967. In November 1969, Apollo 12 astronauts visited the inactive lander. They photographed it and removed selected pieces, including its television camera and trenching scoop, to bring back to Earth for examination.',
        'Much of the robot stayed on the Moon, but those returned parts began another scientific chapter. Researchers could study real equipment that had experienced prolonged lunar exposure. A complete working-era illustration therefore differs from the hardware left after the visit. Surveyor 3 became both an artifact on the surface and a source of material evidence in laboratories on Earth.',
      ], 'surveyor3-apollo12.jpg', ['surveyorReturn', 'surveyorVisit', 'surveyor3']),
    ],
  },
  alsep12: {
    tagline: 'A short human visit left a station that kept gathering science.',
    chapters: [
      chapter('Unpacking a station for the Moon', 'APOLLO 12 · NOVEMBER 1969', [
        'During Apollo 12, Pete Conrad and Alan Bean deployed the first full Apollo Lunar Surface Experiments Package, called ALSEP. They placed scientific equipment on the Moon so that observations could continue after their own surface work ended. The station belonged to the exploration of the Ocean of Storms.',
        'ALSEP was a collection of connected instruments, rather than one machine with a single task. A central station supported data and communications, while separate experiments examined different features of the lunar environment. Setting up that equipment turned a temporary visit into the beginning of a longer investigation carried out from the surface.',
      ], 'alsep12-deployment.jpg', ['apollo12', 'alsep12', 'alsepDesign']),
      chapter('Power, cables, and a path to Earth', 'THE EQUIPMENT WORKS TOGETHER', [
        'Cables connected the experiments with the central station, which relayed their observations toward Earth. Electricity came from a radioisotope thermoelectric generator, or RTG. It converted heat from radioactive decay into electrical power, giving the station a power design different from solar-powered spacecraft.',
        'One instrument was a passive seismometer. Passive described its role in detecting ground motion; its electronics still needed electricity. The complete array contained other experiments too. A compact illustration of the central station, RTG, and seismometer represents selected equipment, with simplified spacing and cables. The actual scientific station was spread across the surrounding lunar surface.',
      ], 'alsep12.jpg', ['alsep12', 'alsepDesign']),
      chapter('Small movements become a record', 'OBSERVING AFTER THE CREW DEPARTS', [
        'The passive seismic experiment measured vibrations in the lunar ground. Those motions became records that scientists could study, extending observation beyond what astronauts could learn during a short visit. Other instruments contributed measurements of the lunar environment, giving the station several scientific purposes.',
        'The central station helped those observations travel from the Moon to researchers on Earth. Meaning came from interpreting the measurements and comparing records, rather than from the appearance of the equipment alone. ALSEP’s contribution was the continuing connection between instruments left on the surface and people studying their results, even after the astronauts who installed them had returned home.',
      ], 'alsep12.jpg', ['alsep12', 'alsepDesign', 'apollo12']),
      chapter('A deliberate ending leaves the instruments behind', 'SEPTEMBER 30, 1977', [
        'Controllers deliberately ended ALSEP operations on September 30, 1977. A command from Earth brought the observing program to a close after years of surface science. Its instruments and communications had supported observations long after the astronauts who installed the station had returned home.',
        'The hardware remained on the Moon. Mission photographs show particular moments in its deployment and arrangement; an educational illustration does not reproduce every experiment or its exact separation. The station’s legacy lies in both the equipment and the scientific records it produced. Apollo 12 demonstrated how a brief human presence could establish an observing system that continued working after the footsteps stopped.',
      ], 'alsep12.jpg', ['alsepDesign', 'alsep12', 'apollo12']),
    ],
  },
  viking1: {
    tagline: 'A stationary laboratory brought the Martian ground into an experiment.',
    chapters: [
      chapter('A first successful foothold on Mars', 'CHRYSE PLANITIA · JULY 20, 1976', [
        'Viking 1’s lander touched down in Chryse Planitia on July 20, 1976. Its successful arrival brought cameras and a scientific laboratory onto the Martian surface. The photographs connected a distant planet with a landscape that researchers could now examine from the ground.',
        'The Viking project included separate landers and orbiters, and their roles should be distinguished. The lander was the machine standing among the rocks, equipped to investigate nearby material and conditions. It did not need wheels to carry out that assignment. A fixed platform could repeatedly observe its surroundings and supply a laboratory with samples from within its reach.',
      ], 'viking1-first-panorama.jpg', ['viking1', 'vikingDesign']),
      chapter('An arm brings Mars into the laboratory', 'SURFACE SAMPLING AND POWER', [
        'Viking’s surface sampler reached beyond the deck to gather nearby soil. Instruments could then investigate the collected material, while scanning cameras recorded the setting around the spacecraft. Weather sensors added observations of the conditions experienced at the landing site.',
        'Two radioisotope thermoelectric generators supplied electrical power using heat from radioactive decay. That system differed from solar arrays and supported the lander’s long surface mission. A sampler, cameras, laboratory equipment, and power supplies each performed a separate job. Their combination connected a physical place on Mars with measurements scientists could compare and interpret on Earth.',
      ], 'viking1-panorama.jpg', ['vikingDesign', 'viking1']),
      chapter('Important experiments require careful interpretation', 'INVESTIGATING SOIL AND POSSIBLE LIFE', [
        'Viking’s biological experiments investigated whether life could explain activity measured in Martian soil samples. The lander also studied chemistry, weather, and the surface around it. A laboratory result was valuable, but its meaning depended on the experiment and the explanations consistent with its measurements.',
        'The biological investigations did not establish that living organisms had been discovered. That limit is an important part of the scientific story, rather than a reason to erase the work. Viking created observations that researchers had to interpret carefully. Its legacy includes both a record of Mars and an example of why an interesting experimental response is not automatically proof of life.',
      ], 'viking1-panorama.jpg', ['vikingScience', 'viking1', 'vikingDesign']),
      chapter('The laboratory becomes a historical site', 'COMMUNICATION ENDS · NOVEMBER 1982', [
        'Communication with Viking 1’s lander ended in November 1982, after years of surface work. The spacecraft remained in Chryse Planitia. Its ending belongs to the surface lander’s history, which is separate from the mission of the orbiter that had accompanied it to Mars.',
        'The photographs and experimental results had already become an archive on Earth. They preserve a particular landscape and the scientific investigations made there. A generic engineering model represents the Viking lander design, not a scan of its current condition. The abandoned laboratory remains meaningful because its records continue to show what was measured and what those measurements could support.',
      ], 'viking1-first-panorama.jpg', ['viking1', 'vikingCoordinates', 'vikingScience']),
    ],
  },
  phoenix: {
    tagline: 'A scoop reached beneath a cold plain and found measurable evidence of ice.',
    chapters: [
      chapter('A landing in the Martian arctic', 'VASTITAS BOREALIS · MAY 25, 2008', [
        'Phoenix landed in the northern arctic plains of Mars on May 25, 2008. Its destination was a cold region where material beneath the surface could help scientists investigate water. The lander carried a robotic arm and small laboratories instead of wheels for a long journey.',
        'The ground immediately around the spacecraft became its field of study. A scoop could gather material, and instruments on the deck could examine selected samples. This approach linked careful excavation with laboratory measurements. The scene around Phoenix was therefore more than a landing place: it was the local environment from which a scientific investigation would obtain its evidence.',
      ], 'phoenix-panorama.jpg', ['phoenix', 'phoenixWater']),
      chapter('A small sample enters a heated experiment', 'THE ARM AND DECK LABORATORY', [
        'Phoenix’s robotic arm collected soil from beside the lander and delivered material to onboard instruments. One laboratory system, the Thermal and Evolved Gas Analyzer, heated samples in small ovens. Instruments examined gases released during heating, allowing researchers to investigate what the material contained.',
        'The scoop and the laboratory performed different parts of the process. Bright material seen in a trench could suggest an explanation, while a controlled test supplied another kind of evidence. The lander’s circular solar arrays provided electrical power for its working mission. Together, excavation, imaging, and analysis turned material hidden below the ground into observations that could reach Earth.',
      ], 'phoenix-panorama.jpg', ['phoenix', 'phoenixWater']),
      chapter('Ice appears in two kinds of evidence', 'TRENCH IMAGES AND SAMPLE TESTS · 2008', [
        'Phoenix photographed bright pieces in the Dodo-Goldilocks trench. Images taken four days apart showed some small pieces disappearing. The change supported their identification as ice that sublimated, meaning it changed directly from a solid into vapor rather than first forming liquid water.',
        'A separate laboratory result strengthened the investigation. On July 31, 2008, the team announced that heating a collected sample had released water, confirming water ice. The photographs and sample test were related evidence from different methods. Neither established that living organisms had been found, and neither required a river to be flowing beside the lander.',
      ], 'phoenix-ice-before.jpg', ['phoenixIce', 'phoenixWater'], {
        caption:'NASA/JPL-Caltech/University of Arizona/Texas A&M University · PIA10910 and PIA10911: Dodo-Goldilocks trench on sols 20 and 24 in 2008, photographed four days apart.',
        compareImages: [
          {image: 'phoenix-ice-before.jpg', label:'Sol 20 · Earlier', caption: captions['phoenix-ice-before.jpg']},
          {image: 'phoenix-ice-after.jpg', label:'Sol 24 · Four days later', caption: captions['phoenix-ice-after.jpg']},
        ],
      }),
      chapter('A short season leaves a lasting observation', 'FINAL COMMUNICATION · NOVEMBER 2, 2008', [
        'Phoenix’s final communication reached Earth on November 2, 2008. The lander stayed in the Martian arctic, while its pictures and measurements remained available to researchers. Its local excavation had produced evidence about water ice that could be studied far beyond the place where the scoop worked.',
        'The mission’s legacy includes the careful distinction between seeing a clue and testing a sample. Historical photographs preserve dated observations; an illustrative model explains the working design without reconstructing its exact present condition. A stationary machine had reached beneath the surface and connected hidden material with a measurable result, adding another piece to the scientific history of water on Mars.',
      ], 'phoenix-panorama.jpg', ['phoenix', 'phoenixWater', 'phoenixIce']),
    ],
  },
};
