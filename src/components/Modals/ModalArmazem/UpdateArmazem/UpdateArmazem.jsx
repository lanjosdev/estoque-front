// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';

// API:
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";
import { STORAGE_UPDATE } from "../../../../API/storageApi";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './updatearmazem.css';


UpdateArmazem.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    armazemSelect: PropTypes.object
}
export function UpdateArmazem({ close, setReflashState, armazemSelect }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    
    // Pré carregamento de dados:
    const [sectors, setSectors] = useState([]);
    

    // Logica UI:
    const elementFocusRef = useRef(null);
    const [updateStorage, setUpdateStorage] = useState(false);
    
    // Dados a submiter:
    const nameRef = useRef('');
    const [idSectorArmazem, setIdSectorArmazem] = useState(armazemSelect.fk_category_id || null);
    const detailingRef = useRef('');

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        async function getSectors() {
            setLoading(true);
            console.log('Effect Window UpdateArmazem');

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

    useEffect(()=> {
        function initializeComponent() {
            if(elementFocusRef?.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }

            if(nameRef.current && detailingRef.current) {
                nameRef.current.value = armazemSelect.name;
                detailingRef.current.value = armazemSelect.observation;
            }
        }
        initializeComponent();
    }, [armazemSelect]);



    // UPDATE:
    async function handleSubmitUpdateStorage(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        const name = nameRef?.current?.value;
        const details = detailingRef?.current?.value;
        console.log(armazemSelect?.id)
        console.log(name)
        console.log(idSectorArmazem)
        console.log(details)

        // Validação:
        const requirements = armazemSelect?.id && name.replace(/\s/g, '').length > 0 && idSectorArmazem !== null;

        if(!requirements) {
            setLoadingSubmit(false);
            toast.warn('Prencha corretamente o(s) campo(s) necessários.');
            return;
        }


        // Submit API:
        try {
            const response = await STORAGE_UPDATE(JSON.parse(tokenCookie), armazemSelect.id, name, idSectorArmazem, details);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Alteração salva!');
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
        <div className='Window UpdateArmazem CreateArmazem grid'>
            <h3>Editar armazém</h3>

            <form className="content-window" onSubmit={handleSubmitUpdateStorage} autoComplete="off">
                {/* <p>Abaixo você pode editar as informações do armazém <b className="item-edit">{`"${armazemSelect.name}"`}</b>.</p>  */}
                <p>Abaixo você pode editar as informações do armazém.</p> 

                <div className="label--input">
                    <label>Setor do armazém</label>
                    
                    <div className="radio-group">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : (
                            sectors.map(item=> (
                                <label key={item.id} title={item.description}>
                                    <input type="radio" name="setor"
                                    checked={item.id == idSectorArmazem}
                                    onChange={()=> {setIdSectorArmazem(item.id); setUpdateStorage(true)}}
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
                    <input ref={detailingRef} className="input" id="obs" onFocus={()=> setUpdateStorage(true)} ></input>
                </div>

                <div className="label--input">
                    <label htmlFor="nome">Endereçamento do armazém</label>
                    <input ref={nameRef} className="input" id='nome' type="text" required onFocus={()=> setUpdateStorage(true)} />
                </div>
                
                


                <div className="btns">
                    <button className="btn primary" disabled={loading || loadingSubmit || error || !updateStorage || idSectorArmazem == null }>
                        {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                    </button>

                    <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                        Cancelar
                    </button>
                </div>
            </form>                
        </div>
    )        
}