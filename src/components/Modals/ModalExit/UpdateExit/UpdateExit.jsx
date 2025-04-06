// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';

// API:
// import { PRODUCT_GET_PER_PARAMS } from "../../../../API/productApi";
import { EXIT_UPDATE_DISCARD } from "../../../../API/exitApi";

// Contexts:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
// import { formatToIdCode } from "../../../../utils/formatStrings";

// Assets:

// Estilo:
import './updateexit.css';


UpdateExit.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    exitSelect: PropTypes.object
}
export function UpdateExit({ close, setReflashState, exitSelect }) {
    const { settingsAdmin } = useContext(UserContext);
    // Estados do componente:
    const elementFocusRef = useRef(null);
    // const [loading, setLoading] = useState(true);
    // const [hasError, setHasError] = useState(true);
    const [validateSubmit, setValidateSubmit] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Pré carregamento de dados:
    // const [products, setProducts] = useState([]);
    // const [pageProducts, setPageProducts] = useState(1);
    // const [totalPagesProducts, setTotalPagesProducts] = useState(0);


    // Logica UI:
    const [focusSelect, setFocusSelect] = useState(false);

    // Dados para submeter:
    const [productSelect, setProductSelect] = useState(exitSelect.fk_product_id ? {
        id: exitSelect.fk_product_id, 
        name: exitSelect.product_name,
        expiration_date: exitSelect.fk_input_id ? 1 : 0
    } : null);
    const [quantity, setQuantity] = useState(exitSelect.quantity || '');
    const [obs, setObs] = useState(exitSelect.observation || '');


    const tokenCookie = Cookies.get('tokenEstoque');




    useEffect(()=> {
        // Inicia dando foco em um elemento do WindowModal
        if(elementFocusRef.current) {
            setTimeout(() => { 
                elementFocusRef.current.focus(); 
            }, 100);
        }
    }, []);

    useEffect(()=> {
        async function checkValidateDatasSubmit() {
            const requirements = productSelect?.id && quantity > 0 && obs.replace(/\s/g, '').length > 0;

            const quantHasChange = exitSelect?.quantity != quantity;
            const obsHasChange = exitSelect?.observation != obs;

            const hasChange = quantHasChange || obsHasChange;
            // console.log('Requisitos: ', requirements);
            // console.log('Mudança: ', hasChange);
            // console.log(requirements && hasChange);
            setValidateSubmit(requirements && hasChange);          
        }
        checkValidateDatasSubmit();
    }, [productSelect, exitSelect, quantity, obs]);
    // useEffect(()=> {
    //     async function getAllProducts() {
    //         setLoading(true);
    //         console.log('Effect Window UpdateExit');

    //         try {
    //             const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), 'active=true&is_group=0', pageProducts);
    //             console.log(response);

    //             if(response.success) {
    //                 setProducts(prev => [...prev, ...response.data.data]);
    //                 setTotalPagesProducts(response.data.last_page);
    //                 setHasError(false);
    //             }
    //             else if(response.success == false) {
    //                 console.warn(response.message);
    //                 toast.error(response.message);
    //             }
    //             else {
    //                 toast.error('Erro inesperado.');
    //             }
    //         }
    //         catch(error) {
    //             if(error?.response?.data?.message == 'Unauthenticated.') {
    //                 console.error('Requisição não autenticada.');
    //             }
    //             else {
    //                 console.error('Houve algum erro.');
    //             }

    //             console.error('DETALHES DO ERRO:', error);
    //         }
            
    //         setLoading(false);
    //     }
    //     getAllProducts();
    // }, [tokenCookie, pageProducts]);



    
    
    // SUBMIT UPDATE DESCARTE:
    async function handleSubmitUpdateExitDiscard(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        // const idInput = inputPreview.id || null; 
        console.log(productSelect.id);
        console.log(quantity);
        console.log(obs);

        // Validação de dados
        const requirements = productSelect?.id && quantity > 0 && obs.replace(/\s/g, '').length > 0;
        if(!requirements) {
            toast.warn('Preencha os campos corretamente.');
            return;
        }

        // Submit API:
        try {
            const response = await EXIT_UPDATE_DISCARD(JSON.parse(tokenCookie), exitSelect.id, productSelect.id, quantity, obs);
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
        <div className='Window UpdateExit CreateExit grid'>
            <h3 className="title_modal saida">
                <i className="bi bi-box-arrow-up"></i>
                <span>Editar descarte do estoque</span>
            </h3>

            <div className="top-window">
                <p>Abaixo você pode editar os dados do descarte em questão.</p>
                
                <SelectAndSearch
                // loading={loading}
                arrayItems={[]}
                // totalPages={totalPagesProducts}
                // pageCurrent={pageProducts}
                // setPageCurrent={setPageProducts}
                focusSelect={focusSelect}
                setFocusSelect={setFocusSelect}
                itemSelect={productSelect}
                setItemSelect={setProductSelect}
                defaultSearch={productSelect.name}
                disabledComponent={true}
                />
            </div>

            {productSelect ? (
                <form className="content-window" onSubmit={handleSubmitUpdateExitDiscard} autoComplete="off">
                    <div className="label--input">
                        <label htmlFor="qtd">Quantidade</label>

                        <input ref={elementFocusRef} id="qtd" className="input" 
                        value={quantity} 
                        onChange={(e)=> setQuantity(e.target.value)}  
                        type="number" 
                        min={1} max={settingsAdmin.max_input_quantity} 
                        onFocus={()=> setFocusSelect(false)} 
                        required 
                        />
                    </div>
                    
                    <div className="label--input">
                        <label htmlFor="obs">Observação</label>

                        <textarea id="obs" className="input" 
                        value={obs} 
                        onChange={(e)=> setObs(e.target.value)} 
                        required
                        >
                        </textarea>
                    </div>

                    
                    <div className="btns">
                        <button 
                        className="btn neutral" 
                        disabled={loadingSubmit || !validateSubmit}
                        >
                            {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
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