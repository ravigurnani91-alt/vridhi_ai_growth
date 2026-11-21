(() => {
const calculators = [
{id:1,name:'Distance converter',desc:'Kilometres ↔ miles',fields:[['value','Distance','number',10]],run:v=>v.value*1.609344,format:(v,x)=>x.value+' '+(x.value?'km':'')+' = '+(v/1.609344).toFixed(2)+' miles',hint:'Enter kilometres to convert to miles.'},
{id:2,name:'Temperature converter',desc:'Celsius ↔ Fahrenheit',fields:[['value','Temperature (°C)','number',25]],run:v=>v.value*9/5+32,format:v=>v.toFixed(1)+' °F',hint:'Convert Celsius to Fahrenheit.'},
{id:3,name:'Percentage finder',desc:'Find a percentage of any amount',fields:[['amount','Amount','number',2500],['percent','Percentage (%)','number',18]],run:v=>v.amount*v.percent/100,format:v=>'Result: '+v.toLocaleString('en-IN',{maximumFractionDigits:2}),hint:'Useful for discounts, tax and quick comparisons.'},
{id:4,name:'Monthly loan estimate',desc:'A simple EMI estimate',fields:[['principal','Loan amount (₹)','number',500000],['rate','Annual interest (%)','number',9],['months','Months','number',60]],run:v=>{const r=v.rate/1200;return r===0?v.principal/v.months:v.principal*r*Math.pow(1+r,v.months)/(Math.pow(1+r,v.months)-1)},format:v=>'Estimated EMI: ₹'+v.toLocaleString('en-IN',{maximumFractionDigits:0}),hint:'Illustrative estimate only; lender fees and terms vary.'},
{id:5,name:'Compound growth',desc:'See how savings can grow',fields:[['principal','Starting amount (₹)','number',50000],['rate','Annual return (%)','number',8],['years','Years','number',10]],run:v=>v.principal*Math.pow(1+v.rate/100,v.years),format:v=>'Future value: ₹'+v.toLocaleString('en-IN',{maximumFractionDigits:0}),hint:'Assumes a constant annual rate; returns are not guaranteed.'},
{id:6,name:'Water tank volume',desc:'Estimate a rectangular tank',fields:[['length','Length (m)','number',2],['width','Width (m)','number',1.5],['height','Water depth (m)','number',1.2]],run:v=>v.length*v.width*v.height*1000,format:v=>Math.round(v).toLocaleString('en-IN')+' litres',hint:'Length × width × water depth × 1,000.'},
{id:7,name:'Rainwater harvest estimate',desc:'Roof area × rainfall × runoff factor',fields:[['area','Roof area (m²)','number',100],['rain','Rainfall (mm)','number',600],['factor','Runoff factor (0–1)','number',0.8]],run:v=>v.area*v.rain*v.factor,format:v=>Math.round(v).toLocaleString('en-IN')+' litres (approx.)',hint:'A planning estimate; actual capture depends on roof and losses.'},
{id:8,name:'Electricity cost',desc:'Estimate monthly energy cost',fields:[['units','Units used (kWh)','number',250],['tariff','Rate per unit (₹)','number',7]],run:v=>v.units*v.tariff,format:v=>'₹'+v.toLocaleString('en-IN',{maximumFractionDigits:2}),hint:'Excludes fixed charges, taxes and slab-based billing.'},
{id:9,name:'Reading time estimator',desc:'How long will this article take?',fields:[['words','Word count','number',1200],['speed','Reading speed (words/min)','number',220]],run:v=>v.words/v.speed,format:v=>Math.max(1,Math.ceil(v))+' minutes',hint:'A rough estimate; technical material may take longer.'},
{id:10,name:'Age in days',desc:'Approximate days lived',fields:[['years','Age (years)','number',30],['days','Extra days','number',0]],run:v=>v.years*365.2425+v.days,format:v=>Math.round(v).toLocaleString('en-IN')+' days',hint:'Approximate calculation using an average year length.'}
];
const cg=document.getElementById('calculator-grid');
calculators.forEach(c=>{const el=document.createElement('article');el.className='calculator-widget';el.innerHTML='<div class="calc-top"><span>TOOL '+String(c.id).padStart(3,'0')+'</span><span>QUICK CALC</span></div><h3>'+c.name+'</h3><p>'+c.desc+'</p><div class="calc-fields"></div><button class="calc-run" type="button">CALCULATE ↗</button><output class="calc-output">'+c.hint+'</output>';const fields=el.querySelector('.calc-fields');c.fields.forEach(([id,label,type,value])=>{const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('input');input.type=type;input.id='calc-'+c.id+'-'+id;input.value=value;input.step='any';input.min='0';wrap.appendChild(input);fields.appendChild(wrap)});el.querySelector('button').addEventListener('click',()=>{const values={};c.fields.forEach(([id])=>values[id]=Number(el.querySelector('#calc-'+c.id+'-'+id).value));if(Object.values(values).some(n=>!Number.isFinite(n)||n<0)||(values.months!==undefined&&values.months===0)||(values.speed!==undefined&&values.speed===0)){el.querySelector('output').textContent='Please enter valid positive values.';return}const result=c.run(values);el.querySelector('output').textContent=c.format(result,values)});cg.appendChild(el)});
const groups = [
['Earth & nature',[
['Why can lakes turn green?','What can cause a lake to change colour?','Nutrients, warm conditions and sunlight can help algae or cyanobacteria multiply. Colour alone cannot identify a bloom or establish whether water is safe.'],
['Where does rain go after it hits a city?','What happens to rain on roads and rooftops?','Some runs into drains, some evaporates, and some infiltrates soil. Hard surfaces can reduce infiltration and increase rapid runoff.'],
['What makes soil fertile?','Is dark soil always more fertile?','Fertility depends on nutrients, organic matter, structure, water, organisms and pH. Colour is only one clue.'],
['Why are wetlands called natural sponges?','How can a wetland reduce flood impacts?','Wetlands can store and slowly release water, trap sediment and support biodiversity. Their performance depends on condition and landscape context.'],
['What is an urban heat island?','Why can a city stay warmer than nearby rural areas?','Buildings and roads absorb and release heat; limited shade and vegetation can intensify the effect, especially at night.'],
['How do forests influence rainfall?','Do trees create rain?','Forests release water vapour through evapotranspiration and can influence local moisture and climate, but rainfall patterns have many drivers.'],
['What is groundwater recharge?','How does rain refill an aquifer?','Water moves through soil and rock into saturated underground formations. Recharge varies with geology, land cover and rainfall intensity.'],
['Why does biodiversity matter in a city?','Are urban birds and insects important?','Urban species contribute to pollination, pest control, seed dispersal and ecological resilience. Habitat quality matters.'],
['What is a watershed?','Why does a ridge matter to a lake?','A watershed is the land area draining to a common outlet. Activities upstream can affect water quantity and quality downstream.'],
['Can waste become a resource?','When does recycling actually work?','Material recovery needs sorting, clean streams, viable processing and markets. Poor segregation can reduce quality and raise costs.']]],
['Science',[
['Why is the sky blue?','Why does daylight look blue?','Air molecules scatter shorter blue wavelengths more strongly than longer red wavelengths. The effect changes near sunrise and sunset.'],
['How do vaccines train immunity?','What is the immune system learning?','Vaccines expose the immune system to a harmless form or component of a pathogen so it can build a targeted response and memory.'],
['Why does metal feel colder than wood?','Are both materials the same temperature?','Often yes. Metal conducts heat away from your skin faster, making it feel colder at the same room temperature.'],
['What makes a rainbow?','Why is a rainbow curved?','Sunlight is refracted, reflected and dispersed inside water droplets. The viewing geometry creates an arc.'],
['How do satellites stay in orbit?','Why do they not simply fall down?','Satellites are continuously falling toward Earth while moving sideways fast enough to keep missing the surface.'],
['What is DNA?','Why is DNA compared with an instruction book?','DNA stores hereditary information in sequences of chemical bases. Cells use this information through complex regulatory processes.'],
['Why do earthquakes happen?','What moves beneath the ground?','Stress builds along faults as tectonic plates move. Sudden slip releases energy that travels as seismic waves.'],
['How does a solar panel make electricity?','What happens when sunlight hits a cell?','Photovoltaic cells convert light into electrical energy through semiconductor materials and an internal electric field.'],
['What is a black hole?','Can light escape a black hole?','A black hole is a region where gravity is so strong that beyond its event horizon, light cannot escape to distant observers.'],
['Why do we dream?','Does science know exactly why we dream?','Dreaming is linked to sleep and brain activity. Researchers study memory, emotion and cognition, but no single explanation covers every dream.']]],
['History',[
['How did ancient cities get clean water?','Were old water systems sophisticated?','Many cities built wells, reservoirs, aqueducts, stepwells and drainage systems adapted to local terrain and materials.'],
['What makes an archaeological site reliable evidence?','Can one object rewrite history?','Archaeologists interpret objects in context: location, dating, layers, associated materials and independent evidence all matter.'],
['Why did ancient trade routes matter?','Did trade move only goods?','Trade routes also moved languages, technologies, beliefs, art styles, diseases and ideas across regions.'],
['What is a UNESCO World Heritage Site?','Who recognises places of outstanding value?','UNESCO's World Heritage system recognises cultural and natural sites considered to have outstanding universal value under defined criteria.'],
['How were calendars invented?','Why did societies track the sky?','Calendars helped coordinate agriculture, ritual, taxation and civic life by observing lunar, solar and seasonal cycles.'],
['Why were stepwells built?','Were stepwells only water sources?','Stepwells stored and accessed water seasonally and often served as social, architectural and sometimes religious spaces.'],
['How do historians date old objects?','What is radiocarbon dating used for?','Radiocarbon dating estimates the age of once-living material within a useful time range; other methods date rocks, layers and structures.'],
['What is oral history?','Can memory be a historical source?','Oral histories preserve lived experience and community memory. They are strongest when documented carefully and compared with other evidence.'],
['Why do empires build roads?','What did roads make possible?','Road networks supported administration, trade, military movement, communication and cultural exchange.'],
['How do languages change?','Why do accents and words travel?','Migration, trade, contact, technology and social identity all influence how languages evolve over time.']]],
['World & society',[
['Why do cities grow?','What pulls people toward urban areas?','Jobs, education, services, infrastructure and family networks can attract people, while housing and transport shape where growth occurs.'],
['What is a demographic dividend?','When can a young population boost growth?','A large working-age population can support growth when education, health, jobs and institutions allow people to participate productively.'],
['How does inflation affect a household?','Why can the same salary buy less?','When the general price level rises, purchasing power falls unless income keeps pace. Different households face different inflation baskets.'],
['What is a supply chain?','How does a product reach a shop?','A supply chain connects raw materials, suppliers, factories, logistics, distributors and retailers. Disruptions can ripple across the network.'],
['Why do countries trade?','What is comparative advantage?','Trade can allow countries to specialise where their opportunity costs are lower and exchange for other goods and services.'],
['What makes a city resilient?','Can a city prepare for shocks?','Resilience depends on infrastructure, institutions, social networks, ecosystems, planning and the ability to learn after disruption.'],
['What is migration?','Why do people move?','People move for work, education, safety, family, climate and opportunity. Decisions often combine several pressures and hopes.'],
['How do public budgets work?','Where does government spending come from?','Budgets set out expected revenue and spending priorities. Actual outcomes depend on implementation, oversight and economic conditions.'],
['What is a census?','Why count a population?','A census provides structured population information used for planning, representation and public services, subject to methods and coverage.'],
['What is a circular economy?','How is it different from take-make-waste?','A circular economy aims to reduce waste by designing for durability, repair, reuse, remanufacture and material recovery.']]],
['Technology',[
['What is generative AI?','How can AI create text and images?','Generative models learn patterns from training data and produce new outputs from prompts. Their fluency does not guarantee factual accuracy.'],
['What is an API?','How do two apps talk to each other?','An application programming interface defines how software systems request and exchange data or actions.'],
['What is cloud computing?','Where does an online file live?','Cloud services run on remote infrastructure in data centres, accessed over networks and managed by providers.'],
['What is a deepfake?','Why can synthetic media be convincing?','AI tools can generate or alter audio, images and video. Provenance, context and independent verification help assess authenticity.'],
['How does GPS locate a phone?','Why does a device need satellites?','A receiver estimates its position using timing signals from multiple navigation satellites, with corrections and other sensors improving accuracy.'],
['What is two-factor authentication?','Why use more than a password?','A second factor adds another proof of identity, reducing the risk that a stolen password alone grants access.'],
['What is open-source software?','Can anyone inspect the code?','Open-source licences allow people to use, inspect, modify and share software under stated conditions.'],
['How does a search engine rank pages?','Why are results not simply alphabetical?','Search systems use many signals to estimate relevance and quality; exact ranking systems are complex and change over time.'],
['What is edge computing?','Why process data near a device?','Edge computing moves some processing closer to where data is created, which can reduce latency and network use.'],
['What is a data centre?','Why do data centres need so much cooling?','Servers produce heat while processing and storing data. Cooling, power management and efficient design are central operational concerns.']]],
['Business & money',[
['What is compound interest?','Why does time matter so much?','Interest can earn further interest when returns remain invested. The effect depends on rate, time, fees and risk.'],
['What is cash flow?','Can a profitable business run out of cash?','Yes. Profit and cash timing differ; delayed collections, inventory and debt payments can create liquidity pressure.'],
['What is a balance sheet?','What does it tell an investor?','A balance sheet reports assets, liabilities and equity at a point in time, offering a snapshot of financial position.'],
['What is customer acquisition cost?','How much does winning a customer cost?','CAC estimates sales and marketing cost per acquired customer. Its usefulness depends on consistent definitions and attribution.'],
['What is a monopoly?','Why can one seller have market power?','A monopoly exists when one supplier dominates a market without close substitutes; regulation and competition policy address potential harms.'],
['What is a credit score?','Why do lenders check credit history?','Credit scores summarise aspects of borrowing history. Models differ, and a score is only one input in lending decisions.'],
['What is a recession?','Does every slowdown count?','A recession is a broad decline in economic activity. Definitions and official dating methods vary across countries.'],
['What is an exchange rate?','Why does currency value move?','Exchange rates respond to trade, capital flows, interest rates, expectations, policy and market conditions.'],
['What is a startup runway?','How long can a startup keep operating?','Runway estimates how long available cash lasts at a given net burn rate. It changes with revenue and spending.'],
['What is diversification?','Why not put all investments in one place?','Diversification spreads exposure across assets or sectors to reduce concentration risk, but it cannot eliminate market risk.']]],
['Culture & mythology',[
['What is folklore?','Are folklore stories historical records?','Folklore carries community stories, beliefs and customs. It can reveal cultural values, but a legend is not automatically a verified event.'],
['Why do cultures tell creation stories?','What questions do origin myths address?','Origin stories can express identity, moral order, relationships with nature and explanations of the world.'],
['What is intangible cultural heritage?','Can a tradition be heritage?','Practices, skills, performances and knowledge passed between generations can be recognised as intangible cultural heritage.'],
['Why do festivals follow lunar calendars?','Why do dates shift each year?','Lunar and lunisolar calendars track moon cycles, sometimes adjusting to remain aligned with seasons.'],
['What is a pilgrimage?','Why do people travel to sacred places?','Pilgrimage can express devotion, identity, community, memory and personal transformation across many religious traditions.'],
['How do myths travel between cultures?','Can stories share similar motifs?','Trade, migration, translation and cultural contact can move motifs and narratives, while local traditions reshape them.'],
['What is an epic?','Why do long stories shape identity?','Epics preserve narratives about heroes, conflict, values and origins, often through changing oral and written traditions.'],
['Why do old buildings become symbols?','How does architecture hold memory?','Buildings can represent power, belief, collective memory and local identity, beyond their original function.'],
['What is a language family?','How are related languages identified?','Linguists compare systematic sound and vocabulary patterns to infer shared ancestry, not just surface resemblance.'],
['Why do ghost stories persist?','What can a haunted-place story tell us?','Such stories may reflect memory, fear, local identity and social change. Their cultural meaning is separate from proof of paranormal claims.']]],
['Places & travel',[
['What makes a dark-sky destination?','Why are some places good for stargazing?','Low light pollution, clear skies, altitude and weather can improve night-sky visibility.'],
['What is a ghost town?','Why do settlements become empty?','Economic change, resource depletion, conflict, disasters and transport shifts can contribute to settlement decline.'],
['How do mountain passes shape history?','Why do routes cross high terrain?','Passes can connect trade and migration corridors, but weather, elevation and geopolitics shape their use.'],
['What is a UNESCO geopark?','Can geology attract visitors?','UNESCO Global Geoparks connect geological heritage with education, conservation and sustainable local development.'],
['Why are desert nights cold?','How can temperature change so quickly?','Dry air and limited cloud cover allow heat to escape rapidly after sunset, though local conditions vary.'],
['What is ecotourism?','When can tourism support conservation?','Well-managed nature tourism can create local income and conservation incentives, but poor management can damage habitats.'],
['How do old ports shape cities?','Why do waterfronts become busy districts?','Ports connect trade, migration and industry; their legacy often shapes urban form, jobs and culture.'],
['What is a living heritage city?','Can a city itself be heritage?','Historic urban areas can preserve architecture, crafts, rituals and living communities while continuing to change.'],
['Why do islands have unique wildlife?','What is island endemism?','Isolation can lead species to evolve separately, producing distinctive biodiversity that may be vulnerable to introduced species.'],
['How do maps distort the world?','Why is Greenland huge on some maps?','Flat map projections distort area, shape, distance or direction because a curved Earth cannot be flattened without trade-offs.']]],
['Everyday life',[
['Why does bread rise?','What makes dough expand?','Yeast or chemical leaveners produce gas that gets trapped in dough, creating a lighter texture during baking.'],
['How does a refrigerator keep food cold?','Where does the heat go?','A refrigeration cycle moves heat from inside the cabinet to the surrounding room using a refrigerant and compressor.'],
['Why do onions make us cry?','What happens when an onion is cut?','Cut cells release compounds that form an irritating volatile substance, which reacts with moisture in the eyes.'],
['What does SPF mean?','Does SPF 50 mean twice the protection of SPF 25?','SPF measures protection against UVB-related sunburn under test conditions. Correct amount and reapplication matter; no sunscreen blocks all UV.'],
['Why does soap remove grease?','How can water wash away oil?','Soap molecules have water-attracting and oil-attracting ends, helping form structures that lift oily material into water.'],
['How does noise affect concentration?','Why is background sound distracting?','Effects depend on task, sound type, volume and individual differences. Speech can be especially distracting for language tasks.'],
['Why do batteries lose charge?','What changes inside a battery?','Chemical reactions provide electrical energy; ageing, temperature and use can reduce capacity over time.'],
['How does a pressure cooker cook faster?','Why does pressure change boiling?','Higher pressure raises water's boiling point, allowing food to cook at a higher temperature.'],
['Why do we get jet lag?','What is the body clock adjusting to?','Rapid travel across time zones misaligns circadian rhythms with local light-dark cycles, sleep and meal times.'],
['What makes a password strong?','Is a complicated short password best?','Long, unique passwords or passphrases stored in a password manager are generally safer than short reused passwords.']]]
];
const list=document.getElementById('curiosity-grid-list');let all=[];
groups.forEach(([category,items])=>items.forEach((item,i)=>all.push({category,title:item[0],question:item[1],answer:item[2]})));
all.forEach((w,i)=>{const card=document.createElement('article');card.className='curiosity-widget';card.dataset.category=w.category;card.dataset.search=(w.title+' '+w.question+' '+w.category).toLowerCase();card.innerHTML='<div class="curiosity-card-top"><span>'+String(i+11).padStart(3,'0')+' / '+w.category.toUpperCase()+'</span><span>✦</span></div><h3></h3><p class="curiosity-question"></p><button type="button" aria-expanded="false">UNLOCK THE IDEA +</button><p class="curiosity-answer" hidden></p>';card.querySelector('h3').textContent=w.title;card.querySelector('.curiosity-question').textContent=w.question;card.querySelector('.curiosity-answer').textContent=w.answer;card.querySelector('button').addEventListener('click',()=>{const answer=card.querySelector('.curiosity-answer');const open=answer.hidden;answer.hidden=!open;card.querySelector('button').setAttribute('aria-expanded',String(open));card.querySelector('button').textContent=open?'CLOSE THE IDEA −':'UNLOCK THE IDEA +';card.classList.toggle('is-open',open)});list.appendChild(card)});
const search=document.getElementById('widget-search'),category=document.getElementById('widget-category'),count=document.getElementById('widget-result-count');
function filter(){let n=0;list.querySelectorAll('.curiosity-widget').forEach(card=>{const ok=card.dataset.search.includes(search.value.toLowerCase())&&(category.value==='all'||card.dataset.category===category.value);card.hidden=!ok;if(ok)n++});count.textContent=n+' of 90 discoveries'}
search.addEventListener('input',filter);category.addEventListener('change',filter);
document.getElementById('surprise-widget').addEventListener('click',()=>{const visible=[...list.querySelectorAll('.curiosity-widget:not([hidden])')];if(!visible.length)return;const pick=visible[Math.floor(Math.random()*visible.length)];pick.scrollIntoView({behavior:'smooth',block:'center'});pick.classList.add('surprise-highlight');setTimeout(()=>pick.classList.remove('surprise-highlight'),1600);const answer=pick.querySelector('.curiosity-answer');answer.hidden=false;pick.querySelector('button').textContent='CLOSE THE IDEA −';pick.querySelector('button').setAttribute('aria-expanded','true');pick.classList.add('is-open')});
})();
