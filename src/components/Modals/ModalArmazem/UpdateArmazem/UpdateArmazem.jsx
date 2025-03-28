// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';

// API:
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
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const nameRef = useRef('');
    const detailingRef = useRef('');

    const [updateStorage, setUpdateStorage] = useState(false);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window UpdateArmazem');

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
        setLoading(true);

        const name = nameRef?.current?.value;
        const details = detailingRef?.current?.value;
        console.log(armazemSelect?.id)
        console.log(name)
        console.log(details)

        if(name !== '' && armazemSelect?.id) {
            try {
                const response = await STORAGE_UPDATE(JSON.parse(tokenCookie), armazemSelect.id, name, details);
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
                console.error('Deu erro: ', error);
    
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }
        }
        else {
            console.warn('Algum erro com a condicional!');
        }

        setLoading(false);
    }

    

    return (
        <div className='Window UpdateArmazem grid'>
            <h3>Editar armazém</h3>

            <form className="content-window" onSubmit={handleSubmitUpdateStorage} autoComplete="off">
                <p>Abaixo você pode editar as informações do armazém <b className="item-edit">{`"${armazemSelect.name}"`}</b>.</p> 

                <div className="label--input">
                    <label htmlFor="nome">Nome do armazém</label>
                    <input ref={nameRef} className="input" id='nome' type="text" required onFocus={()=> setUpdateStorage(true)} />
                </div>

                <div className="label--input">
                    <label htmlFor="obs">Detalhamento do armazém</label>
                    <textarea ref={detailingRef} className="input" id="obs" onFocus={()=> setUpdateStorage(true)} ></textarea>
                </div>


                <div className="btns">
                    <button className="btn primary" disabled={loading || !updateStorage}>
                        {loading ? 'Salvando...' : 'Salvar alteração'}
                    </button>

                    <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>                
        </div>
    )        
}