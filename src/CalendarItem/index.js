import './estilo.css';
import moment from 'moment';

export default function CalendarItem({ data }) {
  const escala = require('../utils/louvores.json');
  const semana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

  if (moment(data.data).isBefore(moment(), 'day')) {
    return null;
  }

  // Busca hino do cantor cristao com base no numero
  function cantorCristao(num) {
    for (let i = 0; i < escala.length; i++) {
      if (escala[i]?.num === num) return escala[i].louvor;
    }
    return null; // caso não encontre, retorna null
  }

  return (
    <div className="container">
      <div className="top">
        <h1 className="title" style={{ color: data.culto === 'PSH' ? '#795548' : '#00796B' }}>
          {data.culto}
        </h1>

        <div className="date">
          <span
            style={{
              fontWeight: 600,
              color: data.culto === 'PSH' ? '#795548' : '#00796B'
            }}
          >
            {semana[moment(data.data).day()]}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              marginTop: 1,
              marginRight: 2,
              color: '#00000070'
            }}
          >
            {moment(data.data).format('DD/MM')}
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', marginBottom: 18, gap: 2 }}>
        {data?.louvores?.map((louvor, index) => {
          const tom = escala.find((item) => item.louvor === louvor);

          return (
            <label
              key={index}
              style={{
                fontSize: 15,
                fontWeight: 300,
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              - {louvor} {index === 0 && data.culto === 'Louvor e Pregação' ? ' [ Prelúdio ]' : ''}
              {tom?.tom ? (
                <div
                  style={{
                    marginLeft: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    display: 'flex'
                  }}
                >
                  <label style={{ color: '#aaa', marginRight: 4 }}>♪</label>
                  <div style={{ fontWeight: 500, color: '#795548' }}>{tom?.tom}</div>
                </div>
              ) : null}
            </label>
          );
        })}
        {data.hcc?.map((hcc, index) => {
          return (
            <label key={index} style={{ fontSize: 15, fontWeight: 300 }}>
              CC {hcc} - {cantorCristao(hcc)}{' '}
            </label>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          borderWidth: 0.5,
          borderTop: '1px solid #aaa',
          paddingTop: 12,
          gap: 6
        }}
      >
        {data.vocalistas?.concat(data?.instrumentistas).map((musicos, index) => {
          return (
            <strong key={index} style={{ fontSize: 15, fontWeight: 300 }}>
              {musicos}
            </strong>
          );
        })}
      </div>
    </div>
  );
}
