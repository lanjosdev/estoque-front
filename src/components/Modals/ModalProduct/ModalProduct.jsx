// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { CreateProduct } from "./CreateProduct/CreateProduct";
import { DeleteProduct } from "./DeleteProduct/DeleteProduct";
import { UpdateProduct } from "./UpdateProduct/UpdateProduct";
import { SearchProduct } from "./SearchProduct/SearchProduct";
import { BuscaProduct } from "./BuscaProduct/BuscaProduct";
import { FilterProduct } from "./FilterProduct/FilterProduct";
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './modalproduct.css';


ModalProduct.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    optionModal: PropTypes.any,
    productSelect: PropTypes.object,
    optionUpdate: PropTypes.any,
    productSearchState: PropTypes.any,
    setProductSearchState: PropTypes.func,
    idsSectorsFilter: PropTypes.any,
    setIdsSectorsFilter: PropTypes.func,
    clearSearch: PropTypes.func
}
export function ModalProduct({ 
    close, 
    setReflashState, 
    optionModal, 
    productSelect, 
    optionUpdate, 
    productSearchState, 
    setProductSearchState, 
    idsSectorsFilter, 
    setIdsSectorsFilter,
    filterIsExpiration,
    setFilterIsExpiration,
    clearSearch 
}) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        if(optionModal == 'create' && (productSearchState || idsSectorsFilter.length > 0)) {
            clearSearch();
        }
    }, [optionModal, clearSearch, productSearchState, idsSectorsFilter]);

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
            case 'create':
                return <CreateProduct close={close} setReflashState={setReflashState} />;
            case 'delete':
                return <DeleteProduct close={close} setReflashState={setReflashState} productSelect={productSelect} />;
            case 'update':
                return <UpdateProduct close={close} setReflashState={setReflashState} productSelect={productSelect} optionUpdate={optionUpdate} />;
            case 'search':
                return <BuscaProduct close={close} searchState={productSearchState} setSearchState={setProductSearchState} />;
                // return <SearchProduct close={close} searchState={productSearchState} setSearchState={setProductSearchState} setFilterState={setProductFilterState} />;
            case 'filter':
                return <FilterProduct close={close} idsSectorsFilter={idsSectorsFilter} setIdsSectorsFilter={setIdsSectorsFilter} filterIsExpiration={filterIsExpiration} setFilterIsExpiration={setFilterIsExpiration} />;
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