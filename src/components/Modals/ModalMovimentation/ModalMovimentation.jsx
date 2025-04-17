// Funcionalidades / Libs:
// import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { BuscaProduct } from "../ModalProduct/BuscaProduct/BuscaProduct";
import { FilterMovimentation } from './FilterMovimentation/FilterMovimentation';


// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './modalmovimentation.css';



export function ModalMovimentation({ close, optionModal, productSearchState, setProductSearchState, typeFilter, setTypeFilter, periodFilter, setPeriodFilter, clearSearch }) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {
            // console.log('Effect Modal Product');

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



    // Função que retorna JSX baseado no switch
    const renderWindowModal = ()=> {
        switch(optionModal) {
            case 'search':
                return <BuscaProduct close={close} searchState={productSearchState} setSearchState={setProductSearchState} />;
            case 'filter':
                return <FilterMovimentation close={close} typeFilter={typeFilter} setTypeFilter={setTypeFilter} periodFilter={periodFilter} setPeriodFilter={setPeriodFilter} />;
            default:
                return <div style={{color: 'red'}}>Modal indefinido</div>;
        }
    };

    return (
        <div className="Modal ModalMovimentation">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}