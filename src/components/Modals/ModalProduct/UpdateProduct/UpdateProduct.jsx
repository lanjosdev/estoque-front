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
// import './updateproduct.css';


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
    const [validateSubmit, setValidateSubmit] = useState(false);

    // Dados a ser pré-carregados:
    const [sectors, setSectors] = useState([]);


    // Dados para submiter:
    const [name, setName] = useState(productSelect.name || '');
    const [idSectorProduct, setIdSectorProduct] = useState(productSelect.fk_category_id || null);
    const [quantIdeal, setQuantIdeal] = useState(productSelect.quantity_ideal || '');
    const [quantMin, setQuantMin] = useState(productSelect.quantity_min || '');
    const [obs, setObs] = useState(productSelect.observation || '');
    const [hasExpiration, setHasExpiration] = useState(productSelect.expiration_date);
    // const [listIdsProducts, setlistIdsProducts] = useState(productSelect.components_group.map(item=> item.id));
    const [ordersPermission, setOrdersPermission] = useState({
        exit: productSelect.is_exit,
        reservation: productSelect.is_reservation
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
            const requirements = name.replace(/\s/g, '').length > 0 &&
                idSectorProduct > 0 &&
                quantIdeal >= 1 &&
                quantMin >= 0 &&
                (ordersPermission.exit || ordersPermission.reservation) &&
                hasExpiration !== null;

            const nameHasChange = productSelect.name != name;
            const quantIdealHasChange = productSelect.quantity_ideal != quantIdeal;
            const quantMinHasChange = productSelect.quantity_min != quantMin;
            const orderExitHasChange = productSelect.is_exit != ordersPermission.exit;
            const orderReservationHasChange = productSelect.is_reservation != ordersPermission.reservation;
            const hasExpirationHasChange = productSelect.expiration_date != hasExpiration;

            const hasChange = nameHasChange || quantIdealHasChange || quantMinHasChange || orderExitHasChange || orderReservationHasChange || hasExpirationHasChange;
            // console.log('Requisitos: ', requirements);
            // console.log('Mudança: ', hasChange);
            // console.log(requirements && hasChange);
            setValidateSubmit(requirements && hasChange);          
        }
        checkValidateDatasSubmit();
    }, [productSelect, name, idSectorProduct, quantIdeal, quantMin, ordersPermission, hasExpiration]);



    // SUBMIT UPDATE:
    async function handleSubmitUpdateProduct(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        console.log(name)
        console.log(idSectorProduct)
        console.log(quantIdeal)
        console.log(quantMin)
        console.log(ordersPermission)
        console.log(hasExpiration)
        console.log(obs)

        // Validação:
        const requirements = name.replace(/\s/g, '').length > 0 &&
            idSectorProduct > 0 &&
            quantIdeal >= 1 &&
            quantMin >= 0 &&
            (ordersPermission.exit || ordersPermission.reservation) &&
            hasExpiration !== null;

        if(!requirements) {
            setLoadingSubmit(false);
            toast.warn('Preencha corretamente o(s) campo(s).');
            return;
        }


        // Submit API:
        try {
            const response = await PRODUCT_UPDATE(JSON.parse(tokenCookie), productSelect.id, name, idSectorProduct, quantIdeal, quantMin, obs, hasExpiration, ordersPermission.reservation, ordersPermission.exit);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Alteração salva!');
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
                console.error('Houve algum erro.');
            }

            console.error('DETALHES DO ERRO: ', error);
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

                    <div className="label--input solicitacao">
                        <label>Marque os tipos de solicitações que este produto fará parte:</label>
    
                        <div className="input">
                            <label>
                                <input type="checkbox" 
                                name="solicitacao"
                                checked={ordersPermission.exit}
                                onChange={()=> setOrdersPermission(prev=> ({...prev, exit: !prev.exit}))} 
                                />

                                <span> Saídas</span>
                            </label>

                            <label>
                                <input type="checkbox" 
                                name="solicitacao"
                                checked={ordersPermission.reservation}
                                onChange={()=> setOrdersPermission(prev=> ({...prev, reservation: !prev.reservation}))}
                                />

                                <span> Empréstimos</span>
                            </label>
                        </div>
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

    
    
    
                    <div className="btns">
                        <button className="btn primary" 
                        disabled={loading || loadingSubmit || hasError || !validateSubmit}
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