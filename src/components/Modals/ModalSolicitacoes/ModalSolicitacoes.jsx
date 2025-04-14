// Hooks / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { DetailsSolicitacoes } from "./DetailsSolicitacoes/DetailsSolicitacoes";
import { InSeparationSolicitacoes } from "./InSeparationSolicitacoes/InSeparationSolicitacoes";
import { SeparateSolicitacoes } from "./SeparateSolicitacoes/SeparateSolicitacoes";
import { EntregueSolicitacoes } from "./EntregueSolicitacoes/EntregueSolicitacoes";
import { CancelSolicitacoes } from "./CancelSolicitacoes/CancelSolicitacoes";
import { DevolvidoSolicitacoes } from "./DevolvidoSolicitacoes/DevolvidoSolicitacoes";
// import { CreateExit } from "./CreateExit/CreateExit";
// import { UpdateExit } from "./UpdateExit/UpdateExit";
// import { DeleteExit } from "./DeleteExit/DeleteExit";

// Utils:

// Assets:

// Estilo:
// import './modalexit.css';


ModalSolicitacoes.propTypes = {
    close: PropTypes.func,
    setRefreshState: PropTypes.func,
    optionModal: PropTypes.any,
    requestTarget: PropTypes.object
}
export function ModalSolicitacoes({ close, setRefreshState, optionModal, requestTarget }) {
    // const [loading, setLoading] = useState(false);

    // const statusRequestDefault = [
    //     {
    //         status_id: 1,
    //         status_name: "Recebido",
    //         option_modal: 'recebido'
    //     },
    //     {
    //         status_id: 2,
    //         status_name: "Em separação",
    //         option_modal: 'inseparation'
    //     },
    //     {
    //         status_id: 3,
    //         status_name: "Separado",
    //         option_modal: 'separado'
    //     },
    //     {
    //         status_id: 4,
    //         status_name: "Entregue",
    //         option_modal: 'entregue'
    //     },
    //     {
    //         status_id: 5,
    //         status_name: "Retornado",
    //         option_modal: 'retornado'
    //     },
    //     {
    //         status_id: 5,
    //         status_name: "Cancelado",
    //         option_modal: 'cancelado'
    //     }
    // ];
    const idsStatusSolicitacoesPorOptModal = {
        recebido: {
            id: 1
        },
        inseparation: {
            id: 2
        },
        separado: {
            id: 3
        },
        entregue: {
            id: 4
        },
        devolvido: {
            id: 5
        },
        cancelado: {
            id: 6
        }
    };


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Modal Solicitacoes');

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
            case 'details':
                return <DetailsSolicitacoes close={close} requestTarget={requestTarget} />;
            case 'inseparation':
                return <InSeparationSolicitacoes close={close} requestTarget={requestTarget} setRefreshState={setRefreshState} idStatusSubmit={idsStatusSolicitacoesPorOptModal[optionModal].id} />;
            case 'separado':
                return <SeparateSolicitacoes close={close} requestTarget={requestTarget} setRefreshState={setRefreshState} idStatusSubmit={idsStatusSolicitacoesPorOptModal[optionModal].id} />;
            case 'entregue':
                return <EntregueSolicitacoes close={close} requestTarget={requestTarget} setRefreshState={setRefreshState} idStatusSubmit={idsStatusSolicitacoesPorOptModal[optionModal].id} />;
            case 'devolvido':
                return <DevolvidoSolicitacoes close={close} requestTarget={requestTarget} setRefreshState={setRefreshState} idStatusSubmit={idsStatusSolicitacoesPorOptModal[optionModal].id} />;
            case 'cancelado':
                return <CancelSolicitacoes close={close} requestTarget={requestTarget} setRefreshState={setRefreshState} idStatusSubmit={idsStatusSolicitacoesPorOptModal[optionModal].id} />;
            default:
                return <div style={{color: 'red'}}>Opção de modal desconhecida</div>;
        }
    };


    return (
        <div className="Modal ModalExit">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}