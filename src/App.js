import moment from 'moment';
import CalendarItem from "./CalendarItem";

// Louvores
const praises = {
  friday: ["Tu és soberano", "Maranata", "Meu Barquinho", "Galileu", "Jerusalem"],
  ebd: [],
  sunday: ["Sobre as aguas", "Maranata", "Galileu", "3 Palavrinhas", "Como José", "Não há Deus maior", "Filho Prodigo", "Filho do Deus vivo", "Reis dos Reis", "Remove a pedra"],
  hcc: ['456', '001', '002', '001', '540'],
  sundayprelude: ["Vem, esta é a hora", "Jesus em tua presença", "Jesus é o caminho", "Jó"],
  supper: ["Bendito Cordeiro", "Bendito Cordeiro", "Bendito Cordeiro", "Bendito Cordeiro"] // Louvors de Ceia
}

// Musicos
const musicians = {
  instrumentalists: [],
  vocals: {
    friday: ["Lidiane", "Laís", "Edvan"],
    ebd: ["Wilson", "Paulinha"],
    sunday: ["Paulinha", "Fernanda", "Laís", "Kelviane", "Lidiane", "Duda"]
  }
}

function SelectPraiseSunday(week) {
  switch (week) {
    case 1:
      return [praises.sundayprelude[0], praises.sunday[0], praises.sunday[1]]

    case 2:
      return [praises.sundayprelude[1], praises.sunday[2], praises.sunday[3]]

    case 3:
      return [praises.sundayprelude[2], praises.sunday[1], praises.sunday[4]]

    case 4:
      return [praises.sundayprelude[3], praises.sunday[3], praises.sunday[5]]

    default:
      return [praises.sundayprelude[4], praises.sunday[4], praises.sunday[6]]
  }
}

const scales = [
  {
    date: somarDias(proximoDomingo(), -2),
    cult: 'Doutrina / Oração',
    praises: [praises?.friday[getWeekNumber() - 1], praises?.friday[getWeekNumber()]],
    vocals: musicians.vocals.friday
  },
  {
    date: proximoDomingo(),
    cult: getSundaysInMonth() === getWeekNumber() ? 'EBD com Ceia' : 'EBD',
    praises: getSundaysInMonth() === getWeekNumber() ? praises.supper : praises.ebd,
    vocals: musicians.vocals.ebd
  },
  {
    date: proximoDomingo(),
    cult: 'Louvor e Pregação',
    praises: SelectPraiseSunday(getWeekNumber()),
    hcc: [praises?.hcc[getWeekNumber() - 1], praises?.hcc[getWeekNumber()]],
    vocals: ["Edmilson", "Edvan", ...musicians.vocals.sunday] // LOGICA PRA SELECIONAR VOCAIS
  },


]

const otherscales = [
  {
    date: moment("2023/11/13"),
    cult: 'Especial',
    praises: ["Lovar a Deus"],
    vocals: ["Edmilson", "Edvan", "Duda", "Kelviane"]
  },
]

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

const sortedScales = scales.concat(otherscales).sort((a, b) => {
  return moment(a.date) - moment(b.date);
});

function ListPraises() {
  return (
    <div>

      <h3 style={{ paddingLeft: 30, fontWeight:500, fontSize:16 }}>Louvores do mês:</h3>
      <div style={{ display: 'flex', overflow: 'auto', height: 80, gap: 6, padding: '0px 12px 12px 12px' }}>
        {
          praises.sunday.map((pray) => {
            return (
              <div style={{ minWidth: 100, maxWidth:120, borderRadius: 12, backgroundColor: '#558B2F', display: 'grid', alignItems: 'center', justifyContent: 'center', padding: 6, }}>
                <strong style={{ textAlign: 'center', fontWeight: 300, fontSize: 15, color: '#fff' }}>{pray}</strong>
                <strong style={{ textAlign: 'center', fontWeight: 300, fontSize: 13, color: '#fff' }}>Tom: C#</strong>
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

      <div style={{ backgroundColor: '#fff', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ textAlign: 'center', fontSize: 28, fontWeight: 600 }}>Escala Louvor</span>

      </div>

      <ListPraises />
      {sortedScales.map((scale, index) => {
        return (
          <CalendarItem key={index} data={scale} />
        )
      })}
    </div>
  );
}
