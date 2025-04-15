import { useState, useEffect } from 'react';

import './statusprogress.css';

export function StatusProgress({ typeRequest, idStatus }) {
    const [statusList, setStatusList] = useState([]);


    useEffect(()=> {
        const listDefault = [
            { id_status: 1, status_name: "Recebido", status_done: true },
            { id_status: 2, status_name: "Em separação", status_done: false },
            { id_status: 3, status_name: "Separado", status_done: false },
            { id_status: 4, status_name: "Entregue", status_done: false },
            { id_status: 5, status_name: "Devolvido", status_done: false },
        ];

        const newListStatus = listDefault.map(item => item.id_status <= idStatus ? {...item, status_done: true} : item);
        if(typeRequest == 'Saída') {
            newListStatus.pop();
        }
        
        setStatusList(newListStatus);
    }, [typeRequest, idStatus]);


   

    return (
        <div className="StatusProgress">
            {statusList.map((item)=> (
                <div className={`step ${item.status_done ? 'active' : ''}`} data-label={item.status_name}>
                    
                </div>
            ))}
        </div>
    );
}