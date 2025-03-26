// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';

// API:
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
// import './createstorage.css';


CreateArmazem.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateArmazem({ close, setReflashState }) {
    const [loading, setLoading] = useState(false);

    const nameRef = useRef('');
    const detailingRef = useRef('');


    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window CreateArmazem');            
        }
        initializeComponent();
    }, []);



    // CREATE:
    async function handleSubmitCreteStorage(e) 
    {
        e.preventDefault();
        setLoading(true);

        const name = nameRef.current?.value;
        const details = detailingRef.current?.value;
        console.log(name)
        console.log(details)

        if(name !== '' && details !== '') {
            try {
                const response = await STORAGE_CREATE(JSON.parse(tokenCookie), name, details);
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
        } 
        else {
            console.warn('Algum erro com a condicional!');
        } 

        setLoading(false);
    }

    

    return (
        <div className='Window CreateArmazem grid'>
            <h3>Cadastrar novo armazém</h3>   

            <form className="content-window" onSubmit={handleSubmitCreteStorage} autoComplete="off">
                <div className="label--input">
                    <label htmlFor="nome">Nome do armazém</label>
                    <input ref={nameRef} className="input" id='nome' type="text" required />
                </div>

                <div className="label--input">
                    <label htmlFor="obs">Detalhamento do armazém</label>
                    <textarea ref={detailingRef} className="input" id="obs" required ></textarea>
                </div>


                <div className="btns">
                    <button className="btn primary" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar armazém'}
                    </button>

                    <button className="btn cancel" type="button" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>           
        </div>
    )        
}