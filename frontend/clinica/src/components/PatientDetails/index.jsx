import { useState, useEffect } from 'react'
import axios from 'axios'

import { useParams } from 'react-router'

import { toast } from 'react-toastify'


const PatientDetails = () => {

    const { id } = useParams()
    const [patient, setPatient] = useState({})
    const [s, sets] = useState([])
    const [exams, setExams] = useState([])

    //as

    const [editing, setEditing] = useState(null)
    const [editData, setEditData] = useState({
        reason: "",
        date: "",
        time: "",
        description: "",
        medication: "",
        dosagePrecautions: "",
    })
    const [isEditing, setIsEditing] = useState(false)

    //exams

    const [editingExam, setEditingExam] = useState(null)
    const [editExamData, setEditExamData] = useState({
        name: "",
        date: "",
        time: "",
        type: "",
        laboratory: "",
        documentUrl: "",
        results: "",
    })
    const [isEditingExam, setIsEditingExam] = useState(false)


    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientRes = await axios.get(`http://localhost:3000/patients/${id}`)
                const consultsRes = await axios.get(`http://localhost:3000/consults?patientId=${id}`)
                const examsRes = await axios.get(`http://localhost:3000/exams?patientId=${id}`)

                setPatient(patientRes.data)
                setConsults(consultsRes.data)
                setExams(examsRes.data)
            } catch (error) {
                console.error("Erro ao obter os detalhes do paciente", error)
            }
        }
        fetchPatientDetails()
    }, [id])


    return (
        <div>PatientDetails</div>
    )
}

export default PatientDetails