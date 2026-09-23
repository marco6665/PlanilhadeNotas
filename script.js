const WEIGHTS={livro:.10,caderno:.20,lista:.10,prova:.50};
let students=[
{id:1,nome:"Ana Silva",livro:8,caderno:9,lista:7,prova:8},
{id:2,nome:"Bruno Santos",livro:7,caderno:6,lista:8,prova:6},
{id:3,nome:"Carla Oliveira",livro:10,caderno:9,lista:10,prova:9}
];
const tbody=document.querySelector("#studentRows"), search=document.querySelector("#search");
const discipline=document.querySelector("#discipline"), className=document.querySelector("#className"), teacher=document.querySelector("#teacher"), period=document.querySelector("#period");
function num(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(10,n)):0}
function average(s){return s.livro*WEIGHTS.livro+s.caderno*WEIGHTS.caderno+s.lista*WEIGHTS.lista+s.prova*WEIGHTS.prova}
function situation(a){if(a>=7)return["Aprovado","good"];if(a>=5)return["Atenção","attention"];return["Abaixo de 5","low"]}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function gradeCell(k,v){return `<td><input class="grade" type="number" min="0" max="10" step=".1" value="${v}" data-key="${k}" aria-label="Nota de ${k}"></td>`}
function updateTitle(){const d=discipline.value.trim()||"Disciplina";const t=className.value.trim()||"Turma";document.querySelector("#pageTitle").textContent=`Organizador de Notas — ${d}`;document.querySelector(".subtitle").textContent=`${t}${teacher.value.trim()?" • "+teacher.value.trim():""} • ${period.value}`;document.title=`${d} — ${t}`}
function updateRow(tr,s){const a=average(s);tr.querySelector(".average").textContent=a.toFixed(2);const [l,c]=situation(a);const b=tr.querySelector(".badge");b.textContent=l;b.className="badge "+c}
function updateSummary(){document.querySelector("#studentCount").textContent=students.length;if(!students.length){document.querySelector("#classAverage").textContent="—";document.querySelector("#highestAverage").textContent="—";document.querySelector("#belowFive").textContent="0";return}const a=students.map(average);document.querySelector("#classAverage").textContent=(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2);document.querySelector("#highestAverage").textContent=Math.max(...a).toFixed(2);document.querySelector("#belowFive").textContent=a.filter(x=>x<5).length}
function drawChart(){const c=document.querySelector("#chart");c.innerHTML="";if(!students.length){c.innerHTML='<div class="empty">Adicione alunos para visualizar o gráfico.</div>';return}students.forEach(s=>{const a=average(s),w=document.createElement("div");w.className="bar-wrap";w.innerHTML=`<div class="bar-value">${a.toFixed(1)}</div><div class="bar" style="height:${Math.max(3,a*21)}px"></div><div class="bar-label" title="${escapeHtml(s.nome)}">${escapeHtml(s.nome)}</div>`;c.appendChild(w)})}
function render(){tbody.innerHTML="";const term=search.value.trim().toLowerCase();students.filter(s=>s.nome.toLowerCase().includes(term)).forEach(s=>{const a=average(s),[l,cl]=situation(a),tr=document.createElement("tr");tr.innerHTML=`<td><input class="name-input" value="${escapeHtml(s.nome)}"></td>${gradeCell("livro",s.livro)}${gradeCell("caderno",s.caderno)}${gradeCell("lista",s.lista)}${gradeCell("prova",s.prova)}<td class="average">${a.toFixed(2)}</td><td><span class="badge ${cl}">${l}</span></td><td><button class="delete" type="button" title="Excluir aluno">×</button></td>`;tr.querySelector(".name-input").addEventListener("input",e=>{s.nome=e.target.value;updateSummary();drawChart()});["livro","caderno","lista","prova"].forEach(k=>tr.querySelector(`[data-key="${k}"]`).addEventListener("input",e=>{s[k]=num(e.target.value);updateRow(tr,s);updateSummary();drawChart()}));tr.querySelector(".delete").addEventListener("click",()=>{students=students.filter(x=>x.id!==s.id);render()});tbody.appendChild(tr)});updateSummary();drawChart()}
document.querySelector("#addStudent").addEventListener("click",()=>{students.push({id:Date.now(),nome:"Novo aluno",livro:0,caderno:0,lista:0,prova:0});render();const x=tbody.lastElementChild?.querySelector(".name-input");if(x){x.focus();x.select()}});
document.querySelector("#clearAll").addEventListener("click",()=>{if(confirm("Remover todos os alunos?")){students=[];render()}});
search.addEventListener("input",render);
[discipline,className,teacher,period].forEach(x=>x.addEventListener("input",updateTitle));
period.addEventListener("change",updateTitle);
updateTitle();render();