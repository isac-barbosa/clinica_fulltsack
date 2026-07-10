import { useState, useEffect } from 'react'
import apiClient from '../../api/api'

const formatarData = (isoString) => {
    if (!isoString) return '-'
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return '-'
    const data = d.toLocaleDateString('pt-BR')
    const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return `${data} ${hora}`
}

const formatarValor = (valor) => {
    if (valor === null || valor === undefined || valor === '') return '-'
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const ExamsList = () => {
    const [page, setPage] = useState(1)
    const [exams, setExams] = useState()
    const [total, setTotal] = useState()
    const [totalPagina, setTotalPagina] = useState()
    const limite = 10

    useEffect(() => {
        const fethExames = async () => {
            try {
                const response = await apiClient.get(`/exame?pagina=${page}&limite=${limite}`)
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

    const primeiroItem = total ? (page - 1) * limite + 1 : 0
    const ultimoItem = total ? Math.min(page * limite, total) : 0

    return (
        <section className="p-6">
            <div className="bg-white shadow rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-cyan-800 mb-4">Lista de Exames</h2>

                {exams?.length ? (
                    <>
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-cyan-800 text-white">
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Tipo de Exame</th>
                                        <th className="px-4 py-3 font-semibold">Descrição</th>
                                        <th className="px-4 py-3 font-semibold">Data do Exame</th>
                                        <th className="px-4 py-3 font-semibold">Valor</th>
                                        <th className="px-4 py-3 font-semibold">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((exame, index) => (
                                        <tr
                                            key={exame.id}
                                            className={`border-t border-gray-200 hover:bg-cyan-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                }`}
                                        >
                                            <td className="px-4 py-3 text-gray-700">{exame.id}</td>
                                            <td className="px-4 py-3 text-gray-700">{exame.tipo_exame}</td>
                                            <td className="px-4 py-3 text-gray-700">{exame.descricao}</td>
                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatarData(exame.data_exame)}</td>
                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatarValor(exame.valor)}</td>
                                            <td className="px-4 py-3 text-gray-600 italic">{exame.resultado || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200">
                            <span className="text-sm text-gray-600">
                                Mostrando <strong>{primeiroItem}</strong>–<strong>{ultimoItem}</strong> de{' '}
                                <strong>{total}</strong>
                            </span>
                            <div className="flex gap-2 flex-wrap justify-center">
                                {Array.from(Array(totalPagina)).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition cursor-pointer ${i + 1 === page
                                                ? 'bg-cyan-800 text-white'
                                                : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-10">Sem dados!</p>
                )}
            </div>
        </section>
    )
}

export default ExamsList