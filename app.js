(() => {
"use strict";
const config=window.PORTFOLIO_CONFIG||{}, projects=window.PROJECTS||[];
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
let paused=reduced.matches;
const motion=document.getElementById("motion-toggle");
function setMotion(value){paused=value;document.documentElement.classList.toggle("motion-paused",paused);if(motion){motion.textContent=paused?"Attiva movimento":"Pausa movimento";motion.setAttribute("aria-pressed",String(paused));}}
setMotion(paused);motion?.addEventListener("click",()=>setMotion(!paused));reduced.addEventListener("change",e=>setMotion(e.matches));

const dialog=document.getElementById("project-dialog");let current=0,opener=null;
function openProject(id){const i=projects.findIndex(p=>p.id===id);if(i<0)return;current=i;const p=projects[i];opener=document.activeElement;
dialog.style.setProperty("--project-color",p.color);document.getElementById("project-title").textContent=p.title;document.getElementById("project-category").textContent=p.category;const projectIcon=document.getElementById("project-icon");projectIcon.src=p.icon||"assets/portfolio-icon.png";projectIcon.alt=`Icona ${p.title}`;document.getElementById("project-intro").textContent=p.intro;
const detail=document.getElementById("project-detail");detail.replaceChildren();
p.sections.forEach(([heading,copy])=>{const section=document.createElement("section");section.className="detail-block";const h=document.createElement("h3");h.textContent=heading;const text=document.createElement("p");text.textContent=copy;section.append(h,text);detail.append(section);});
const links=document.getElementById("project-links");links.replaceChildren();p.links.forEach(item=>{const a=document.createElement("a");a.href=item.url;if(item.cover){a.className="project-dialog-cover essay-cover-link";a.target="_blank";a.rel="noopener";a.setAttribute("aria-label","Apri il PDF H-AI");const image=document.createElement("img");image.src="assets/h-ai-cover.png";image.alt="Copertina del saggio H-AI";a.append(image);}else{a.className="button primary";a.textContent=item.label;if(item.download)a.download="H-AI-Gabriele-Corso.pdf";else{a.target="_blank";a.rel="noopener";}}links.append(a);});
if(!dialog.open)dialog.showModal();document.body.classList.add("dialog-open");dialog.scrollTop=0;
}
function closeProject(){if(dialog.open)dialog.close();document.body.classList.remove("dialog-open");if(location.hash.startsWith("#progetto/"))history.replaceState(null,"",location.pathname+location.search+"#progetti");opener?.focus?.({preventScroll:true});}
if(dialog){document.getElementById("close-project").addEventListener("click",closeProject);dialog.addEventListener("cancel",e=>{e.preventDefault();closeProject();});dialog.addEventListener("click",e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeProject();}});
document.getElementById("next-project").addEventListener("click",()=>{location.hash="progetto/"+projects[(current+1)%projects.length].id;});
document.getElementById("project-contact").addEventListener("click",()=>{closeProject();});
document.querySelectorAll('a[href^="#progetto/"]').forEach(a=>a.addEventListener("click",()=>{if(location.hash===a.hash)openProject(a.hash.slice(10));}));
function route(){if(location.hash.startsWith("#progetto/"))openProject(location.hash.slice(10));else if(dialog.open)closeProject();}
addEventListener("hashchange",route);route();}

function revealSection(id){const section=document.getElementById(id),disclosure=section?.querySelector(":scope > details");if(disclosure)disclosure.open=true;}
document.querySelectorAll('a[href="#progetti"],a[href="#h-ai-saggio"]').forEach(a=>a.addEventListener("click",()=>revealSection(a.hash.slice(1))));revealSection(location.hash.slice(1));

