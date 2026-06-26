import { useState, useEffect } from 'react'
import apiClient from '../../api/api'


const ExamsList = () => {
    const [page, setPage] = useState(1)
    const [exams, setExams] = useState()
    const [total, setTotal] = useState()
    const [totalPagina, setTotalPagina] = useState()
    const limite = 10
    useEffect(() => {
        const fethExames = async () => {
            try {
                const response = await apiClient.get(`/exames?pagina=${page}&limite=${limite}`)
                if (response.data) {
                    setExams(response.data.exames)
                    setTotal(response.data.total)
                    setTotalPagina(response.data.totalPaginas)
                }
            } catch (error) {
                console.error("Erro ao listar exames", error)
            }
        }
        fethExames()
    }, [page])

    return (
        <>
            <div>Lista de exames</div>
            {
                exams?.length ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo de Exame</th>
                                    <th>Descrição</th>
                                    <th>Data do Exame</th>
                                    <th>Valor</th>
                                    <th>Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exame) => (
                                    <tr>
                                        <td>{exame.id}</td>
                                        <td>{exame.tipo_exame}</td>
                                        <td>{exame.descricao}</td>
                                        <td>{exame.data_exame}</td>
                                        <td>{exame.valor}</td>
                                        <td><em>{exame.resultado}</em></td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        <div className='flex gap-5 items-center justify-center'>
                            <span>Resultado {limite * page} de {total}</span>
                            {Array.from(Array(totalPagina)).map((_, i) => (
                                <button 
                                    onClick={() => {
                                        setPage(i + 1)
                                    }}
                                    className={` px-2 py-1 ${i + 1 == page ? "bg-cyan-950" : "bg-cyan-600"}  cursor-pointer text-white rounded-lg`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <span>Sem dados!</span>
                )
            }
        </>
    )
}

export default ExamsList