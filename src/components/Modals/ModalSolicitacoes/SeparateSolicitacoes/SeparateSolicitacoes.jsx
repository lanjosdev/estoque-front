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
// import './separatesolicitacoes.css';


SeparateSolicitacoes.propTypes = {
    close: PropTypes.func,
    requestTarget: PropTypes.object,
    setRefreshState: PropTypes.func,
    idStatusSubmit: PropTypes.number
}
export function SeparateSolicitacoes({ close, requestTarget, setRefreshState, idStatusSubmit }) {
    // Estados do componente:
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Logica UI:
    const elementFocusRef = useRef(null);
    const [separateProducts, setSeparateProducts] = useState(false);
   

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
        <div className='Window SeparateSolicitacoes DetailsSolicitacoes grid'>
            <div className="window_top">
                <h3 className="title_modal">
                    {/* {requestTarget?.order_type == "Saída" ? (
                    <i className="bi bi-box-arrow-left"></i>
                    ) : (
                    <i className="bi bi-calendar-event"></i>
                    )} */}

                    <span>Mudança de status para: "Separado"</span>
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

                    <p>ID da solicitação: {formatToIdCode(requestTarget.id, 4)}</p>
                </div>
            </div>


            <div className="window_content">
                <div className="label--input">
                    <label>Solicitante</label>
                    
                    <p className="input">
                        {requestTarget?.user_solicited.name}
                    </p>
                </div>
                <div className="label--input">
                    <label>Será entregue para</label>
                    
                    <p className="input">
                        {requestTarget?.delivery_to}
                    </p>
                </div>


                <div className="label--input column_full">
                    {/* <p>:</p> */}

                    <label>Produtos solicitados</label>

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
                        <input type="checkbox" checked={separateProducts} onChange={()=> setSeparateProducts(!separateProducts)} />
                        <span className="checkmark">
                            <i className="bi bi-check"></i>
                        </span>

                        <span className="text"> Marque se os produtos foram devidamente separados, e confirme o avanço do status clicando em <b>"Produtos separados"</b>.</span>
                    </label>
                </div>
            </div>



            <div className="window_bottom">
                <button className="btn primary" type="button" onClick={handleSubmitUpdateStatus} disabled={!separateProducts || loadingSubmit}>
                    {loadingSubmit && (
                        <div className="loader"></div>
                    )}

                    <span> Produtos separados</span>
                </button>

                <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close}>Cancelar</button>
            </div>                   
        </div>
    )        
}