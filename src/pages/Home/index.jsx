// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect, useState, useContext } from "react";

// API:
import { DASH_GET_ALL } from "../../API/dashApi";

// Contexts:
import UserContext from "../../contexts/userContext";

// Components:
// import { toast } from "react-toastify";
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { ChartProductsSector } from "../../components/Charts/ChartProductsSector/ChartProductsSector";
import { ChartKPI } from "../../components/Charts/ChartKPI/ChartKPI";

// Utils
import { primeiraPalavra } from "../../utils/formatStrings";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';
import { toast } from "react-toastify";
import { ORDER_GET_ME_PER_PARAMS } from "../../API/orderApi";


const partialDatasKPI = [
    { property_api: 'danger', status: 'Ruim', description: 'Está abaixo da quantidade mínima' },
    { property_api: 'warning', status: 'Em alerta', description: 'Está abaixo da quantidade ideal' },
    { property_api: 'good', status: 'Ideal', description: 'Está na quantidade ideal' }
];

export default function Home() {
    const {
        profileDetails
    } = useContext(UserContext);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dados a ser pré-carregados:
    const [datasDashboard, setDatasDashboard] = useState({});

    const [datasFormatedKPI, setDatasFormatedKPI] = useState([]);
    const tokenCookie = Cookies.get('tokenEstoque');
    // console.log(tokenCookie);


    useEffect(()=> {
        async function getDatasDashboard() {
            setLoading(true);
            console.log('Effect /Home');
            
            try {
                setError(true);
                
                const response = await DASH_GET_ALL(JSON.parse(tokenCookie));
                // const response = {
                //     success: true,
                //     data: {
                //         quantity_total_products: 2,
                //         quantity_products_categories: [
                //             {
                //                 "name_category": "Administração",
                //                 "quantity_products": 2
                //             },
                //             {
                //                 "name_category": "Cenografia",
                //                 "quantity_products": 0
                //             },
                //             {
                //                 "name_category": "Eletrônica",
                //                 "quantity_products": 0
                //             },
                //             {
                //                 "name_category": "Oficina",
                //                 "quantity_products": 0
                //             },
                //             {
                //                 "name_category": "Produção",
                //                 "quantity_products": 0
                //             },
                //             {
                //                 "name_category": "TI",
                //                 "quantity_products": 0
                //             }
                //         ],
                //         quantity_products_validated: 1,
                //         quantity_reservations_not_finished: 0,
                //         quantity_reservations_in_delayed: 0
                //     }
                // };
                console.log(response);

                if(response.success) {
                    const newDatasFormatedKPI = partialDatasKPI.map((each)=> ({...each, ...response.data.percent_kpi[each.property_api]}));
                    console.log(newDatasFormatedKPI)

                    setDatasFormatedKPI(newDatasFormatedKPI);
                    setDatasDashboard(response.data);
                    setError(false);
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
                    console.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO:', error);
            }
            
            setLoading(false);
        } 
        getDatasDashboard();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page Home">
            
            <NavMenu />

            <main className='PageContentMain Home grid'>
                <div className="title--subtitle">
                    <h1 className="title-page">
                        Olá, <span className="name-profile">{primeiraPalavra(profileDetails?.name)}</span>
                    </h1>

                    <p>
                        Seja bem-vindo(a) ao ambiente de estoque Bizsys.
                    </p>
                </div>


                <div className="Painel">
                    <div className="painel_title">
                        <h2>
                            <i className="bi bi-bar-chart"></i> 
                            <span> Visão geral do Estoque</span>
                        </h2>
                    </div>

                    {loading ? (
                        <p className='feedback_content'>
                            Carregando dados...
                        </p>
                    ) : (
                        error ? (

                        <div className='feedback_content'>
                            <p>
                                <i className="bi bi-exclamation-triangle"></i>
                                <span> Erro ao carregar dados!</span>
                            </p>
                            
                            <a className='btn primary' href='/home'>
                                <i className="bi bi-arrow-clockwise"></i>
                                Recarregue a página
                            </a>
                        </div>

                        ) : (
                        
                        <div className="painel_datas">
                            <div className="quadro">
                                <div className="quadro_title">
                                    <h3>Produtos catalogados</h3>
                                </div>

                                <div className="quadro_data">
                                    <p>{datasDashboard.quantity_total_products}</p>
                                </div>
                            </div>

                            <div className="quadro">
                                <div className="quadro_title">
                                    <h3>Produtos com validade</h3>
                                </div>

                                <div className="quadro_data">
                                    <p>{datasDashboard.quantity_products_validated}</p>
                                </div>
                            </div>

                            <div className="quadro">
                                <div className="quadro_title">
                                    <h3>Empréstimos ativos</h3>
                                </div>

                                <div className="quadro_data">
                                    <p>{datasDashboard.quantity_reservations_not_finished}</p>
                                </div>
                            </div>
                            
                            <div className="quadro">
                                <div className="quadro_title">
                                    <h3>Empréstimos em atraso</h3>
                                </div>

                                <div className="quadro_data">
                                    <p>{datasDashboard.quantity_reservations_in_delayed}</p>
                                </div>
                            </div>

                            <ChartProductsSector datas={datasDashboard.quantity_products_categories} />

                            <ChartKPI datas={datasFormatedKPI} />
                        </div>

                        )
                    )}
                </div>
            </main>

        </div>
    );
}