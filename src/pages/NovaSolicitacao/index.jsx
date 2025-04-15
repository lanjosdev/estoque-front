// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelNovaSolicitacao } from "../../components/Painels/PainelNovaSolicitacao/PainelNovaSolicitacao";
import { PreviewCart } from "../../components/Modals/PreviewCart/PreviewCart";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function NovaSolicitacao() {

    // Logica UI:
    const [listProductsSaida, setListProductsSaida] = useState([]);
    const [listProductsEmprestimo, setListProductsEmprestimo] = useState([]);
    const [showModal, setShowModal] = useState(false);


    // Dados a submiter:
    const [typeRequest, setTypeRequest] = useState('Saída');
    const [listProductsQuantities, setListProductsQuantities] = useState([]);

    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        function verificaCookieToken() {
            console.log('Effect /NovaSolicitacao');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        verificaCookieToken();
    }, [tokenCookie]);

    




    function handleChangeTypeRequest(typeReq) {
        if(typeReq !== typeRequest) {
            // Guarda dados antes de mudar o tipo da solicitação
            if(typeRequest == 'Saída') {
                setListProductsSaida(listProductsQuantities)
            }
            else {
                setListProductsEmprestimo(listProductsQuantities)
            }

            // Muda o tipo da solicitção
            setTypeRequest(typeReq);
            if(typeReq == 'Empréstimo') {
                setListProductsQuantities(listProductsEmprestimo);
            }
            else {
                setListProductsQuantities(listProductsSaida);
            }
        }
    }

    function handleUpdateListProducts(itemTarget) {
        let newList = [...listProductsQuantities];
        const idxEdit = newList.findIndex((each)=> each.id == itemTarget.id);

        if(idxEdit == -1) {
            // Adiciona item na lista
            newList.push({...itemTarget, quantity: 1});
        }
        else {
            // Remove item na lista
            newList.splice(idxEdit, 1);
        }

        console.log(newList);
        setListProductsQuantities(newList);
    } 

    function handleShowModal() {
        setShowModal(true);
    }
    
  
    return (
        <div className="Page NovaSolicitacao">
            
            <NavMenu />

            <main className='main NovaSolicitacao grid'>
                <div className="title--subtitle">
                    <h1 className="title">
                        {typeRequest == 'Saída' ? (
                        <i className="bi bi-box-arrow-left"></i>
                        ) : (
                        <i className="bi bi-calendar-event"></i>
                        )}
                        
                        <span>Solicitação de {typeRequest}</span>
                    </h1>

                    <p className="subtitle">
                        {/* Abaixo você pode selecione os produtos que deseja adicionar na sua solicitação. */}
                        Abaixo, selecione os produtos que deseja adicionar à sua solicitação.
                    </p>
                </div>


                <div className="tabs--btnCart">
                    <div className="tabs">
                        <button 
                        className={`tab ${typeRequest == 'Saída' ? 'active' : ''}`}
                        onClick={()=> handleChangeTypeRequest('Saída')}
                        // disabled={loadingSubmit}
                        >
                            Saída
                        </button>

                        <button 
                        className={`tab ${typeRequest == 'Empréstimo' ? 'active' : ''}`}
                        onClick={()=> handleChangeTypeRequest('Empréstimo')}
                        // disabled={loadingSubmit}
                        >
                            Empréstimo
                        </button>
                    </div>

                    <button className="btn primary" onClick={handleShowModal} data-count={listProductsQuantities.length}>
                        Ver Solicitação
                        {listProductsQuantities.length > 0 && (
                            <small>{listProductsQuantities.length}</small>
                        )}
                    </button>
                </div>


                <PainelNovaSolicitacao 
                listProductsQuantities={listProductsQuantities}
                handleUpdateListProducts={handleUpdateListProducts} 
                typeRequest={typeRequest}
                />
            </main>
            

            {showModal && (
            <PreviewCart
            close={()=> setShowModal(false)}
            typeRequest={typeRequest}
            listProductsQuantities={listProductsQuantities}
            setListProductsQuantities={setListProductsQuantities}
            handleUpdateListProducts={handleUpdateListProducts}
            />
            )}
            
            {/* {showModal && (
                <ModalProduct
                close={()=> setShowModal(false)} 
                setReflashState={setReflashState} 
                optionModal={optionModal}
                productSelect={productSelect}
                optionUpdate={optionUpdate}
                productSearchState={productSearchState}
                setProductSearchState={setProductSearchState}
                setProductFilterState={setProductFilterState}
                clearSearch={clearSearch}
                />
            )} */}

        </div>
    );
}