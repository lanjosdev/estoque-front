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
import './detailssolicitacoes.css';


DetailsSolicitacoes.propTypes = {
    close: PropTypes.func,
    requestTarget: PropTypes.object
}
export function DetailsSolicitacoes({ close, requestTarget }) {
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
        <div className='Window DetailsSolicitacoes grid'>
            <div className="window_top">
                <h3 className="title_modal">
                    {requestTarget?.order_type == "Saída" ? (
                    <i className="bi bi-box-arrow-left"></i>
                    ) : (
                    <i className="bi bi-calendar-event"></i>
                    )}

                    <span>Detalhes da Solicitação</span>
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
                    <label>Será entregue para</label>
                    
                    <p className="input read">
                        {requestTarget?.delivery_to}
                    </p>
                </div>

                <div className="label--input">
                    <label>Criado em</label>
                    
                    <p className="input read">
                        {requestTarget?.created_at}
                    </p>
                </div>
                <div className="label--input">
                    <label>Finalizado em</label>
                    
                    <p className="input read">
                        {requestTarget?.finalized_at || 'Em andamento'}
                    </p>
                </div>

                <div className="label--input column_full">
                    <label>Status</label>
                    
                    <p className="input timeline read">
                        {requestTarget?.status}
                    </p>
                </div>

                <div className="label--input column_full">
                    <label>Produtos da solicitação ({requestTarget?.products.length} {requestTarget?.products.length > 1 ? 'itens' : 'item'})</label>
                    
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
                

                {requestTarget?.order_type == "Empréstimo" && (
                <>
                <div className="separator column_full"></div>

                <div className="label--input">
                    <label>Dias solicitado para empréstimo</label>
                    
                    <p className="input read">
                        {requestTarget.reservation_days || 'Tempo não determinado'}
                    </p>
                </div>
                <div className="label--input">
                    <label>Status do empréstimo</label>
                    
                    <p className="input read">
                        {requestTarget.status_reservation || 'Aguardando a entrega'}
                    </p>
                </div>

                {!requestTarget?.finalized_at && (
                <div className="label--input">
                    <label>Data para devolução</label>
                    
                    <p className="input read">
                        {requestTarget.return_date || 'Aguardando a entrega'}
                    </p>
                </div>
                )}
                
                </>
                )}
                
               
            </div>



            <div className="window_bottom">
                <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close}>Fechar</button>
            </div>                      
        </div>
    )        
}