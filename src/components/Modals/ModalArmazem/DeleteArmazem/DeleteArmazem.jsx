// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';

// API:
import { STORAGE_DELETE, STORAGE_VIEW_PRODUCTS } from "../../../../API/storageApi";

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
    const {profileDetails} = useContext(UserContext);

    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const elementFocusRef = useRef(null);

    // Logica UI:
    const [productsArmazem, setProductsArmazem] = useState([]);





    const tokenCookie = Cookies.get('tokenEstoque') || null;

    useEffect(()=> {
        async function getProductsArmazem() {
            setLoading(true);
            console.log('Effect Window DeleteArmazem');

            try {
                setHasError(true);
                //=> GET ALL CATEGORY
                const response = await STORAGE_VIEW_PRODUCTS(JSON.parse(tokenCookie), armazemSelect.id, 1);
                console.log(response);

                if(response.success) {
                    // setProductsArmazem([]);
                    setProductsArmazem(response.data.data);
                    
                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    // toast.error(response.message);
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
        getProductsArmazem();
    }, [tokenCookie, armazemSelect]);
    
    useEffect(()=> {
        function initializeComponent() {

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
        setLoadingSubmit(true);

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

        setLoadingSubmit(false);
    }

    

    return (
        <div className='Window DeleteArmazem grid'>
            <h3 className="title-danger">
                <i className="bi bi-question-octagon"></i> 
                <span>Deletar armazém</span>
            </h3>       

            <div className="content-window">
                {loading ? (
                    <p className="">
                        Carregando...
                    </p>
                ) : (
                hasError ? (
                    <p className="">
                        Erro ao carregar
                    </p>
                ) : (
                    productsArmazem.length > 0 ? (
                        <p>Este armazém não pode ser excluído, pois ainda há produtos armazenados nele.</p>
                    ) : (
                        profileDetails.level_name == 'admin' ?  (
                        <p>
                            Deseja deletar <b>{armazemSelect.name} {armazemSelect.observation ? `(${armazemSelect.observation})` : ''}</b> ?
                        </p>
                        ) : (
                        <p className="text-not-access">
                            <i className="bi bi-exclamation-triangle"></i> 
                            Você não pode seguir com esta ação, contate o administrador do ambiente.
                        </p>   
                        )
                    )
                ))}
                          
                           


                <div className="btns">
                    {profileDetails.level_name == 'admin' && (
                    <button className="btn danger" onClick={handleSubmitDeleteStorage} disabled={loading || hasError || productsArmazem.length > 0 || loadingSubmit}>
                        {loadingSubmit ? 'Deletando...' : 'Deletar'}
                    </button>
                    )}

                    <button ref={elementFocusRef} className="btn cancel" onClick={close} disabled={loadingSubmit}>
                        {profileDetails.level_name == 'admin' ? 'Cancelar' : 'Fechar'}
                    </button>
                </div>
            </div>     
        </div>
    )        
}