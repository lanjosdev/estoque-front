// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';

// API:
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";
import { PRODUCT_CREATE } from "../../../../API/productApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './createproduct.css';


CreateProduct.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateProduct({ close, setReflashState }) {
    const { settingsAdmin } = useContext(UserContext);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Dados a ser pré-carregados:
    const [sectors, setSectors] = useState([]);
    

    // Dados a submeter:
    const nameRef = useRef('');
    const [sectorProduct, setSectorProduct] = useState(null);
    const quantIdealRef = useRef(0);
    const obsRef = useRef(null);
    const [hasExpiration, setHasExpiration] = useState(null);


    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window CreateProduct');

            try {
                //=> GET ALL CATEGORY
                const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie), 'active=true');
                console.log(response);

                if(response.success) {
                    setSectors(response.data);
                    setHasError(false);
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                console.error('DEU ERRO:', error);

                if(error?.response?.data?.message == 'Unauthenticated.') {
                    toast.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }

            setLoading(false);
        }
        initializeComponent();
    }, [tokenCookie]);

    


    // CREATE PRODUCT:
    async function handleSubmitCreteProduct(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        const name = nameRef.current?.value;
        const quantIdeal = quantIdealRef.current?.value;
        const obs = obsRef.current?.value;
        console.log(name);
        console.log(sectorProduct?.id);
        console.log(quantIdeal);
        console.log(obs);
        console.log(hasExpiration);

        if(name !== '' && quantIdeal > 0 && sectorProduct?.id && hasExpiration !== null) {
            try {
                const response = await PRODUCT_CREATE(JSON.parse(tokenCookie), name, sectorProduct.id, quantIdeal, obs, hasExpiration);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Produto cadastrado!');
                }
                else if(response.success == false) {
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
                    console.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO: ', error);
            }
        } 
        else {
            console.warn('Algum erro com a condicional!');
        } 

        setLoadingSubmit(false);
    }

    

    return (
        <div className='Window CreateProduct grid'>
            <h3>Cadastrar novo produto</h3>

            <form className="content-window" onSubmit={handleSubmitCreteProduct} autoComplete="off">
                <div className="label--input">
                    <label htmlFor="nome">Nome do produto</label>
                    <input ref={nameRef} className="input" id='nome' type="text" required />
                </div>

                <div className="label--input">
                    <label>Setor do produto</label>
                    
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
                                    onChange={()=> setSectorProduct(item)}
                                    required
                                    />
                                    {item.name}
                                </label>
                            ))
                        )}
                        
                    </div>
                </div>

                <div className="label--input">
                    <label htmlFor="qtd">Quantidade ideal</label>
                    <input ref={quantIdealRef} className="input" id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity_min} required />
                </div>

                <div className="label--input">
                    <label htmlFor="obs">Observação</label>
                    <textarea ref={obsRef} className="input" id="obs"></textarea>
                </div>

                <div className="label--input question">
                    <label>Tem data de vencimento?</label>

                    <div className="yes--no">
                        <label>
                            <input
                            type="radio"
                            name="expiration"
                            value={1}
                            onChange={()=> setHasExpiration(1)}
                            required
                            /> 
                            Sim
                        </label>
                        <label>
                            <input
                            type="radio"
                            name="expiration"
                            value={0}
                            onChange={()=> setHasExpiration(0)}
                            required
                            />
                            Não
                        </label>
                    </div>
                </div>


                <div className="btns">
                    <button className="btn primary" disabled={loading || loadingSubmit || !sectorProduct || hasError}>
                        {loadingSubmit ? 'Cadastrando...' : 'Cadastrar produto'}
                    </button>

                    <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                        Cancelar
                    </button>
                </div>
            </form> 
        </div>
    )        
}