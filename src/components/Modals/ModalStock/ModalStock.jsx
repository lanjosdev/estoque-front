// Funcionalidades / Libs:
// import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { FilterStock } from "./FilterStock/FilterStock";
import { BuscaProduct } from "../ModalProduct/BuscaProduct/BuscaProduct";
// import { BuscaProduct } from "./BuscaProduct/BuscaProduct";
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './modalstock.css';


// ModalStock.propTypes = {
//     close: PropTypes.func,
//     optionModal: PropTypes.any,
//     productSearchState: PropTypes.any,
//     setProductSearchState: PropTypes.func,
//     setProductFilterState: PropTypes.func,
//     idsSectorsFilter: PropTypes.any,
//     setIdsSectorsFilter: PropTypes.func,
// }
export function ModalStock({ 
    close, 
    optionModal, 
    productSearchState, 
    setProductSearchState, 
    idKpiFilter, 
    setIdKpiFilter, 
    idsSectorsFilter, 
    setIdsSectorsFilter, 
}) {
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
                return <FilterStock close={close} idKpiFilter={idKpiFilter} setIdKpiFilter={setIdKpiFilter} idsSectorsFilter={idsSectorsFilter} setIdsSectorsFilter={setIdsSectorsFilter} />;
            // case 'filter':
            //     return <FilterSector close={close} sectorFilter={sectorFilter} setSectorFilter={setSectorFilter} />;
            default:
                return <div style={{color: 'red'}}>Modal indefinido</div>;
        }
    };


    return (
        <div className="Modal ModalProduct">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}