import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

//modal
import Modal from '../Modal'

const RegisterExams = () => {

    const [searchTerm, setSearchTerm] = useState("")
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        time: "",
        type: "",
        documentUrl: "",
        results: ""
    })

    // busca pacientes

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:3000/patients")
                setPatients(response.data)
            } catch (error) {
                console.error("Erro ao obter dados dos pacientes", error)
            }
        }
        fetchPatients()
    }, [])


    // funções auxiliares

    //controle do campo de filtro

    const handleSearchChange = (e) => setSearchTerm(e.target.value)

    //filtro dos pacientes

    const filteredPatients = patients.filter(
        (patient) =>
            patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toString().includes(searchTerm)
    )

    //seleciona o paciente  e abre modal

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient)
        setIsModalOpen(true)
    }

    //fecha modal e reseta o valor do paciente selecionado

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPatient(null)
    }

    //Controla os campos do estado formData dinamicamente

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    //reseta o form

    const resetForm = () => {
        setFormData({
            name: "",
            date: "",
            time: "",
            type: "",
            documentUrl: "",
            results: ""
        })
    }

    //envia os dados

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedPatient) return

        try {
            setIsSaving(true)

            const dataToSave = {
                patientId: selectedPatient.id,
                ...formData
            }

            await axios.post("http://localhost:3000/exams", dataToSave)

            toast.success("Exame cadastrado com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            resetForm()
            handleCloseModal()

        } catch (error) {
            console.error("Erro ao cadastrar exame!")
            toast.error("Erro ao cadastrar exame!", {
                autoClose: 2000,
                hideProgressBar: true
            })
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validar tipo
        const allowedTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Apenas PDF, PNG ou JPG são permitidos.");
            e.target.value = "";
            return;
        }

        // Validar tamanho (5MB)
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            alert("O arquivo deve ter no máximo 5MB.");
            e.target.value = "";
            return;
        }

        setFormData({
            ...formData,
            documentUrl: file
        });
    };


    return (
        <section className='p-6 text-gray-800'>
            {/* campo de busca */}

            <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2'>
                    Buscar paciente para cadastrar o exame
                </label>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='Digite o nome ou o registro do paciente'
                    className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                />

            </div>

            {/* Lista de pacientes */}

            <ul className='space-y-3'>
                {
                    filteredPatients.map((patient) => (
                        <li
                            key={patient.id}
                            className='p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition'
                        >
                            <div>
                                <p className='text-sm'>
                                    <strong>Registro:</strong> {patient.id}
                                </p>
                                <p className='text-sm'>
                                    <strong>Nome:</strong> {patient.fullName}
                                </p>

                                <p className='text-sm'>
                                    <strong>Convênio:</strong> {patient.healthInsurance}
                                </p>

                            </div>

                            <button
                                onClick={() => handleSelectPatient(patient)}
                                className='bg-cyan-700 text-white px-3 py-2 rounded-lg hover:bg-cyan-600 cursor-pointer'
                            >
                                Selecionar
                            </button>

                        </li>
                    ))
                }
            </ul>


            {/* Modal de cadastro de exame */}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {
                    selectedPatient && (
                        <>
                            {/* Título */}
                            <h2 className='text-lg font-bold mb-4 text-cyan-700'>
                                Cadastrar exame para {selectedPatient.fullName}
                            </h2>

                            {/* Dados básicos */}
                            <div className='mb-4 text-sm text-gray-700'>
                                <p>
                                    <strong>Email:</strong> {selectedPatient.email}
                                </p>
                                <p>
                                    <strong>Telefone:</strong> {selectedPatient.phone}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    {/* data */}
                                    <div>
                                        <label htmlFor='date' className='block text-sm font-medium mb-1'>
                                            Data
                                        </label>

                                        <input
                                            type='date'
                                            name='date'
                                            id='date'
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                        />

                                    </div>
                                    {/* Hora */}
                                    <div>
                                        <label htmlFor='time' className='block text-sm font-medium mb-1'>
                                            Horário
                                        </label>

                                        <input
                                            type='time'
                                            name='time'
                                            id='time'
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                        />
                                    </div>

                                </div> {/* fechamento do grid*/}

                                {/* Tipo do exame */}

                                <div>
                                    <label htmlFor='type' className='block text-sm font-medium mb-1'>
                                        Tipo do exame
                                    </label>

                                    <textarea
                                        name='type'
                                        id='type'
                                        value={formData.type}
                                        rows={3}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none resize-none'
                                    />
                                </div>

                                {/* Laboratótio */}

                                <div>
                                    <label htmlFor='laboratory' className='block text-sm font-medium mb-1'>
                                        Laboratótio
                                    </label>

                                    <input
                                        type='text'
                                        name='laboratory'
                                        id='laboratory'
                                        value={formData.laboratory}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                    />
                                </div>


                                {/* URL do documento*/}

                                <div>
                                    <label
                                        htmlFor="documentUrl"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        URL do documento
                                    </label>

                                    <input
                                        type="file"
                                        name="documentUrl"
                                        id="documentUrl"
                                        onChange={handleFileChange}
                                        required
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                    />
                                </div>




                                {/* botões */}

                                <div className='flex justify-end gap-3 pt-4'>
                                    <button
                                        type='button'
                                        onClick={handleCloseModal}
                                        className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition'
                                    >
                                        Fechar
                                    </button>


                                    <button
                                        type='submit'
                                        disabled={isSaving}
                                        className='px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition'
                                    >
                                        {isSaving ? "Salvando..." : "Salvar"}
                                    </button>


                                </div>



                            </form>
                        </>
                    )
                }
            </Modal>

        </section>

    )
}

export default RegisterExams


