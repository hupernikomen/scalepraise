import './estilo.css'
import moment from 'moment';

const praisesList = require('../utils/praisesList.json')

export default function CalendarItem({ data }) {

    const weekNumber = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']

    if (moment(data.date).isBefore(moment(), 'day')) { return null }

    function getName(n) {
        for (let i = 0; i < praisesList.length; i++) {
            if (praisesList[i]?.n === n) return praisesList[i].name;
        }
        return null; // caso não encontre, retorna null
    }

    return (
        <div className='container'>
            <div className='top'>
                <h1 className='title' style={{ color: data.cult === "PSH" ? "#795548" : '#00796B' }}>{data.cult}</h1>

                <div className='date'>
                    <span style={{ fontSize: 16, fontWeight:600, color: data.cult === "PSH" ? "#795548" : '#00796B' }}>{weekNumber[moment(data.date).day()]}</span>
                    <span  style={{ fontSize: 11 , fontWeight:400,marginTop:1,marginRight:2, color: "#00000070" }}>{moment(data.date).format('DD/MM')}</span>
                </div>

            </div>
            <div style={{ display: 'grid', marginBottom: 12, gap: 2 }}>
                {data.praises.map((pray, index) => {
                    return <label key={index} style={{ fontSize: 15, fontWeight: 300 }}>- {pray} {index === 0 && data.cult === 'Louvor e Pregação' ? ' [ Prelúdio ]' : ''}</label>
                })}

                {data.hcc?.map((hcc, index) => {
                    return <label key={index} style={{ fontSize: 15, fontWeight: 300 }}>CC {hcc} - {getName(hcc)} </label>
                })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', borderWidth: .5, borderTop: '1px solid #aaa', paddingTop: 12, gap:6 }}>

                {data.vocals?.concat(data?.instrumentalists).map((musician, index) => {
                    console.log(musician);
                    return <strong key={index} style={{ fontSize: 15, fontWeight: 300 }}>{musician}</strong>
                })}

            </div>
        </div>
    )
}