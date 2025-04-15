// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from 'react';

// API:
import { ORDER_UPDATE_STATUS } from "../../../../API/orderApi";

// Contexts:
// import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
// import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatToIdCode } from "../../../../utils/formatStrings";

// Assets:

// Estilo:
import './devolvidosolicitacoes.css';


DevolvidoSolicitacoes.propTypes = {
    close: PropTypes.func,
    requestTarget: PropTypes.object,
    setRefreshState: PropTypes.func,
    idStatusSubmit: PropTypes.number
}
export function DevolvidoSolicitacoes({ close, requestTarget, setRefreshState, idStatusSubmit }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [validateSubmit, setValidateSubmit] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Logica UI:
    const elementFocusRef = useRef(null);

    const [productsList, setProductsList] = useState([]);
    const [productsOk, setProductsOk] = useState(false);
   

    const tokenCookie = Cookies.get('tokenEstoque');





    useEffect(()=> {
        console.log(idStatusSubmit)
        // Inicia dando foco em um elemento do WindowModal
        if(elementFocusRef.current) {
            setTimeout(() => { 
                elementFocusRef.current.focus(); 
            }, 100);
        }
    }, [idStatusSubmit]);


    useEffect(()=> {
        async function organizeProductsList() {
            setLoading(true);

            try {
                setHasError(true);

                const newProductsList = requestTarget.products.map(item=> ({
                    id_product: item.id,
                    name_product: item.name,
                    pending: 0,
                    quantity_return: item.quantity,
                    observation: ''
                }));
                console.log(newProductsList) 

                setProductsList(newProductsList);
                setHasError(false);
            }
            catch(error) {
                console.error('DETALHES DO ERRO:', error);
            }

            setLoading(false);           
        }
        organizeProductsList();
    }, [requestTarget]);


    useEffect(()=> {
        async function checkValidateSubmitDatas() {
            const pendingQtdNotOk = productsList.some((item, idx)=> (
                item.pending == 1 && 
                (item.quantity_return == requestTarget.products[idx].quantity || 
                item.quantity_return === '')
            ));
            const pendingObsNotOk = productsList.some(item=> (item.pending == 1 && item.observation.replace(/\s+/g, '').length == 0));

            console.log(!pendingQtdNotOk && !pendingObsNotOk)
            setValidateSubmit(!pendingQtdNotOk && !pendingObsNotOk);          
        }
        checkValidateSubmitDatas();
    }, [productsList, requestTarget]);







    function handleChangeCheckbox(idTarget) {
        if(productsOk) {
            setProductsOk(false);
        }

        // Valores iniciais/reset a cada change
        const newProductsList = productsList.map((item, idx)=> item.id_product == idTarget ? {
            ...item, 
            pending: item.pending ? 0 : 1,
            quantity_return: requestTarget.products[idx].quantity,
            observation: ''
        } : item);

        console.log(newProductsList)
        setProductsList(newProductsList);
    }

    function handleChangeQtd(idxTarget, newQuantity) { 
        console.log(newQuantity);
        const newQtdInt = parseInt(newQuantity);
        const newProductsList = [...productsList];

        if((newQuantity === `${parseInt(newQuantity)}`) && 
        (newQtdInt >= 0 && newQtdInt <= requestTarget.products[idxTarget].quantity)) {
            newProductsList[idxTarget].quantity_return = newQtdInt;
            console.log(newProductsList)

            setProductsList(newProductsList);
            return;
        }


        if(parseInt(newQuantity) === 0 && newQuantity == '0') {
            newProductsList[idxTarget].quantity_return = 0;
            console.log(newProductsList)

            setProductsList(newProductsList);
        }
        else {
            newProductsList[idxTarget].quantity_return = '';
            console.log(newProductsList)

            setProductsList(newProductsList);
        }
        // if(!(parseInt(newQuantity) === 0)) {
        //     newProductsList[idxTarget].quantity_return = '';
        //     console.log(newProductsList)

        //     setProductsList(newProductsList);
        //     return;
        // }
    }

    function handleChangeObs(idxTarget, newObservation) { 
        // const newObs = newObservation;  
        // console.log(newObs)
        
        // if(newQtd >= 0 && newQtd <= requestTarget.products[idxTarget].quantity) {
        const newProductsList = [...productsList];
        newProductsList[idxTarget].observation = newObservation;
        console.log(newProductsList)

        setProductsList(newProductsList);
        // }
    }



    // SUBMIT UPDATE STATUS API:
    async function handleSubmitUpdateStatus(e) {
        e.preventDefault();
        setLoadingSubmit(true);

        const infoReq = productsList.map(item=> ({
            id_product: item.id_product,
            pending: item.pending,
            observation: item.observation || null,
            quantity_return: item.quantity_return
        }));
        console.log('id_solicitacao:', requestTarget.id);
        console.log('id_status_update:', idStatusSubmit);
        console.log('info:', infoReq);

        // // Validação de dados
        // if(!validateSubmit) {
        //     setLoadingSubmit(false);
        //     toast.warn('Preencha os campos necessários.');
        //     return;
        // }

        // Submit API
        try {
            const response = await ORDER_UPDATE_STATUS(JSON.parse(tokenCookie), requestTarget.id, idStatusSubmit, null, infoReq);
            console.log(response);  

            if(response.success) {
                close();
                setRefreshState(prev => !prev);
                toast.success('Status atualizado!');
            }
            else if(response.success == false) {
                console.warn(response.message);
                toast.warn(response.message);
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
        <div className='Window DevolvidoSolicitacoes DetailsSolicitacoes grid'>
            <div className="window_top">
                <h3 className="title_modal">
                    {/* {requestTarget?.order_type == "Saída" ? (
                    <i className="bi bi-box-arrow-left"></i>
                    ) : (
                    <i className="bi bi-calendar-event"></i>
                    )} */}

                    <span>Mudança de status para: "Devolvido"</span>
                </h3>

                <div className="subtitle_modal">
                    <div>
                        <span>Tipo: </span>
                        
                        <span className={`badge ${requestTarget.status_reservation == 'Em atraso' ? 'alert' : ''}`}>
                            {requestTarget.order_type == "Saída" ? (
                            <i className="bi bi-box-arrow-left"></i>
                            ) : (
                            <i className="bi bi-calendar-event"></i>
                            )}
                            <span> {requestTarget.order_type}</span>
                        </span>
                    </div>

                    <p>ID da solicitação: <span className="txt bold">{formatToIdCode(requestTarget.id, 4)}</span></p>
                </div>
            </div>


            <div className="window_content">
                <div className="label--input">
                    <label>Solicitante</label>
                    
                    <p className="input read">
                        {requestTarget?.user_solicited.name}
                    </p>
                </div>

                <div className="label--input">
                    <label>Foi entregue para</label>
                    
                    <p className="input read">
                        {requestTarget?.delivery_to}
                    </p>
                </div>




                <div className="label--input column_full">
                    <label>
                        Produtos que devem ser devolvidos ({requestTarget?.products.length} {requestTarget?.products.length > 1 ? 'itens' : 'item'})
                    </label>

                    <div className="input products" disabled={loading}>
                        {loading ? (
                            <p className='feedback_content'>Carregando produtos...</p>
                        ) : (
                            hasError ? (
                                <p className='feedback_content'>Erro ao carregar produtos.</p>
                            ) : (
                                <>
                                <div className="products_title">
                                    <span className="id_product">ID</span>
                                    <span className="name_product">Produto</span>
                                    <span className="qtd_product">Qtd</span>
                                    <span className="pendente">Pendente</span>
                                </div>

                                {/* <div className="products_list"> */}
                                {productsList.map((item, idx)=> (
                                <div className="products_item" key={item.id_product}>
                                    <span className="id_product">
                                        {formatToIdCode(item.id_product)}
                                    </span>

                                    <span className="name_product">
                                        {item.name_product}
                                    </span>

                                    <span className="qtd_product">
                                        {item.pending ? (
                                            <input type="number" className="qtd_input"
                                            min={0} max={requestTarget.products[idx].quantity} 
                                            value={item.quantity_return} 
                                            onChange={(e)=> handleChangeQtd(idx, e.target.value)}
                                            />
                                        ) : (
                                            <span className="qtd_value">
                                                {item.quantity_return}
                                            </span>
                                        )}
                                    </span>

                                    <span className="pendente">
                                        <input type="checkbox" 
                                        checked={item.pending} 
                                        onChange={()=> handleChangeCheckbox(item.id_product)} 
                                        />
                                    </span>
                                    
                                    {item.pending ? (
                                    <div className="obs_product">
                                        {/* <label htmlFor="">OBS</label> */}
                                        <textarea placeholder="Digite o motivo da pendência" 
                                        value={item.observation}
                                        onChange={(e)=> handleChangeObs(idx, e.target.value)}
                                        ></textarea>
                                    </div>
                                    ) : null}
                                </div>
                                ))}
                                {/* </div> */}
                                </>
                            )
                        )}
                    </div>


                    

                    <small className="obs">
                        Obs: Caso tenha algum produto irregular, marque como <b>"pendente"</b> e edite a quantidade devolvida e o motivo.
                    </small>

                    {!productsList.some(item=> item.pending == 1) && (
                    <>
                    <span className="ou">OU</span>

                    <label className="confirm_check column_full">
                        <input type="checkbox" checked={productsOk} onChange={()=> setProductsOk(!productsOk)} disabled={loading || hasError || loadingSubmit} />
                        <span className="checkmark">
                            <i className="bi bi-check"></i>
                        </span>

                        <span className="text"> Marque se está tudo certo com a devolução dos produstos.</span>
                    </label>
                    </>
                    )}
                </div>
            </div>





            <div className="window_bottom">
                {productsOk && (
                    <button className="btn primary" 
                    type="button" 
                    onClick={handleSubmitUpdateStatus} 
                    disabled={loading || hasError || loadingSubmit}
                    >
                        {loadingSubmit && (
                            <div className="loader"></div>
                        )}

                        {/* <span> {productsList.some(item=> item.pending == 1) ? 'Devolução com pendência(s)' : 'Tudo certo com a devolução'}</span> */}
                        <span> Tudo certo com a devolução</span>
                    </button>
                )}

                {(!productsOk && productsList.some(item=> item.pending == 1)) && (
                    <button className="btn primary" 
                    type="button" 
                    onClick={handleSubmitUpdateStatus} 
                    disabled={loading || hasError || loadingSubmit || !validateSubmit}
                    >
                        {loadingSubmit && (
                            <div className="loader"></div>
                        )}

                        {/* <span> {productsList.some(item=> item.pending == 1) ? 'Devolução com pendência(s)' : 'Tudo certo com a devolução'}</span> */}
                        <span> Devolução com pendência(s)</span>
                    </button>
                )}
                

                <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close}>Cancelar</button>
            </div>                       
        </div>
    )        
}