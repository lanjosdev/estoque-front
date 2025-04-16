// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';

// API:
import { STORAGE_DELETE } from "../../../../API/storageApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './deletearmazem.css';


DeleteArmazem.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    armazemSelect: PropTypes.object
}
export function DeleteArmazem({ close, setReflashState, armazemSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const {profileDetails} = useContext(UserContext); 

    const tokenCookie = Cookies.get('tokenEstoque') || null;


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window DeleteArmazem');

            // Coloca foco no elemento em questão
            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }

        }
        initializeComponent();
    }, []);



    // DELETE:
    async function handleSubmitDeleteStorage() 
    {
        setLoading(true);

        try {
            const response = await STORAGE_DELETE(JSON.parse(tokenCookie), armazemSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Armazém deletado!');
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

        setLoading(false);
    }

    

    return (
        <div className='Window DeleteArmazem grid'>
            <h3 className="title-danger">
                <i className="bi bi-question-octagon"></i> 
                <span>Deletar armazém</span>
            </h3>       

            <div className="content-window">
                          
                {profileDetails.level_name == 'admin' ?  (
                <p>
                    Deseja deletar <b>{armazemSelect.name} {armazemSelect.observation ? `(${armazemSelect.observation})` : ''}</b> ?
                </p>
                ) : (
                <p className="text-not-access">
                    <i className="bi bi-exclamation-triangle"></i> 
                    Você não pode seguir com esta ação, contate o administrador do ambiente.
                </p>   
                )}            


                <div className="btns">
                    {profileDetails.level_name == 'admin' && (
                    <button className="btn danger" onClick={handleSubmitDeleteStorage} disabled={loading}>
                        {loading ? 'Deletando...' : 'Deletar'}
                    </button>
                    )}

                    <button ref={elementFocusRef} className="btn cancel" onClick={close} disabled={loading}>
                        {profileDetails.level_name == 'admin' ? 'Cancelar' : 'Fechar'}
                    </button>
                </div>

            </div>     
        </div>
    )        
}