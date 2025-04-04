// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useContext } from 'react';

// API:
import { PRODUCT_GET_PER_PARAMS } from "../../../../API/productApi";
import { EXIT_CREATE_DISCARD } from "../../../../API/exitApi";

// Contexts:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
// import { formatToIdCode } from "../../../../utils/formatStrings";

// Assets:

// Estilo:
import './createexit.css';


CreateExit.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateExit({ close, setReflashState }) {
    const { settingsAdmin } = useContext(UserContext);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [validateSubmit, setValidateSubmit] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Pré carregamento de dados (Products):
    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);


    // Logica UI:
    const [focusSelect, setFocusSelect] = useState(false);
    
    // Dados para submeter:
    const [productSelect, setProductSelect] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [obs, setObs] = useState('');

    const tokenCookie = Cookies.get('tokenEstoque');




    useEffect(()=> {
        async function getAllProducts() {
            setLoading(true);
            console.log('Effect Window CreateExit');

            try {
                setHasError(true);

                const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), 'active=true', pageProducts);
                console.log(response);

                if(response.success) {
                    setProducts(prev => [...prev, ...response.data.data]);
                    setTotalPagesProducts(response.data.last_page);
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
        getAllProducts();
    }, [tokenCookie, pageProducts]);

    useEffect(()=> {
        async function checkValidateDatasSubmit() {
            const requirements = productSelect?.id && quantity > 0 && obs.replace(/\s/g, '').length > 0;

            // console.log('Requisitos: ', requirements);
            // console.log('Mudança: ', hasChange);
            // console.log(requirements && hasChange);
            setValidateSubmit(requirements);          
        }
        checkValidateDatasSubmit();
    }, [productSelect, quantity, obs]);
   


    // function handleChangeModeExit(mode) {
    //     if(mode != exitMode) {
    //         setProductSelect(null);
    //         setInputSelect(null);
    //         setQuantity('');
    //         setDeliveryTo('');
    //         setReason('');
    //         setObs('');
    //         setRefreshComponent('reset');
    //     }

    //     setExitMode(mode);
    // }
    

    // SUBMIT CREATE DISCARD:
    async function handleSubmitCreateExitDiscard(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        console.log(productSelect.id);
        console.log(quantity);
        console.log(obs);
        console.log(validateSubmit);

        // Validação de dados
        if(!validateSubmit) {
            toast.warn('Preencha os campos necessários.');
            return;
        }

        // Submit API
        try {
            const response = await EXIT_CREATE_DISCARD(JSON.parse(tokenCookie), productSelect.id, quantity, obs);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Descarte registrado!');
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
        <div className='Window CreateExit grid'>
            <h3 className="title_modal saida">
                <i className="bi bi-box-arrow-up"></i>
                <span>Registrar descarte no estoque</span>
            </h3>

            {/* <div className="tabs">
                <button 
                className={exitMode == 'default' ? 'tab-ativa' : ''}
                onClick={()=> handleChangeModeExit('default')}
                disabled={loadingSubmit}
                >Saída padrão</button>

                <button 
                className={exitMode == 'discard' ? 'tab-ativa' : ''}
                onClick={()=> handleChangeModeExit('discard')}
                disabled={loadingSubmit}
                >Descarte</button>
            </div> */}


            <SelectAndSearch 
            loading={loading}
            arrayItems={products}
            totalPages={totalPagesProducts}
            pageCurrent={pageProducts}
            setPageCurrent={setPageProducts}
            focusSelect={focusSelect}
            setFocusSelect={setFocusSelect}
            itemSelect={productSelect}
            setItemSelect={setProductSelect}
            />


            {productSelect ? (                
                <form className="content-window" onSubmit={handleSubmitCreateExitDiscard} autoComplete="off">
                    <div className="label--input" disabled={hasError || productSelect?.quantity_stock == 0}>
                        <label htmlFor="qtd">
                            Quantidade (Qtd. em estoque: {productSelect?.quantity_stock})
                        </label>

                        <input id="qtd" className="input" 
                        type="number"
                        value={quantity} 
                        onChange={(e)=> setQuantity(e.target.value)}  
                        min={1} max={productSelect?.quantity_stock > settingsAdmin.max_input_quantity ? settingsAdmin.max_input_quantity : productSelect?.quantity_stock} 
                        onFocus={()=> setFocusSelect(false)} 
                        required
                        disabled={hasError || productSelect?.quantity_stock == 0} 
                        />
                    </div>
    

                    <div className={`more-datas ${(hasError || focusSelect) ? 'none' : ''}`}>
                        <div className="label--input">
                            <label htmlFor="obs">Observação</label>

                            <textarea id="obs" className="input" 
                            value={obs} 
                            onChange={(e)=> setObs(e.target.value)} 
                            required
                            >
                            </textarea>
                        </div>
                    </div>

    
                    <div className="btns">
                        <button 
                        className="btn neutral" 
                        disabled={loading || loadingSubmit || hasError || !validateSubmit}
                        >
                            {loadingSubmit ? 'Registrando...' : 'Registrar descarte'}
                        </button>
    
                        <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                            Cancelar
                        </button>
                    </div>
                </form>    
            ) : (
                <div className="btns">
                    <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                        Cancelar
                    </button>
                </div>
            )}
               
        </div>
    )        
}