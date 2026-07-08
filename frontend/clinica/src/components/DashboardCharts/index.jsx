import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts"

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

// paleta de cores para o gráfico de pizza (tons de ciano, combinando com o resto do sistema)
const COLORS = ["#0e7490", "#06b6d4", "#22d3ee", "#67e8f9", "#a5f3fc", "#164e63", "#0891b2", "#155e75"]

// as datas no db.json aparecem em dois formatos diferentes (dd-mm-yyyy e yyyy-mm-dd),
// então essa função normaliza qualquer um dos dois formatos para um objeto Date válido
const parseDate = (dateStr) => {
    if (!dateStr) return null

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr)
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split("-")
        return new Date(`${year}-${month}-${day}`)
    }

    return null
}

const DashboardCharts = () => {
    const [consults, setConsults] = useState([])
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [consultsRes, patientsRes] = await Promise.all([
                    axios.get("http://localhost:3000/consults"),
                    axios.get("http://localhost:3000/patients"),
                ])
                setConsults(consultsRes.data)
                setPatients(patientsRes.data)
            } catch (error) {
                console.error("Erro ao carregar dados para os gráficos:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // agrupa a quantidade de consultas por mês, considerando os últimos 6 meses (incluindo o atual)
    const consultsByMonth = useMemo(() => {
        const now = new Date()
        const months = []

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            months.push({
                key: `${d.getFullYear()}-${d.getMonth()}`,
                label: `${MONTH_LABELS[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`,
                total: 0
            })
        }

        consults.forEach((consult) => {
            const date = parseDate(consult.date)
            if (!date) return

            const key = `${date.getFullYear()}-${date.getMonth()}`
            const monthEntry = months.find((m) => m.key === key)
            if (monthEntry) monthEntry.total += 1
        })

        return months
    }, [consults])

    // agrupa a quantidade de pacientes por convênio
    const patientsByInsurance = useMemo(() => {
        const counts = {}

        patients.forEach((patient) => {
            const insurance = patient.healthInsurance?.trim() || "Não informado"
            counts[insurance] = (counts[insurance] || 0) + 1
        })

        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [patients])

    if (loading) {
        return (
            <div className="bg-white shadow rounded-2xl p-6 mt-8">
                <p className="text-gray-500 text-center py-6">Carregando estatísticas...</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            {/* Gráfico de barras: consultas por mês */}
            <div className="bg-white shadow rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-cyan-800 mb-4">
                    Consultas por Mês
                </h2>

                {consults.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                        Nenhuma consulta registrada ainda.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={consultsByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value) => [`${value} consulta(s)`, "Total"]} />
                            <Bar dataKey="total" fill="#0e7490" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Gráfico de pizza: distribuição de pacientes por convênio */}
            <div className="bg-white shadow rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-cyan-800 mb-4">
                    Pacientes por Convênio
                </h2>

                {patientsByInsurance.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                        Nenhum paciente cadastrado ainda.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={patientsByInsurance}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {patientsByInsurance.map((entry, index) => (
                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} paciente(s)`, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

        </div>
    )
}

export default DashboardCharts