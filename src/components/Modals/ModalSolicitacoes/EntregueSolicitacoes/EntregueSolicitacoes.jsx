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
// import './entreguesolicitacoes.css';


EntregueSolicitacoes.propTypes = {
    close: PropTypes.func,
    requestTarget: PropTypes.object,
    setRefreshState: PropTypes.func,
    idStatusSubmit: PropTypes.number
}
export function EntregueSolicitacoes({ close, requestTarget, setRefreshState, idStatusSubmit }) {
    // Estados do componente:
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Logica UI:
    const elementFocusRef = useRef(null);
    const [productsDelivered, setProductsDelivered] = useState(false);
   

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // Inicia dando foco em um elemento do WindowModal
        if(elementFocusRef.current) {
            setTimeout(() => { 
                elementFocusRef.current.focus(); 
            }, 100);
        }
    }, []);



    // SUBMIT UPDATE STATUS API:
    async function handleSubmitUpdateStatus(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        console.log('id_solicitacao:', requestTarget.id);
        console.log('id_status_update:', idStatusSubmit);

        // // Validação de dados
        // if(!validateSubmit) {
        //     setLoadingSubmit(false);
        //     toast.warn('Preencha os campos necessários.');
        //     return;
        // }

        // Submit API
        try {
            const response = await ORDER_UPDATE_STATUS(JSON.parse(tokenCookie), requestTarget.id, idStatusSubmit);
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
        <div className='Window EntregueSolicitacoes DetailsSolicitacoes grid'>
            <div className="window_top">
                <h3 className="title_modal">
                    {/* {requestTarget?.order_type == "Saída" ? (
                    <i className="bi bi-box-arrow-left"></i>
                    ) : (
                    <i className="bi bi-calendar-event"></i>
                    )} */}

                    <span>Mudança de status para: "Entregue"</span>
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
                    <label>Entregue para</label>
                    
                    <p className="input read">
                        {requestTarget?.delivery_to}
                    </p>
                </div>

                <div className="label--input">
                    <label>Dias de empréstimos</label>
                    
                    <p className="input read">
                        {requestTarget?.reservation_days}
                    </p>
                </div>


                <div className="label--input column_full">
                    <label>Produtos a serem entregues ({requestTarget?.products.length} {requestTarget?.products.length > 1 ? 'itens' : 'item'})</label>

                    <div className="input products">
                        <div className="products_title">
                            <span className="id_product">ID</span>
                            <span className="name_product">Produto</span>
                            <span className="qtd_product">Qtd</span>
                        </div>

                        {/* <div className="products_list"> */}
                        {requestTarget?.products.map(item=> (
                        <div className="products_item" key={item.id}>
                            <span className="id_product">{formatToIdCode(item.id)}</span>
                            <span className="name_product">{item.name}</span>
                            <span className="qtd_product">{item.quantity}</span>
                        </div>
                        ))}
                        {/* </div> */}
                    </div>

                    <label className="confirm_check">
                        <input type="checkbox" checked={productsDelivered} onChange={()=> setProductsDelivered(!productsDelivered)} />
                        <span className="checkmark">
                            <i className="bi bi-check"></i>
                        </span>

                        <span className="text"> Marque se os produtos foram devidamente entregues ao destinatário <b>{requestTarget?.delivery_to}</b>, e confirme clicando em <b>"Produtos entregues"</b>.</span>
                    </label>
                </div>
            </div>



            <div className="window_bottom">
                <button className="btn primary" type="button" onClick={handleSubmitUpdateStatus} disabled={!productsDelivered || loadingSubmit}>
                    {loadingSubmit && (
                        <div className="loader"></div>
                    )}

                    <span> Produtos entregues</span>
                </button>

                <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close}>Cancelar</button>
            </div>                       
        </div>
    )        
}