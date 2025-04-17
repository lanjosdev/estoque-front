// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { CATEGORY_GET_ALL } from "../../../../../API/categoryApi";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './sectorfilter.css';



export function SectorFilter({ idsSectorsActives, setIdsSectorsActives }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Dados a ser pré-carregados:
    const [sectors, setSectors] = useState([]);

    


    const tokenCookie = Cookies.get('tokenEstoque');

    useEffect(()=> {
        async function getAllSectors() {
            setLoading(true);
            // console.log('Effect Window SectorFilter');
            
            try {
                setHasError(true);
                
                const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie), 'active=true');
                console.log(response);

                if(response.success) {
                    // setSectors([]);
                    setSectors(response.data);

                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    toast.warn(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    console.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO:', error);
            }
            
            setLoading(false);
        }
        getAllSectors();
    }, [tokenCookie]);




    function handleChangeIdsSectors(idTarget) {
        const index = idsSectorsActives.findIndex(each=> each == idTarget);
        const newIdsSectorsActives = [...idsSectorsActives];

        if(index == -1) {
            newIdsSectorsActives.push(idTarget);
        } 
        else {
            newIdsSectorsActives.splice(index, 1);
        }

        console.log(newIdsSectorsActives);
        setIdsSectorsActives(newIdsSectorsActives);
    }


    return (
        <div className='SectorFilter component_child'>
            <h4 className="title_child">Filtrar por setor</h4>

            {loading ? (
                <p className='feedback_child'>Carregando dados...</p>
            ) : (

                hasError ? (
                    <p className='feedback_child'>Erro ao carregar dados</p>
                ) : (
                    <div className="radios-group">
                        {sectors.map((item, idx)=> (
                        <label className='btn-filter' key={idx}>
                            <input 
                            type="checkbox" 
                            // value={item.value}
                            checked={idsSectorsActives.some(each=> each == item.id)}
                            onChange={()=> handleChangeIdsSectors(item.id)}
                            />
                            {item.name}
                        </label>
                        ))}
                    </div>
                )
            )}           
        </div>
    )        
}