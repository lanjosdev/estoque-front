// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API:
import { ORDER_CREATE } from "../../../API/orderApi";

// Components:
import { toast } from "react-toastify";

// Utils:
// import { formatarCasasNumero } from '../../utils/formatNumbers'

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './previewcart.css';


// PreviewCart.propTypes = {
//     // closeCart: PropTypes.func.isRequired,
//     // showMsgFeedback: PropTypes.string,
//     // setShowMsgFeedback: PropTypes.func,
//     // numbersCarrinho: PropTypes.array,
//     // setNumbersCarrinho: PropTypes.func,
//     // subtotalCarrinho: PropTypes.any,
//     // setNumbersSelecionados: PropTypes.func,
//     // setNumbers: PropTypes.func,
//     // loadingPai: PropTypes.bool
// }
PreviewCart.propTypes = {
    close: PropTypes.func,
    typeRequest: PropTypes.string,
    listProductsQuantities: PropTypes.array,
    setListProductsQuantities: PropTypes.func,
    handleUpdateListProducts: PropTypes.func
}
export function PreviewCart({ close, typeRequest, listProductsQuantities, setListProductsQuantities, handleUpdateListProducts }) {
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(false);
    // const [hasError, setHasError] = useState(true);
    // const [validateSubmit, setValidateSubmit] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Logica da UI
    const [outherPerson, setOutherPerson] = useState(false);

    // Dados a subimeter
    const [nameDeliveryTo, setNameDeliveryTo] = useState(null);
    const [daysReservation, setDaysReservation] = useState(null);

    const [daysUndetermined, setDaysUndetermined] = useState(false);

    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        // function initialComponent() {
            const handleKeyDown = (event)=> {
                if(event.key === 'Escape') {
                  close();
                }
            };
          
            document.addEventListener('keydown', handleKeyDown);
          
            // Remove o event listener ao desmontar o componente ou fechar o modal
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        // }
        // initialComponent();
    }, [close]);


    // useEffect(()=> {
    //     async function validateSubmitDatas() {
    //         // const requirements = reason.replace(/\s+/g, '').length > 0 
    //         //     && obs.replace(/\s/g, '').length > 0 
    //         //     && quantity > 0 
    //         //     && deliveryTo.replace(/\s+/g, '').length > 0;

    //         // const nameHasChange = profileDetails.name != name;
    //         // const dateBirthHasChange = profileDetails.birth_data != dateBirth;
    //         // const phoneHasChange = profileDetails.phone != phone;
    //         // const genderHasChange = profileDetails.gender_id != genderSelect.id;
    //         // const genderOptionalHasChange = profileDetails.sub_gender_id != genderOptionalSelect?.id;
    //         // const sexualityHasChange = profileDetails.sexuality_id != sexualitySelect.id;
    //         // const aboutMeHasChange = profileDetails.about_me != aboutMe;

    //         // setValidateSubmit(requirements && (nameHasChange || dateBirthHasChange || phoneHasChange || genderHasChange || genderOptionalHasChange || sexualityHasChange || aboutMeHasChange));          
    //         // setValidateSubmit(requirements);          
    //     }
    //     validateSubmitDatas();
    // }, []);
    



    function handleChangeQuantityProduct(productTarget, newValue) {
        const newQuantity = parseInt(newValue || '0');
        // console.log(newQuantity)

        if(newQuantity >= 0 && newQuantity <= productTarget.quantity_stock) {
            const newListProductsQuantities = listProductsQuantities.map((product)=> 
                product.id == productTarget.id ? { ...product, quantity: newQuantity } : product
            );
    
            setListProductsQuantities(newListProductsQuantities);
        }
        
        // OLD
        // if(newQuantity >= 0 && newQuantity <= itemTarget.quantity_stock) {
        //     const newProductsGroup = productsGroup.map((product)=> 
        //         product.id == itemTarget.id ? { ...product, quantity: newQuantity } : product
        //     );

        //     setProductsGroup(newProductsGroup);
        // }
    }


    // SUBMIT API:
    async function handleSubmitCreateRequest(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        const idTypeRequest = typeRequest == 'Saída' ? 1 : 2;
        const productQuantities = listProductsQuantities.map((product)=> (
            {
                product_id: product.id,
                quantity: product.quantity
            }
        ));
        console.log(idTypeRequest);
        console.log(productQuantities);
        console.log(nameDeliveryTo);
        console.log(daysReservation);
        
        
        try {
            const response = await ORDER_CREATE(JSON.parse(tokenCookie), idTypeRequest, productQuantities, nameDeliveryTo, daysReservation);
            console.log(response);  

            if(response.success) {
                toast.success('Solicitação enviada com sucesso!');
                navigate('/minhas-solicitacoes')
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
        <div className='PreviewCart'>
            <div className="background" onClick={close}></div>

            <div className="window animate__animated animate__fadeInRightBig animate__faster">
                <div className="window_top">
                    <h2>Pré-visualização da solicitação ({typeRequest})</h2>

                    <button className="btn secundary" onClick={close}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="window_content">
                    <h3>Produtos selecionados ({listProductsQuantities.length}):</h3>


                    {listProductsQuantities.length > 0 ? (

                    <form className="form" onSubmit={handleSubmitCreateRequest}>
                        <div className="form_products">
                            {listProductsQuantities.map((product) => (
                            <div className="item" key={product.id}>
                                <p className="name_product">
                                    {product.name}
                                </p>

                                <div className="quantity--remove">
                                    <div className="quantity">
                                        <button
                                        type="button"
                                        // onClick={()=> handleChangeNumberItem(item, item.quantity-1)}
                                        onClick={()=> handleChangeQuantityProduct(product, product.quantity-1)}
                                        disabled={product.quantity == 1}
                                        >
                                            <i className="bi bi-dash-circle"></i>
                                        </button>
                                        
                                        <input
                                        type="number"
                                        value={product.quantity || ''}
                                        min={1} max={product.quantity_stock}
                                        onChange={(e)=> handleChangeQuantityProduct(product, e.target.value)}
                                        required
                                        />
                                    
                                        <button
                                        type="button"
                                        // onClick={()=> handleChangeNumberItem(item, item.quantity+1)}
                                        onClick={()=> handleChangeQuantityProduct(product, product.quantity+1)}
                                        disabled={product.quantity == product.quantity_stock}
                                        >
                                            <i className="bi bi-plus-circle"></i>
                                        </button>
                                    </div>

                                    <div className="remove">
                                        <button className="btn danger"
                                        type="button"
                                        onClick={()=> handleUpdateListProducts(product)}
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>

                        <div className="form_others--submit">
                            <div className="label--input question">
                                <label>Quem irá retirar o pedido?</label>

                                <div className="yes--no">
                                    <label>
                                        <input
                                        type="radio"
                                        name="outherPerson"
                                        onChange={()=> setOutherPerson(false)}
                                        required
                                        />
                                        Solicitante
                                    </label>

                                    <label>
                                        <input
                                        type="radio"
                                        name="outherPerson"
                                        onChange={()=> setOutherPerson(true)}
                                        required
                                        /> 
                                        Terceiro
                                    </label>
                                </div>

                                {outherPerson && (
                                <div className="label--input">
                                    <label htmlFor="name_delivery">Nome da pessoa</label>

                                    <input id='name_delivery' 
                                    type="text" 
                                    className="input"
                                    value={nameDeliveryTo || ''} 
                                    onChange={(e)=> setNameDeliveryTo(e.target.value)} 
                                    required 
                                    />
                                </div>
                                )}
                            </div>

                            {typeRequest == 'Empréstimo' && (
                            <div className="label--input">
                                <label htmlFor="days_reservation" disabled={daysUndetermined}>Dias que o(s) produto(s) ficarão em empréstimo</label>

                                <input id='days_reservation' 
                                type="number" 
                                className="input"
                                min={1}
                                value={daysReservation || ''} 
                                onChange={(e)=> setDaysReservation(e.target.value)}
                                required
                                disabled={daysUndetermined}
                                />

                                <label>
                                    <input 
                                    type="checkbox" 
                                    checked={daysUndetermined} 
                                    onChange={()=> {setDaysUndetermined(prev => !prev); setDaysReservation(0)}} 
                                    />

                                    <span> Por tempo indeterminado</span>
                                </label>
                            </div>
                            )}


                            <div className="container_submit">
                                <button className="btn primary" disabled={loadingSubmit}>
                                    Enviar Solicitação
                                </button>
                                {/* <button type="button">Cancel</button> */}
                            </div>
                        </div>
                    </form>

                    ) : (

                    <p className="content_empty">
                        Nenhum produto adicionado na solicitação.
                    </p>

                    )}
                </div>


                {/* <div className="window_bottom">
                    <button className='btn-add' onClick={closeCart}>
                        {numbersCarrinho.length > 0 ? 'Selecionar mais números' : 'Selecionar números'}
                    </button>

                    <button className='btn-carrinho' onClick={handleIrCarrinho} disabled={numbersCarrinho.length == 0 || loading}>
                        Ir para o carrinho
                    </button>
                </div> */}


                {/* {(loading || loadingPai) && (
                <div className="loading-window">
                    <p>Atualizando...</p>
                </div>
                )} */}
            </div>
        </div>
    )
}