import React from 'react'
import PatientsCounter from '../../components/counters/PatientsCounter'
import ConsultsCounter from '../../components/counters/ConsultsCounter'
import ExamsCounter from '../../components/counters/ExamsCounter'
import PatientsList from '../../components/PatientsList'
import DashboardCharts from '../../components/DashboardCharts'

const Dashboard = () => {
    return (
        <div>
            <h1 className='text-xl font-bold text-cyan-800 mb-6'>Dashboard</h1>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                <PatientsCounter />
                <ConsultsCounter />
                <ExamsCounter />
            </div>

            {/* Gráficos de estatísticas */}
            <DashboardCharts />

            {/* Lista de pacientes */}
            <PatientsList />
        </div>
    )
}

export default Dashboard