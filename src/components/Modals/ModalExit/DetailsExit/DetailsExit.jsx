// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';

// API:
// import { PRODUCT_GET_PER_PARAMS } from "../../../../API/productApi";
// import { STORAGE_GET_PER_PARAMS } from "../../../../API/storageApi";
// import { INPUT_UPDATE } from "../../../../API/inputApi";

// Contexts:
// import UserContext from "../../../../contexts/userContext";

// Components:
// import { toast } from "react-toastify";
// import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatToIdCode } from "../../../../utils/formatStrings";
// import { formatMinDateCalender, formatDateAmerican } from "../../../../utils/formatDate";

// Assets:

// Estilo:
// import './detailsinput.css';


DetailsExit.propTypes = {
    close: PropTypes.func,
    exitSelect: PropTypes.object
}
export function DetailsExit({ close, exitSelect }) {
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
        <div className='Window DetailsExit DetailsInput grid'>
            <div className="window_top">
                <h3 className="title_modal saida">
                    {/* <i className="bi bi-arrow-down-circle-fill"></i> */}
                    <i className="bi bi-info-circle"></i>
                    <span> Detalhes da saída <small>(ID: {formatToIdCode(exitSelect.id, 4)})</small></span>
                </h3>

                {exitSelect.sub_type && (
                <div className="sub_type">
                    <span className={`tag ${exitSelect.sub_type == "DESCARTE" ? 'danger' : ''}`}>
                        {/* {exitSelect.sub_type} */}
                        Descarte
                    </span>
                </div>
                )}
            </div>


            <div className="window_content">
                <div className="label--input">
                    <label>Produto</label>
                    
                    <p className="input">
                        {exitSelect?.product_name}
                    </p>
                </div>
                <div className="label--input">
                    <label>Setor</label>

                    <p className="input">
                        {exitSelect?.category_name}
                    </p>
                </div>

                <div className="label--input">
                    <label>Quantidade</label>

                    <p className="input">
                        -{exitSelect?.quantity}
                    </p>
                </div>
                <div className="label--input">
                    <label>Armazenado em</label>

                    <p className="input">
                        {exitSelect?.name_storage_location}
                    </p>
                </div>

                <div className="label--input">
                    <label>Feito por</label>

                    <p className="input">
                        {exitSelect?.name_user}
                    </p>
                </div>
                <div className="label--input">
                    <label>Registrado em</label>

                    <p className="input">
                        {exitSelect?.created_at}
                    </p>
                </div>

                <div className="label--input column_full">
                    <label>Email do usuário</label>

                    <p className="input">
                        {exitSelect?.email_user}
                    </p>
                </div>

                <div className="label--input column_full">
                    <label>Observação</label>

                    <p className="input">
                        {exitSelect?.observation}
                    </p>
                </div>
                

                {exitSelect?.expiration_date && (
                <>
                <div className="separator column_full"></div>

                <div className="label--input">
                    <label>Data de fabricação</label>

                    <p className="input">
                        {exitSelect?.date_of_manufacture}
                    </p>
                </div>
                <div className="label--input">
                    <label>Data de vencimento</label>

                    <p className="input">
                        {exitSelect?.expiration_date}
                    </p>
                </div>
                
                <div className="label--input column_full">
                    <label>Dias restantes para o alerta / Dias antes do alerta</label>

                    <p className="input">
                        {exitSelect?.days_for_alerts} / {exitSelect?.alert}
                    </p>
                </div>                                        
                </>
                )}
            </div>



            <div className="window_bottom btns">
                <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close}>Fechar</button>
            </div>                      
        </div>
    )        
}