// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { CATEGORY_GET_ALL } from '../../../API/categoryApi';

// Components:
import { DropdownMenuSector } from '../../DropdownMenus/DropdownSector/DropdownMenuSector';
import { ModalSector } from '../../Modals/ModalSector/ModalSector';
import { toast } from 'react-toastify';

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';

// Assets:


// Estilo:
import './painelsectors.css';


export function PainelSectors() {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [reflashState, setReflashState] = useState(false);
    const filterDefault = 'active=true';

    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);

    const [sectors, setSectors] = useState([]);
    const [sectorSelect, setSectorSelect] = useState(null);
    const [sectorFilter, setSectorFilter] = useState(filterDefault);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        async function getAllSectors() 
        {
            console.log('Effect Component PainelSectors');
            setLoading(true);
            setHasError(true);
            
            try {
                setSectors([]);

                const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie), sectorFilter);
                console.log(response);

                if(response.success) {
                    setSectors(response.data);
                    setHasError(false);
                }
                else if(response.success == false) {
                    if(response.message == 'Nenhum resultado encontrado.') {
                        setHasError(false);
                    }
                    else {
                        toast.error(response.message);
                    }
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                console.error('DEU ERRO:', error);

                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }
            
            setLoading(false);
        }
        getAllSectors();
    }, [tokenCookie, reflashState, sectorFilter]);



    function handleOpenModal(opt) {
        console.log(opt);
        setOptionModal(opt);
        setShowModal(true);
    }

    


    return (
        <div className="Painel PainelSectors">
            <div className="painel-top">
                <h2>Setores ({sectors.length}):</h2>

                <div className="search--btnAdd">
                    {(sectors.length > 0 || sectorFilter != filterDefault) && (
                    <>
                    <button className='btn filter' onClick={()=> handleOpenModal('filter')} title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button>

                    <button className="btn primary" onClick={()=> handleOpenModal('create')} disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Novo setor</span>
                    </button>
                    </>
                    )}
                </div>
            </div>

            {((sectorFilter != filterDefault) && !loading) && (
            <div className='feedback-search'>
                <strong>{`Resultado(s) do filtro`}</strong>

                <button className='btn-filter clear' onClick={()=> setSectorFilter(filterDefault)}>
                    <i className="bi bi-x-circle"></i>
                    <span> Limpar filtro</span>
                </button>
            </div>
            )}

            <div className="painel-content">
                {loading ? (

                    <p className='feedback_content'>
                        Carregando setores...
                    </p>

                ) : (
                    hasError ? (

                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar setores!</span>
                        </p>
                        
                        <a className='btn primary' href='/sectors'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (sectors.length === 0 ? (
                        <div className='result-empty'>
                            {sectorFilter != filterDefault ? (
                            <p>
                                Nada encontrado!
                            </p>
                            ) : (
                            <>
                            <p>Nenhum setor foi criado!</p>
                            
                            <button className='btn  primary' onClick={()=> handleOpenModal('create')} disabled={hasError}>
                                <i className="bi bi-plus-lg"></i>
                                Criar um Setor
                            </button>
                            </>
                            )}
                        </div>
                    ) : (
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Descrição</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                            {sectors.map((sector)=> (
                                <tr key={sector.id} className="item-sector">
                                    <td data-label="id">
                                        {formatToIdCode(sector.id)}
                                    </td>
                                    <td data-label="nome">{sector.name}</td>
                                    <td data-label="descrição">{sector.description || 'Não informado'}</td>
                                    <td data-label="ações">
                                        <DropdownMenuSector 
                                        dataSector={sector} 
                                        setSectorSelect={setSectorSelect} 
                                        handleOpenModal={handleOpenModal}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ))
                )}
            </div>


            {showModal && (
                <ModalSector 
                close={()=> setShowModal(false)} 
                setReflashState={setReflashState} 
                optionModal={optionModal}
                sectorSelect={sectorSelect}
                sectorFilter={sectorFilter}
                setSectorFilter={setSectorFilter}
                />
            )}
        </div>
    )        
}