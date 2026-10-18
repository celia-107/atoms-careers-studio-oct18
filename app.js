const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const demoVideo=document.getElementById('official-demo-video');
const demoPlay=document.getElementById('demo-play');
const demoStatus=document.getElementById('demo-status');
const filmToggle=document.getElementById('film-toggle');
const filmFullscreen=document.getElementById('film-fullscreen');
const filmDesktop=matchMedia('(min-width:1000px)');
let filmLoaded=false,filmInView=true,filmUserPaused=false;
function loadFilm(){if(!filmLoaded){demoVideo.src='assets/atoms-join-us.mp4';filmLoaded=true}}
function syncFilmControls(){const playing=!demoVideo.paused;filmToggle.textContent=playing?'暂停短片 Ⅱ':'播放短片 ▷';filmToggle.setAttribute('aria-label',playing?'暂停招聘短片':'播放招聘短片');filmToggle.setAttribute('aria-pressed',String(playing));demoPlay.hidden=playing||demoVideo.currentTime>0}
async function playFilm(user=false){if(user)filmUserPaused=false;loadFilm();demoStatus.textContent='';try{await demoVideo.play();syncFilmControls()}catch{demoPlay.hidden=false;demoStatus.textContent='点击播放短片';syncFilmControls()}}
demoPlay.addEventListener('click',()=>playFilm(true));filmToggle.addEventListener('click',()=>{if(demoVideo.paused)playFilm(true);else{filmUserPaused=true;demoVideo.pause()}});
filmFullscreen.addEventListener('click',async()=>{loadFilm();demoVideo.controls=true;try{if(demoVideo.requestFullscreen)await demoVideo.requestFullscreen();else if(demoVideo.webkitEnterFullscreen)demoVideo.webkitEnterFullscreen();else{demoStatus.textContent='请使用播放器的全屏按钮。';return}await playFilm(true)}catch{demoStatus.textContent='请使用播放器的全屏按钮。'}});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)demoVideo.controls=false});demoVideo.addEventListener('webkitendfullscreen',()=>{demoVideo.controls=false});
for(const event of ['playing','pause','ended'])demoVideo.addEventListener(event,syncFilmControls);
demoVideo.addEventListener('error',()=>{demoPlay.hidden=false;demoStatus.textContent='短片暂时未能加载，请点击重试。';filmLoaded=false});
function shouldAutoPlay(){return filmDesktop.matches&&!reduced.matches&&!navigator.connection?.saveData&&!filmUserPaused&&!document.hidden&&filmInView}
new IntersectionObserver(entries=>{filmInView=entries[0].isIntersecting;if(!filmInView)demoVideo.pause();else if(shouldAutoPlay())playFilm()},{threshold:.25}).observe(demoVideo);
document.addEventListener('visibilitychange',()=>{if(document.hidden)demoVideo.pause();else if(shouldAutoPlay())playFilm()});
reduced.addEventListener('change',()=>{if(reduced.matches)demoVideo.pause();else if(shouldAutoPlay())playFilm()});filmDesktop.addEventListener('change',()=>{if(!filmDesktop.matches)demoVideo.pause();else if(shouldAutoPlay())playFilm()});syncFilmControls();
const stages=[
{title:'先说清楚，要解决什么。',description:'明确用户、问题与验收标准。人作判断，AI 帮助整理信息，双方围绕一个可验证的目标开始工作。',human:'确定为谁解决什么问题，判断优先级，并定义怎样算做好。',ai:'辅助调研、归纳信息、拆解任务，列出需要核实的假设。',output:'明确的目标、约束与验收标准',example:'以本页为例：让候选人理解工作方式，并能找到合适方向。'},
{title:'把目标，做成可运行的版本。',description:'把 AI 用进研究、设计、代码与自动化。用能体验的版本讨论方案，由人解释并决定关键取舍。',human:'拆分任务、选择方案，检查关键设计与代码，对实现取舍负责。',ai:'辅助生成草稿、代码与测试，执行明确的任务，帮助快速形成原型。',output:'可运行、可体验的初版',example:'以本页为例：形成包含公司介绍、工作流程与方向筛选的招聘网页。'},
{title:'用真实证据，检查是否有效。',description:'可运行不等于有效。把结果与最初的标准对照，通过数据、实验、评测和用户反馈找出问题。',human:'复核事实与关键行为，体验真实场景，判断结果是否满足标准。',ai:'辅助检查、运行测试、归纳反馈，定位问题并提出修正方案。',output:'验证记录、问题清单与修正方案',example:'以本页为例：检查手机排版、筛选与弹窗，再通过候选人试读发现不清楚的表达。'},
{title:'交付之后，继续对结果负责。',description:'把验证过的结果交给真实用户，在使用中迭代。有效方法进一步沉淀为工具、Workflow、Skill 或 SOP。',human:'确认交付、跟进使用反馈，决定下一轮改进与优先级。',ai:'辅助整理变更、分析反馈，把重复工作沉淀为可复用流程。',output:'可使用的成果，以及下一轮改进计划',example:'以本页为例：交付可访问的招聘页面，持续维护岗位、申请入口与内容。'}
];
let stage=0;const tabs=[...document.querySelectorAll('.step')];
function setStage(i,focus=false){stage=i;tabs.forEach((b,n)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-selected',String(i===n));b.tabIndex=i===n?0:-1});const s=stages[i];for(const [id,key] of [['work-title','title'],['work-description','description'],['human-task','human'],['ai-task','ai'],['stage-output','output'],['work-example','example']])document.getElementById(id).textContent=s[key];document.getElementById('step-count').textContent=`第 ${i+1} 步 / 共 4 步`;const panel=document.getElementById('work-panel');panel.setAttribute('aria-labelledby',`step-${i}`);panel.classList.remove('panel-enter');void panel.offsetWidth;panel.classList.add('panel-enter');if(focus)tabs[i].focus()}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>setStage(i));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%4;else if(e.key==='ArrowLeft')n=(i+3)%4;else if(e.key==='Home')n=0;else if(e.key==='End')n=3;else return;e.preventDefault();setStage(n,true)})});document.querySelector('#next-step').addEventListener('click',()=>setStage((stage+1)%4));
const dialog=document.querySelector('#direction-dialog');
let jobData=[],jobPage=0;const jobPageSize=4;
const jobControls=['job-search','job-city','job-type','job-category'].map(id=>document.getElementById(id));
function matchingJobs(){const [q,city,type,category]=jobControls.map(e=>e.value);return jobData.filter(j=>(!q||[j.title,j.description,j.requirements].join(' ').toLowerCase().includes(q.trim().toLowerCase()))&&(city==='all'||j.cities.includes(city))&&(type==='all'||j.recruitmentType===type)&&(category==='all'||j.category===category))}
function showJob(j){document.getElementById('dialog-title').textContent=j.title;document.getElementById('job-detail-meta').textContent=[j.cities.join(' / '),j.recruitmentType,j.employmentType,j.category].filter(Boolean).join(' · ');document.getElementById('dialog-description').textContent=j.description||'职位描述请以飞书招聘中的最新说明为准。';document.getElementById('job-requirements').textContent=j.requirements||'';document.getElementById('job-requirements').hidden=!j.requirements;document.getElementById('job-requirements-heading').hidden=!j.requirements;const area=document.getElementById('job-apply-area');area.replaceChildren();if(j.applyUrl){const a=document.createElement('a');a.className='button';a.textContent='前往飞书查看并投递 ↗';a.href=j.applyUrl;a.target='_blank';a.rel='noopener';area.append(a)}else{const note=document.createElement('p');note.className='job-unpublished';note.textContent='职位开放中，公开投递入口尚未上线。';area.append(note)}dialog.showModal()}
function renderJobs(){const jobs=matchingJobs(),pages=Math.max(1,Math.ceil(jobs.length/jobPageSize));jobPage=Math.min(jobPage,pages-1);document.getElementById('job-count').textContent=`${jobs.length} 个开放职位`;const list=document.getElementById('jobs-list');list.replaceChildren();for(const j of jobs.slice(jobPage*jobPageSize,(jobPage+1)*jobPageSize)){const row=document.createElement('button');row.className='job-row';const copy=document.createElement('span'),title=document.createElement('strong'),meta=document.createElement('small'),state=document.createElement('span');title.textContent=j.title;meta.textContent=[j.cities.join(' / '),j.recruitmentType,j.employmentType,j.category].filter(Boolean).join(' · ');copy.append(title,meta);state.className='job-row-action';state.textContent=j.applyUrl?'查看并投递 ↗':'查看详情 ↗';row.append(copy,state);row.addEventListener('click',()=>showJob(j));list.append(row)}if(!jobs.length){const empty=document.createElement('p');empty.className='jobs-empty';empty.textContent='没有符合条件的职位，试试其他关键词或筛选条件。';list.append(empty)}document.getElementById('jobs-page-label').textContent=`第 ${jobPage+1} / ${pages} 页`;document.getElementById('jobs-prev').disabled=jobPage===0;document.getElementById('jobs-next').disabled=jobPage===pages-1}
jobControls.forEach(e=>e.addEventListener(e.tagName==='INPUT'?'input':'change',()=>{jobPage=0;renderJobs()}));document.getElementById('jobs-prev').addEventListener('click',()=>{jobPage--;renderJobs()});document.getElementById('jobs-next').addEventListener('click',()=>{jobPage++;renderJobs()});
fetch('data/jobs.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('加载失败');return r.json()}).then(data=>{jobData=data.jobs;for(const c of [...new Set(jobData.map(j=>j.category))].filter(Boolean)){const option=document.createElement('option');option.value=c;option.textContent=c;document.getElementById('job-category').append(option)}document.getElementById('jobs-sync-note').textContent=`核对于 ${data.verifiedAt} · 本次快照，尚未自动同步；部分内部开放职位的公开投递入口待上线。`;renderJobs()}).catch(()=>{document.getElementById('job-count').textContent='职位暂时加载失败，请前往飞书查看最新职位。'});
document.querySelector('#source-open').addEventListener('click',()=>document.querySelector('#source-dialog').showModal());document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
const chapterObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('chapter-visible');chapterObserver.unobserve(entry.target)}})},{threshold:0,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.section,.chapter-transition,.closing').forEach(el=>chapterObserver.observe(el));
const navLinks=[...document.querySelectorAll('.header nav a')];
const sectionObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){navLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}}},{rootMargin:'-15% 0px -55% 0px'});
navLinks.forEach(link=>{const section=document.querySelector(link.hash);if(section)sectionObserver.observe(section)});

