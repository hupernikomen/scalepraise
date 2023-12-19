import './estilo.css';
import moment from 'moment';

export default function CalendarItem({ data }) {
  // console.log(data?.hcc[0]?.n, data?.hcc[0]?.louvor, 'datat');
  if (data?.status === false) {
    return;
  }

  const escala = require('../utils/louvores.json');
  const semana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

  if (moment(data.data).isBefore(moment(), 'day')) {
    return null;
  }

  // Busca hino do cantor cristao com base no numero
  function cantorCristao(num) {
    const response = escala.filter((item) => item.n === num);
    return response[0]?.louvor;
  }

  return (
    <div className="container">
      <div className="top">
        <h1 className="title" style={{ color: data.culto === 'PSH' ? '#795548' : '#58731e', fontWeight: 500 }}>
          {data.culto}
        </h1>

        <div className="date">
          <span
            style={{
              fontWeight: 400,
              color: data.culto === 'PSH' ? '#795548' : '#58731e'
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: '#000'
              }}
            >
              {' '}
              {moment(data.data).format('DD')} | {semana[moment(data.data).day()]}
            </span>{' '}
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', marginBottom: 18, gap: 2 }}>
        {data?.louvores?.map((louvor, index) => {
          const tonsescalasextras = escala.find((item) => item.louvor === louvor);

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
              - {louvor?.louvor || louvor} {index === 0 && data.culto === 'Louvor e Pregação' ? ' [ Prelúdio ]' : ''}
              {louvor?.tom || tonsescalasextras?.tom ? (
                <div
                  style={{
                    marginLeft: 20,
                    alignItems: 'center',
                    flexDirection: 'row',
                    display: 'flex'
                  }}
                >
                  <label style={{ color: '#000', marginRight: 4 }}>♪</label>
                  <label style={{ color: '#795548' }}>{louvor?.tom || tonsescalasextras?.tom}</label>
                </div>
              ) : null}
            </label>
          );
        })}
        {data.hcc?.map((hcc, index) => {
          return (
            <label key={index} style={{ fontSize: 15, fontWeight: 300 }}>
              CC {hcc} - {cantorCristao(hcc)}
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
