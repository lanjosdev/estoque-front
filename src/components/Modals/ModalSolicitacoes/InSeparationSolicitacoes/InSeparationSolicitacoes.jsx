// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';

// API:

// Contexts:
// import UserContext from "../../../../contexts/userContext";

// Components:
// import { toast } from "react-toastify";
// import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatToIdCode } from "../../../../utils/formatStrings";

// Assets:

// Estilo:
// import './inseparationsolicitacoes.css';


InSeparationSolicitacoes.propTypes = {
    close: PropTypes.func,
    requestTarget: PropTypes.object
}
export function InSeparationSolicitacoes({ close, requestTarget, setRefreshState }) {
    // Estados do componente:
    // const [loading, setLoading] = useState(true);

    // Logica UI:
    const elementFocusRef = useRef(null);

   


    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // Inicia dando foco em um elemento do WindowModal
        if(elementFocusRef.current) {
            setTimeout(() => { 
                elementFocusRef.current.focus(); 
            }, 100);
        }
    }, []);




    return (
        <div className='Window InSeparationSolicitacoes DetailsSolicitacoes grid'>
            <div className="window_top">
                <h3 className="title_modal">
                    {requestTarget?.order_type == "Saída" ? (
                    <i className="bi bi-box-arrow-left"></i>
                    ) : (
                    <i className="bi bi-calendar-event"></i>
                    )}

                    <span>Mudança de status para: Em separação ({requestTarget?.order_type})</span>
                </h3>

                <p>ID da solicitação: {formatToIdCode(requestTarget.id, 4)}</p>
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

                <div className="label--input">
                    <label>Criando em</label>
                    
                    <p className="input">
                        {requestTarget?.created_at}
                    </p>
                </div>
                <div className="label--input">
                    <label>Finalizado em</label>
                    
                    <p className="input">
                        {requestTarget?.finalized_at || 'Ainda não finalizado'}
                    </p>
                </div>

                <div className="label--input column_full">
                    <label>Status (acompanhamento)</label>
                    
                    <p className="input">
                        {requestTarget?.status} (Linha do tempo)
                    </p>
                </div>

                <div className="label--input column_full">
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
                </div>
                

                {requestTarget?.order_type == "Empréstmo" && (
                <>
                <div className="separator column_full"></div>

                <div className="label--input">
                    <label>Dias solicitado para empréstimo</label>
                    
                    <p className="input">
                        {requestTarget.reservation_days}
                    </p>
                </div>
                <div className="label--input">
                    <label>Status do empréstimo</label>
                    
                    <p className="input">
                        {requestTarget.status !== 'Entregue' ? 'Aguardando aprovação' : requestTarget.status_reservation}
                    </p>
                </div>
                </>
                )}
                
               
            </div>



            <div className="window_bottom">
                <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close}>Fechar</button>
            </div>                      
        </div>
    )        
}