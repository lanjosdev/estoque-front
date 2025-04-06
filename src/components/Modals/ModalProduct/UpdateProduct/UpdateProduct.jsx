// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';

// API:
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";
import { PRODUCT_UPDATE } from "../../../../API/productApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './updateproduct.css';


UpdateProduct.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    productSelect: PropTypes.object,
    optionUpdate: PropTypes.any
}
export function UpdateProduct({ close, setReflashState, productSelect, optionUpdate }) {
    const { settingsAdmin } = useContext(UserContext);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const elementFocusRef = useRef(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    // const [validateSubmit, setValidateSubmit] = useState(false);

    // Dados a ser pré-carregados:
    const [sectors, setSectors] = useState([]);


    // Dados para submiter:
    const [name, setName] = useState(productSelect.name || '');
    const [idSectorProduct, setIdSectorProduct] = useState(productSelect.fk_category_id);
    const [quantIdeal, setQuantIdeal] = useState(productSelect.quantity_ideal || '');
    const [quantMin, setQuantMin] = useState(productSelect.quantity_min || '');
    const [obs, setObs] = useState(productSelect.observation || '');
    const [hasExpiration, setHasExpiration] = useState(productSelect.expiration_date);
    // const [listIdsProducts, setlistIdsProducts] = useState(productSelect.components_group.map(item=> item.id));
    const [ordersActive, setOrdersActive] = useState({
        exit: true,
        reservation: true
    });
    


    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window UpdateProduct');
            // console.log(optionUpdate);
            setLoading(true);

            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }
            

            if(optionUpdate == 'sector') {
                try {
                    //=> GET ALL CATEGORY
                    const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie), 'active=true');
                    console.log(response);
    
                    if(response.success) {
                        setSectors(response.data);
                        setHasError(false);
                    }
                    else if(response.success == false) {
                        console.error(response.message);
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
            }
            else {
                setHasError(false);
            }

            setLoading(false);
        }
        initializeComponent();
    }, [productSelect, optionUpdate, tokenCookie]);

    useEffect(()=> {
        async function checkValidateDatasSubmit() {
            // const requirements = productSelect?.id && quantity > 0 && obs.replace(/\s/g, '').length > 0;

            // const quantHasChange = exitSelect?.quantity != quantity;
            // const obsHasChange = exitSelect?.observation != obs;

            // const hasChange = quantHasChange || obsHasChange;
            // // console.log('Requisitos: ', requirements);
            // // console.log('Mudança: ', hasChange);
            // // console.log(requirements && hasChange);
            // setValidateSubmit(requirements && hasChange);          
        }
        checkValidateDatasSubmit();
    }, []);


    // SUBMIT UPDATE:
    async function handleSubmitUpdateProduct(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        console.log(name)
        console.log(idSectorProduct)
        console.log(quantIdeal)
        console.log(quantMin)
        console.log(obs)
        console.log(hasExpiration)

        if(name !== '' && quantIdeal > 0 && idSectorProduct > 0 && hasExpiration !== null) {
            // if(
            //     name == productSelect.name && 
            //     quantMin == productSelect.quantity_min && 
            //     sectorProduct == productSelect.fk_category_id &&
            //     hasExpiration == productSelect.expiration_date
            // ) {
            //     console.log('Nenhuma alteração!');
            //     setLoadingSubmit(false);
            //     return;
            // }

            try {
                const response = await PRODUCT_UPDATE(JSON.parse(tokenCookie), productSelect.id, name, idSectorProduct, quantIdeal, quantMin, obs, hasExpiration);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Alteração salva!');
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
        <div className='Window UpdateProduct CreateProduct grid'>

            {optionUpdate == 'product' ? (
                <>
                <h3>Editar produto</h3>
    
                <form className="content-window" onSubmit={handleSubmitUpdateProduct} autoComplete="off">
                    <p>Abaixo você pode editar as informações do produto <b>{productSelect.name}</b>.</p> 
    
                    <div className="label--input">
                        <label htmlFor="nome">Nome do produto</label>
                        <input className="input" id='nome' type="text" 
                        required 
                        value={name} 
                        onChange={(e)=> setName(e.target.value)} 
                        // onFocus={()=> setUpdateProduct(true)} 
                        />
                    </div>
    
                    <div className="label--input">
                        <label htmlFor="qtd">Quantidade ideal</label>
                        <input className="input" id="qtd" type="number" 
                        min={1} 
                        max={settingsAdmin.max_input_quantity_min} 
                        required 
                        value={quantIdeal}
                        onChange={(e)=> setQuantIdeal(e.target.value)}
                        // onFocus={()=> setUpdateProduct(true)} 
                        />
                    </div>
                    <div className="label--input">
                        <label htmlFor="qtd">Quantidade mínima</label>
                        <input className="input" id="qtd" type="number" 
                        min={0} 
                        max={settingsAdmin.max_input_quantity_min} 
                        required 
                        value={quantMin}
                        onChange={(e)=> setQuantMin(e.target.value)}
                        // onFocus={()=> setUpdateProduct(true)} 
                        />
                    </div>
    
                    <div className="label--input question">
                        <label>Tem data de vencimento?</label>
    
                        <div className="yes--no">
                            <label>
                                <input
                                type="radio"
                                name="expiration"
                                // value={1}
                                onChange={()=> setHasExpiration(1)}
                                checked={hasExpiration == 1}
                                required
                                /> 
                                Sim
                            </label>
                            <label>
                                <input
                                type="radio"
                                name="expiration"
                                // value={0}
                                onChange={()=> setHasExpiration(0)}
                                checked={hasExpiration == 0}
                                required
                                />
                                Não
                            </label>
                        </div>
                    </div>

                    <div className="label--input solicitacao">
                        <label>Marque os tipos de solicitações que este porduto fará parte:</label>
    
                        <div className="input">
                            <label>
                                <input type="checkbox" 
                                name="solicitacao"
                                checked={ordersActive.exit}
                                onChange={()=> setOrdersActive(prev=> ({...prev, exit: !prev.exit}))} 
                                />

                                <span> Saídas</span>
                            </label>

                            <label>
                                <input type="checkbox" 
                                name="solicitacao"
                                checked={ordersActive.reservation}
                                onChange={()=> setOrdersActive(prev=> ({...prev, reservation: !prev.reservation}))}
                                />

                                <span> Empréstimos</span>
                            </label>
                        </div>
                    </div>
    
    
                    <div className="btns">
                        <button className="btn primary" 
                        disabled={loading || loadingSubmit || (name == productSelect.name && quantIdeal == productSelect.quantity_ideal && quantMin == productSelect.quantity_min && hasExpiration == productSelect.expiration_date) || (!ordersActive.exit && !ordersActive.reservation)}
                        >
                            {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                        </button>
    
                        <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                            Cancelar
                        </button>
                    </div>
                </form>
                </>
            ) : (
            optionUpdate == 'sector' ? (
                <>
                <h3>Alterar setor do produto</h3>
    
                <form className="content-window" onSubmit={handleSubmitUpdateProduct}>
                    <p>Abaixo você pode alterar o setor do produto <b>{productSelect.name}</b>.</p>
    
                    <div className="label--input">
                        <label>Setor do produto</label>
                        
                        <div className="radio-group">
                            {loading ? (
                                <p>Carregando...</p>
                            ) : (
                                sectors.map(item=> (
                                    <label key={item.id} title={item.description}>
                                        <input type="radio" 
                                        name="setor"
                                        // value={item.id} 
                                        checked={idSectorProduct == item.id}
                                        onChange={()=> setIdSectorProduct(item.id)}
                                        required
                                        />
                                        {item.name}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
    
                    <div className="btns">
                        <button className="btn primary" disabled={loading || hasError || idSectorProduct == productSelect.fk_category_id || loadingSubmit }>
                            {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                        </button>
    
                        <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                            Cancelar
                        </button>
                    </div>
                </form>
                </>
            ) : (
                <>
                <h3>Editar observação do produto</h3>
    
                <form className="content-window" onSubmit={handleSubmitUpdateProduct}>
                    <p>Abaixo você pode editar a observação do produto <b>{productSelect.name}</b>.</p> 
    
                    <div className="label--input">
                        <label htmlFor="obs">Observação</label>
                        <textarea className="input" id="obs" value={obs} onChange={(e)=> setObs(e.target.value)}></textarea>
                    </div>
    
                    <div className="btns">
                        <button className="btn primary" disabled={loading || hasError || (obs == (productSelect.observation || '')) || loadingSubmit }>
                            {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                        </button>
    
                        <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                            Cancelar
                        </button>
                    </div>
                </form>
                </>
            )
            )}
                            
        </div>
    )        
}