// Scroll snapping stays native: trackpad, keyboard and scrollbar remain usable.
const screenPanels=[...document.querySelectorAll('main>.hero,main>.section,main>.closing')];
const currentScreenObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>.55){screenPanels.forEach(panel=>panel.classList.toggle('is-current',panel===entry.target));if(entry.target.id==='intro')navLinks.forEach(link=>link.removeAttribute('aria-current'))}}},{threshold:[.55,.75]});
screenPanels.forEach(panel=>currentScreenObserver.observe(panel));

// The glyph stays fixed; only the ink grain changes inside its contour.
const noiseField=document.getElementById('type-noise-field');
const visibleNoiseTitles=new Set();let noiseTimer=0,noiseSeed=11;
function updateTypeNoise(){clearInterval(noiseTimer);noiseTimer=0;if(!reduced.matches&&!document.hidden&&visibleNoiseTitles.size){noiseTimer=setInterval(()=>{noiseSeed=noiseSeed%97+1;noiseField.setAttribute('seed',String(noiseSeed))},160)}}
const noiseObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)visibleNoiseTitles.add(entry.target);else visibleNoiseTitles.delete(entry.target)}updateTypeNoise()},{threshold:0});
document.querySelectorAll('.noise-title').forEach(title=>noiseObserver.observe(title));document.addEventListener('visibilitychange',updateTypeNoise);reduced.addEventListener('change',updateTypeNoise);

// Accessible timeline: switching stages never moves the page scroll position.
const journeyTabs=[...document.querySelectorAll('[data-journey]')];
function showJourney(index,focus=false){journeyTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;document.getElementById(`journey-panel-${i}`).hidden=i!==index});if(focus)journeyTabs[index].focus()}
journeyTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>showJourney(index));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%journeyTabs.length;else if(event.key==='ArrowLeft')next=(index+journeyTabs.length-1)%journeyTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=journeyTabs.length-1;else return;event.preventDefault();showJourney(next,true)})});
