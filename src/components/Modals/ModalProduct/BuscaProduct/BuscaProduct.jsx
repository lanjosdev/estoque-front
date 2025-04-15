// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from 'react';

// Context:
// import UserContext from "../../../../contexts/userContext";

// Components:
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './buscaproduct.css';


BuscaProduct.propTypes = {
    close: PropTypes.func,
    searchState: PropTypes.any,
    setSearchState: PropTypes.func
}
export function BuscaProduct({ close, searchState, setSearchState }) {
    // const [loading, setLoading] = useState(true);
    // const [hasError, setHasError] = useState(true);
    // const elementFocusRef = useRef(null);

    const inputSearchRef = useRef(null);
    const [searchInput, setSearchInput] = useState(searchState || '');



    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window BuscaProduct');

            // Inicia dando foco em um elemento do WindowModal
            if(inputSearchRef?.current) {
                setTimeout(() => { 
                    inputSearchRef?.current.focus(); 
                }, 100);
            }
        }
        initializeComponent();
    }, []);



    function handleChangeInputSearch(newValue) {
        setSearchInput(newValue);

        if(newValue.replaceAll(' ', '').length >= 2) {
            console.log('Faz pesquisa de: ' + newValue);
            setSearchState(newValue);
        }
        else {
            console.log('ZERA STATE');
            setSearchState(null);
        }
    }

    function handleSubmitInputSearch(e) {
        e.preventDefault();
        // const inputSearch = inputSearchRef?.current?.value;
        
        // if(inputSearch != '') {
        //     console.log('Faz pesquisa de: ' + inputSearch);
        //     setSearchState(inputSearch);
        // } 
        // else {
        //     console.log('ZERA STATE');
        //     setSearchState(null);
        // }

        close();
    }

    

    return (
        <div className='Window BuscaProduct SearchProduct grid'>
            <div className="top-window">
                <h3>Busca por produto</h3>

                <i className="bi bi-x-lg" onClick={close}></i>
            </div>

            <form className="content-window" onSubmit={handleSubmitInputSearch} autoComplete="off">
                <input
                ref={inputSearchRef}
                type="text"
                placeholder="Digite sua pesquisa"
                value={searchInput}
                onChange={(e)=> handleChangeInputSearch(e.target.value)}
                />

                <button type='submit'>
                    <i className="bi bi-search"></i>
                </button>
            </form>                
        </div>
    )        
}