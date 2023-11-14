import moment from 'moment';
import CalendarItem from "./CalendarItem";
const escala = require('./utils/praisesList.json')


// Louvores
const praises = {
  friday: ["louvor Friday1", "louvor Friday2", "louvor Friday3", "louvor Friday4", "louvor Friday5"], // 5 LOUVORES
  psh: ["louvorPSH1", "louvorPSH2", "louvorPSH3", "louvorPSH4", "louvorPSH5", "louvorPSH6", "louvorPSH7"],
  ebd: [],
  sundayprelude: ["louvorPreludio1", "louvorPreludio2", "louvorPreludio3", "louvorPreludio4"], // 4 LOUVORES
  sunday: ["louvorSunday1", "louvorSunday2", "louvorSunday3", "louvorSunday4", "louvorSunday5"], // 5 LOUVORES , SENDO 3 DE SEXTA
  sundaycommunion: ["louvor Communion1", "louvor Communion2", "louvor Communion3", "louvor Communion4", "louvor Communion5"], // 5 LOUVORES
  hcc: ['001', '002', '003', '004', '005'],
  supper: ["Bendito Cordeiro"] // Louvors de Ceia
}


// Musicos
const musicians = {

  instrumentalists: {
    friday: ["Wesley", "Warley"],
    psh: ["Thiago", "Andre", "Warley", "Rhuan", "Rhuan"],
    ebd: ["Annes"],
  },

  vocals: {
    friday: ["Lidiane", "Laís", "Edvan"],
    psh: [["Wilson", "Paulinha"], ["Kelviane", "Fernanda"], ["Edmilson", "Fernanda"], ["Lidiane", "Duda", "Laís"]],
    ebd: ["Wilson", "Paulinha"],
    sunday: ["Laís", "Kelviane", "Lidiane", "Duda"]
  }
  
}


const scales = [
  {
    date: somarDias(proximoDomingo(), -2),
    cult: 'Doutrina / Oração',
    praises: [praises?.friday[getWeekNumber() - 1], praises?.friday[getWeekNumber()]],
    vocals: musicians.vocals.friday,
    instrumentalists: musicians.instrumentalists.friday
  },
  {
    date: proximoDomingo(),
    cult: getSundaysInMonth() === getWeekNumber() ? 'EBD com Ceia' : 'EBD',
    praises: getSundaysInMonth() === getWeekNumber() ? praises.supper : praises.ebd,
    vocals: musicians.vocals.ebd,
    instrumentalists: musicians.instrumentalists.ebd
  },
  {
    date: proximoDomingo(),
    cult: 'Louvor e Pregação',
    praises: SelectPraiseSunday(getWeekNumber()),
    hcc: [praises?.hcc[getWeekNumber() - 1], praises?.hcc[getWeekNumber()]],
    vocals: ["Edmilson", "Edvan", getWeekNumber() % 2 === 0 ? "Fernanda" : "Paulinha", musicians.vocals.sunday[getWeekNumber() - 1]],
    instrumentalists: ["Wesley", "Annes", getWeekNumber() % 2 === 0 ? "André" : "Thiago"]
  },
]


const psh = [
  {
    date: somarDias(proximoDomingo(), -1),
    cult: 'PSH',
    praises: [praises?.psh[getWeekNumber() - 1], praises?.psh[getWeekNumber()], praises?.psh[getWeekNumber() + 1]],
    vocals: musicians.vocals.psh[getWeekNumber() - 1],
    instrumentalists: musicians.instrumentalists.psh[getWeekNumber() - 1]
  }
]


const otherscales = [
  //Escrever data no formato YYYY/MM/DD
  {
    date: moment("2023/11/13"),
    cult: 'Culto Especial',
    praises: ["Lovar a Deus"],
    vocals: ["Edmilson", "Edvan", "Duda", "Kelviane"]
  },
]


// 12 LOUVORS PARA DOMINGOS
function SelectPraiseSunday(week) {
  switch (week) {
    case 1: return [praises.sundayprelude[0], praises.sunday[0], praises.sundaycommunion[0]]
    case 2: return [praises.sundayprelude[1], praises.sunday[1], praises.sundaycommunion[1]]
    case 3: return [praises.sundayprelude[2], praises.sunday[2], praises.sundaycommunion[2]]
    case 4: return [praises.sundayprelude[3], praises.sunday[1], praises.sundaycommunion[3]]

    default: return [praises.sundayprelude[4], praises.sunday[0], praises.sundaycommunion[4]]
  }
}


function proximoDomingo() {
  return moment().day(7);
}
function somarDias(data, dias) {
  return moment(data).add(dias, 'days');
}
function getWeekNumber() {
  var today = new Date();
  var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var pastDaysOfMonth = today.getDate() - 1;
  var weekNumber = Math.ceil((pastDaysOfMonth + firstDayOfMonth.getDay() + 1) / 7);
  return weekNumber;
}
function getSundaysInMonth() {
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  var sundays = 0;

  for (var day = 1; day <= 31; day++) {
    var date = new Date(year, month, day);
    if (date.getMonth() === month && date.getDay() === 0) {
      sundays++;
    }
  }

  return sundays;
}
const sortedScales = scales.concat(otherscales, psh).sort((a, b) => {
  return moment(a.date) - moment(b.date);
});
const uniqueItems = praises.sunday?.concat(praises.friday, praises.sundayprelude, praises.supper, praises.sundaycommunion).filter((item, index, array) => {
  return array.indexOf(item) === index;
});
function getTons(n) {
  for (let i = 0; i < escala.length; i++) {
    if (escala[i].name === n) return escala[i].tom;

  }
  return null; // caso não encontre, retorna null
}


const width = window.innerWidth;
const widthInPx = parseInt(width / 4.7);


function ListPraises() {
  return (
    <div style={{ marginBottom: 30, padding: 6 }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', padding: '0px 30px' }}>
        <p style={{ marginRight: 6, fontWeight: 300, fontSize: 14, }}>Em Árvores Verdes e PSH, deverão ser trabalhados esses {uniqueItems.length} louvores nos proximos 30 dias.</p>
      </div>


      <div style={{ display: 'flex', overflow: 'scroll', height: 80, gap: 8, padding: '18px 6px' }}>
        {
          uniqueItems.map((pray) => {
            return (
              <div style={{ flexWrap:'wrap', padding:'0px 12px', boxShadow: '0px 1px 3px #00000030', position: 'relative', minWidth: widthInPx, borderRadius: '18px 0px 18px 0px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ textAlign: 'center', fontWeight: 300, fontSize: 15, color: '#000' }}>{pray}</strong>
                {getTons(pray) ? <strong style={{ boxShadow: '1px 1px 5px #00000040', fontWeight: 500, position: 'absolute', bottom: -12, left: 6, backgroundColor: '#222', fontSize: 14, padding:'2px 12px', borderRadius: 12, color:'#fff' }}>{getTons(pray)}</strong>: null}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}



export default function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, }}>ESCALA DE LOUVOR ADONAI</h1>

      <ListPraises />

      {sortedScales.map((scale, index) => {
        return (
          <CalendarItem key={index} data={scale} />
        )
      })}

      <p style={{ textAlign: 'center', marginTop: 50, fontWeight: 300 }}>Ministério de Louvor Adonai</p>
    </div>
  );
}