const email=String(config.email||"").trim(),whatsapp=String(config.whatsapp||"").replace(/\D/g,""),phone=String(config.phone||"").replace(/\D/g,"");
document.querySelectorAll(".contact-email").forEach(button=>{if(!email){button.disabled=true;button.setAttribute("aria-label","Email in aggiornamento");}});
document.querySelectorAll(".contact-wa").forEach(a=>{if(whatsapp){a.href="https://wa.me/"+whatsapp;a.target="_blank";a.rel="noopener";}else{a.setAttribute("aria-disabled","true");a.removeAttribute("href");a.textContent="WhatsApp · in aggiornamento";}});
document.querySelectorAll(".contact-phone").forEach(a=>{if(phone){a.href="tel:+39"+phone;}else{a.setAttribute("aria-disabled","true");a.removeAttribute("href");a.textContent="Chiama · in aggiornamento";}});
const status=document.getElementById("contact-status");if(status&&!email&&!whatsapp)status.textContent="Recapiti in aggiornamento. Il profilo GitHub è disponibile in fondo alla pagina.";
function message(){const identity=document.getElementById("identity")?.value.trim(),sector=document.getElementById("sector")?.value.trim(),solution=document.getElementById("solution")?.value.trim(),problem=document.getElementById("problem")?.value.trim();const details=[identity&&"Profilo: "+identity,sector&&"Settore: "+sector,solution&&"Soluzione cercata: "+solution,problem&&"Dettagli: "+problem].filter(Boolean);return "Buongiorno Gabriele,\n\n"+(details.join("\n\n")||"Vorrei confrontarmi su una possibile collaborazione.")+"\n\nMessaggio dal portfolio.";}
const emailProvider=document.getElementById("email-provider-dialog"),formStatus=document.getElementById("form-status");let pendingEmailBody="";
function closeEmailProvider(){if(emailProvider?.open)emailProvider.close();}
function openEmailProvider(body){if(!email){if(formStatus)formStatus.textContent="Questo recapito è in aggiornamento.";return;}pendingEmailBody=body||message();emailProvider?.showModal();}
function providerUrl(provider){const subject=encodeURIComponent("Un’idea da discutere"),body=encodeURIComponent(pendingEmailBody),to=encodeURIComponent(email);if(provider==="gmail")return "https://mail.google.com/mail/?view=cm&fs=1&to="+to+"&su="+subject+"&body="+body;if(provider==="outlook")return "https://outlook.live.com/mail/0/deeplink/compose?to="+to+"&subject="+subject+"&body="+body;if(provider==="yahoo")return "https://compose.mail.yahoo.com/?to="+to+"&subject="+subject+"&body="+body;if(provider==="proton")return "https://mail.proton.me/u/0/inbox?compose=new&to="+to+"&subject="+subject+"&body="+body;return "mailto:"+email+"?subject="+subject+"&body="+body;}
function launchEmail(provider){const url=providerUrl(provider);if(provider==="default")location.href=url;else window.open(url,"_blank","noopener");closeEmailProvider();if(formStatus)formStatus.textContent="Il messaggio è pronto nel servizio scelto. L’invio resta a tua scelta.";}
function contact(channel){const output=document.getElementById("form-status");if(channel==="email"){openEmailProvider(message());return;}if(!whatsapp){if(output)output.textContent="Questo recapito è in aggiornamento.";return;}const text=encodeURIComponent(message());window.open("https://wa.me/"+whatsapp+"?text="+text,"_blank","noopener");if(output)output.textContent="Il messaggio è pronto nell’app scelta. L’invio resta a tua scelta.";}
document.querySelectorAll(".contact-email").forEach(button=>button.addEventListener("click",()=>openEmailProvider(message())));document.getElementById("contact-form")?.addEventListener("submit",e=>{e.preventDefault();openEmailProvider(message());});document.getElementById("compose-wa")?.addEventListener("click",()=>contact("wa"));
document.getElementById("close-email-provider")?.addEventListener("click",closeEmailProvider);emailProvider?.addEventListener("click",e=>{if(e.target===emailProvider)closeEmailProvider();});emailProvider?.querySelectorAll("[data-email-provider]").forEach(button=>button.addEventListener("click",()=>launchEmail(button.dataset.emailProvider)));
const emailButton=document.querySelector('#contact-form button[type="submit"]');if(emailButton)emailButton.disabled=!email;
const waButton=document.getElementById("compose-wa");if(waButton)waButton.disabled=!whatsapp;

const quickQr=document.getElementById("quick-qr-dialog"),quickQrButton=document.getElementById("quick-qr"),quickQrBox=document.getElementById("quick-qr-box");
function closeQuickQr(){if(quickQr?.open)quickQr.close();}
function renderBrandedQr(box,svg,alt){box.innerHTML=svg;box.querySelector("svg")?.setAttribute("aria-label",alt);const badge=document.createElement("span");badge.className="qr-brand-badge";const image=document.createElement("img");image.src="assets/portfolio-icon.png";image.alt="";badge.append(image);box.append(badge);}
function openQuickQr(e){e?.preventDefault();if(!quickQr||!quickQrBox||typeof qrcode!=="function")return;const url=config.publicUrl||new URL("./",location.href).href;const qr=qrcode(0,"M");qr.addData(url);qr.make();renderBrandedQr(quickQrBox,qr.createSvgTag({cellSize:8,margin:28,scalable:true}),"Codice QR personalizzato per aprire il portfolio di Gabriele Corso");quickQr.showModal();}
quickQrButton?.addEventListener("click",openQuickQr);document.getElementById("footer-qr")?.addEventListener("click",openQuickQr);document.getElementById("close-quick-qr")?.addEventListener("click",closeQuickQr);quickQr?.addEventListener("click",e=>{if(e.target===quickQr)closeQuickQr();});

const canvas=document.getElementById("field");if(!canvas)return;const ctx=canvas.getContext("2d");const orbitalIcons=[...document.querySelectorAll(".satellite")];let w=0,h=0,time=0,last=0,visible=true;
function positionOrbitIcons(){if(!w||!h)return;const cx=w/2,cy=h/2,r=Math.min(w,h)*.3,rx=r*1.2,ry=r;orbitalIcons.forEach((icon,index)=>{const a=time*.25+index*Math.PI*2/orbitalIcons.length-Math.PI/2;icon.style.left=`${cx+Math.cos(a)*rx}px`;icon.style.top=`${cy+Math.sin(a)*ry}px`;icon.style.right="auto";icon.style.bottom="auto";icon.style.transform="translate(-50%,-50%)";});}
new ResizeObserver(()=>{const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);draw();positionOrbitIcons();}).observe(canvas);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(canvas);
function draw(){ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2;for(let j=0;j<9;j++){ctx.beginPath();for(let i=0;i<=160;i++){const a=i/160*Math.PI*2;const wave=Math.sin(a*3+time+j*.24)*9;const r=Math.min(w,h)*(.22+j*.012)+wave;const x=cx+Math.cos(a)*r*1.22,y=cy+Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.strokeStyle=j===4?"#d6f29480":"#b5c4ba24";ctx.lineWidth=1;ctx.stroke();}
for(let j=0;j<orbitalIcons.length;j++){const a=time*.25+j*Math.PI*2/orbitalIcons.length;const r=Math.min(w,h)*.3;ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*1.2,cy+Math.sin(a)*r,2.5,0,Math.PI*2);ctx.fillStyle="#d6f294";ctx.fill();}}
function tick(now){if(now-last>32){if(!paused&&!document.hidden){time+=.012;if(visible)draw();positionOrbitIcons();}last=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);
})();
