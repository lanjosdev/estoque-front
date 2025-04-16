// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';

// API:
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";
import { STORAGE_CREATE } from "../../../../API/storageApi";

// Context:
// import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './createarmazem.css';


CreateArmazem.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateArmazem({ close, setReflashState }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Pré carregamento de dados:
    const [sectors, setSectors] = useState([]);


    // Dados a submiter:
    const nameRef = useRef('');
    const [sectorArmazem, setSectorArmazem] = useState(null);
    const detailingRef = useRef('');


    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        async function getSectors() {
            setLoading(true);
            console.log('Effect Window CreateArmazem');

            try {
                setError(true);
                //=> GET ALL CATEGORY
                const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie), 'active=true');
                console.log(response);

                if(response.success) {
                    setSectors(response.data);
                    setError(false);
                }
                else if(response.success == false) {
                    console.error(response.message);
                    toast.error(response.message);
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
                    toast.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO:', error);
            }

            setLoading(false);
        }
        getSectors();
    }, [tokenCookie]);



    // CREATE:
    async function handleSubmitCreteStorage(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        const name = nameRef.current?.value;
        const details = detailingRef.current?.value;
        console.log(name)
        console.log(sectorArmazem.id)
        console.log(details)

        // Validação:
        const requirements = name.replace(/\s/g, '').length > 0 && sectorArmazem.id;

        if(!requirements) {
            setLoadingSubmit(false);
            toast.warn('Prencha corretamente o(s) campo(s) necessários.');
            return;
        }


        // Submit API:
        try {
            const response = await STORAGE_CREATE(JSON.parse(tokenCookie), name, sectorArmazem.id, details);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Armazém cadastrado!');
            }
            else if(response.success == false) {
                console.warn(response.message);
                toast.error(response.message);
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
                toast.error('Houve algum erro.');
            }

            console.error('DETALHES DO ERRO: ', error);
        }
        
        setLoadingSubmit(false);
    }

    

    return (
        <div className='Window CreateArmazem grid'>
            <h3>Cadastrar novo armazém</h3>   

            <form className="content-window" onSubmit={handleSubmitCreteStorage} autoComplete="off">
                <div className="label--input">
                    <label>Setor do armazém</label>
                    
                    <div className="radio-group">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : (
                            sectors.map(item=> (
                                <label key={item.id} title={item.description}>
                                    <input 
                                    type="radio" 
                                    name="setor"
                                    value={item.id} 
                                    onChange={()=> setSectorArmazem(item)}
                                    required
                                    />

                                    <span>{item.name}</span>
                                </label>
                            ))
                        )}
                        
                    </div>
                </div>

                <div className="label--input">
                    <label htmlFor="obs">Armazém</label>
                    <input ref={detailingRef} className="input" id="obs" placeholder="Ex: Escritório central" required></input>
                </div>

                <div className="label--input">
                    <label htmlFor="nome">Endereçamento do armazém</label>
                    <input ref={nameRef} className="input" id='nome' type="text" placeholder="Ex: Armário1/Gaveteiro2" required />
                </div>


                <div className="btns">
                    <button className="btn primary" disabled={loading || loadingSubmit || error || !sectorArmazem?.id}>
                        {loadingSubmit ? 'Cadastrando...' : 'Cadastrar armazém'}
                    </button>

                    <button className="btn cancel" type="button" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>           
        </div>
    )        
}