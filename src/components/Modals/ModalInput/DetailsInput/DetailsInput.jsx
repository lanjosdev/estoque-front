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
import './detailsinput.css';


DetailsInput.propTypes = {
    close: PropTypes.func,
    inputSelect: PropTypes.object
}
export function DetailsInput({ close, inputSelect }) {
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

    // useEffect(()=> {
    //     async function getAllProductsActives() {
    //         console.log('Effect Window UpdateInput');

    //         try {
    //             setLoading(true);
    //             setHasError(true);
                
    //             const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), 'active=true', pageProducts);
    //             console.log(response);

    //             if(response.success) {
    //                 setProducts(prev => [...prev, ...response.data.data]);
    //                 setTotalPagesProducts(response.data.last_page);
    //                 setHasError(false);
    //             }
    //             else if(response.success == false) {
    //                 toast.error(response.message);
    //             }
    //             else {
    //                 toast.error('Erro inesperado.');
    //             }
    //         }
    //         catch(error) {
    //             console.error('DEU ERRO:', error);

    //             if(error?.response?.data?.message == 'Unauthenticated.') {
    //                 toast.error('Requisição não autenticada.');
    //             }
    //             else {
    //                 toast.error('Houve algum erro.');
    //             }
    //         }

    //         setLoading(false);
    //     }
    //     getAllProductsActives();
    // }, [tokenCookie, pageProducts]);

    // useEffect(()=> {
    //     async function getAllStoragesActives() {
    //         try {
    //             setLoading(true);
    //             setHasError(true);
                
    //             const response = await STORAGE_GET_PER_PARAMS(JSON.parse(tokenCookie), 'active=true', pageStorages);
    //             console.log(response);

    //             if(response.success) {
    //                 setStorages(prev => [...prev, ...response.data.data]);
    //                 setTotalPagesStorages(response.data.last_page);
    //                 setHasError(false);
    //             }
    //             else if(response.success == false) {
    //                 console.warn(response.message);
    //             }
    //             else {
    //                 toast.error('Erro inesperado.');
    //             }
    //         }
    //         catch(error) {
    //             console.error('DEU ERRO:', error);

    //             if(error?.response?.data?.message == 'Unauthenticated.') {
    //                 console.error('Requisição não autenticada.');
    //             }
    //             else {
    //                 toast.error('Houve algum erro.');
    //             }
    //         }

    //         setLoading(false);
    //     }
    //     getAllStoragesActives();
    // }, [tokenCookie, pageStorages]);



    return (
        <div className='Window DetailsInput grid'>
            <div className="window_top">
                <h3 className="title_modal entrada">
                    {/* <i className="bi bi-arrow-down-circle-fill"></i> */}
                    <i className="bi bi-info-circle"></i>
                    <span> Detalhes da entrada <small>(ID: {formatToIdCode(inputSelect.id, 4)})</small></span>
                </h3>

                {inputSelect.sub_type && (
                <div className="sub_type">
                    <span className={`tag ${inputSelect.sub_type == "DESCARTE" ? 'danger' : ''}`}>
                        {/* {inputSelect.sub_type} */}
                        Empréstimo (retorno)
                    </span>
                </div>
                )}
            </div>


            <div className="window_content">
                <div className="label--input">
                    <label>Produto</label>
                    
                    <p className="input">
                        {inputSelect?.product_name}
                    </p>
                </div>
                <div className="label--input">
                    <label>Setor</label>

                    <p className="input">
                        {inputSelect?.category_name}
                    </p>
                </div>

                <div className="label--input">
                    <label>Quantidade</label>

                    <p className="input">
                        +{inputSelect.quantity}
                    </p>
                </div>
                <div className="label--input">
                    <label>Armazenado em</label>

                    <p className="input">
                        {inputSelect.name_storage_location}
                    </p>
                </div>

                <div className="label--input">
                    <label>Feito por</label>

                    <p className="input">
                        {inputSelect.name_user}
                    </p>
                </div>
                <div className="label--input">
                    <label>Registrado em</label>

                    <p className="input">
                        {inputSelect.created_at}
                    </p>
                </div>

                <div className="label--input column_full">
                    <label>Email do usuário</label>

                    <p className="input">
                        {inputSelect.email_user}
                    </p>
                </div>
                

                {inputSelect?.expiration_date && (
                <>
                <div className="separator column_full"></div>

                <div className="label--input">
                    <label>Data de fabricação</label>

                    <p className="input">
                        {inputSelect.date_of_manufacture}
                    </p>
                </div>
                <div className="label--input">
                    <label>Data de vencimento</label>

                    <p className="input">
                        {inputSelect.expiration_date}
                    </p>
                </div>
                
                <div className="label--input column_full">
                    <label>Dias restantes para o alerta / Dias antes do alerta</label>

                    <p className="input">
                        {inputSelect.days_for_alerts} / {inputSelect.alert}
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