import React, { useState, useEffect } from 'react'
import apiClient from '../../api/api'
import { useParams } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaUserAlt, FaFilePdf } from 'react-icons/fa'
import jsPDF from 'jspdf'

const PatientDetails = () => {
  const { id } = useParams()
  const [patient, setPatient] = useState({})
  const [consults, setConsults] = useState([])
  const [exams, setExams] = useState([])

  const [editingConsult, setEditingConsult] = useState(null)
  const [editConsultData, setEditConsultData] = useState({
    reason: '',
    date: '',
    time: '',
    description: '',
    medication: '',
    dosagePrecautions: '',
  })
  const [isEditingConsult, setIsEditingConsult] = useState(false)

  const [editingExam, setEditingExam] = useState(null)
  const [editExamData, setEditExamData] = useState({
    name: '',
    date: '',
    time: '',
    type: '',
    laboratory: '',
    documentUrl: '',
    results: '',
  })
  const [isEditingExam, setIsEditingExam] = useState(false)

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientRes = await apiClient.get(`/pacientes/${id}`)
        setPatient(patientRes.data)

        const consultsRes = await apiClient.get(`/consulta`)
        const todasConsultas = consultsRes.data?.consulta ?? consultsRes.data ?? []
        setConsults(todasConsultas.filter((c) => c.paciente_id === Number(id)))
      } catch (error) {
        console.error('Erro ao obter os detalhes do paciente:', error)
      }

      // exames exige usuário ADMIN — busca separada para não travar o resto da página
      try {
        const examsRes = await apiClient.get(`/exame`)
        const todosExames = examsRes.data?.exames ?? examsRes.data ?? []
        setExams(todosExames.filter((e) => e.pacienteId === Number(id)))
      } catch (error) {
        console.error('Erro ao obter os exames do paciente (requer usuário ADMIN):', error)
      }
    }

    fetchPatientDetails()
  }, [id])

  const splitDateTime = (isoString) => {
    if (!isoString) return { date: '', time: '' }
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return { date: '', time: '' }
    const date = d.toISOString().slice(0, 10)
    const time = d.toISOString().slice(11, 16)
    return { date, time }
  }

  const handleEditConsult = (consult) => {
    setEditingConsult(consult)
    const { date, time } = splitDateTime(consult.data_consulta)
    setEditConsultData({
      reason: consult.motivo,
      date,
      time,
      description: consult.observacoes,
      medication: consult.medicamento || '',
      dosagePrecautions: consult.precaucoes_dosagem || '',
    })
    setIsEditingConsult(true)
  }

  const handleUpdateConsult = async (e) => {
    e.preventDefault()
    try {
      if (!editingConsult) return

      const dataConsulta = editConsultData.time
        ? `${editConsultData.date}T${editConsultData.time}:00`
        : editConsultData.date

      const payload = {
        motivo: editConsultData.reason,
        data_consulta: dataConsulta,
        observacoes: editConsultData.description,
        medicamento: editConsultData.medication,
        precaucoes_dosagem: editConsultData.dosagePrecautions,
        medico_responsavel_id: editingConsult.medico_responsavel_id,
        paciente_id: editingConsult.paciente_id,
      }

      await apiClient.put(`/consulta/${editingConsult.id}`, payload)
      setConsults((prev) =>
        prev.map((c) => (c.id === editingConsult.id ? { ...c, ...payload } : c))
      )

      toast.success('Consulta atualizada com sucesso!')
      setIsEditingConsult(false)
      setEditingConsult(null)
    } catch {
      toast.error('Erro ao atualizar a consulta!')
    }
  }

  const handleDeleteConsult = async (id) => {
    try {
      await apiClient.delete(`/consulta/${id}`)
      setConsults((prev) => prev.filter((c) => c.id !== id))
      toast.success('Consulta excluída com sucesso!')
    } catch {
      toast.error('Erro ao excluir consulta!')
    }
  }

  const handleEditExam = (exam) => {
    setEditingExam(exam)
    const { date, time } = splitDateTime(exam.data_exame)
    setEditExamData({
      name: exam.descricao,
      date,
      time,
      type: exam.tipo_exame,
      laboratory: exam.laboratorio || '',
      documentUrl: exam.documento_url || '',
      results: exam.resultado || '',
    })
    setIsEditingExam(true)
  }

  const handleUpdateExam = async (e) => {
    e.preventDefault()
    try {
      if (!editingExam) return

      const dataExame = editExamData.time
        ? `${editExamData.date}T${editExamData.time}:00`
        : editExamData.date

      const payload = {
        tipo_exame: editExamData.type,
        descricao: editExamData.name,
        resultado: editExamData.results,
        laboratorio: editExamData.laboratory,
        documento_url: editExamData.documentUrl,
        data_exame: dataExame,
      }

      await apiClient.put(`/exame/${editingExam.id}`, payload)
      setExams((prev) =>
        prev.map((exam) => (exam.id === editingExam.id ? { ...exam, ...payload } : exam))
      )

      toast.success('Exame atualizado com sucesso!')
      setIsEditingExam(false)
      setEditingExam(null)
    } catch {
      toast.error('Erro ao atualizar o exame!')
    }
  }

  const handleDeleteExam = async (id) => {
    try {
      await apiClient.delete(`/exame/${id}`)
      setExams((prev) => prev.filter((e) => e.id !== id))
      toast.success('Exame excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir o exame!')
    }
  }

  // gera o PDF do prontuário com dados do paciente, consultas e exames
  const handleExportPdf = () => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const marginX = 14
      let y = 18

      // checa se precisa pular de página antes de escrever a próxima linha
      const checkPageBreak = (linesNeeded = 1) => {
        const lineHeight = 6
        if (y + linesNeeded * lineHeight > pageHeight - 15) {
          doc.addPage()
          y = 18
        }
      }

      const writeLine = (text, { bold = false, size = 11, gap = 6 } = {}) => {
        checkPageBreak(1)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.setFontSize(size)
        const splitText = doc.splitTextToSize(text, pageWidth - marginX * 2)
        doc.text(splitText, marginX, y)
        y += gap * splitText.length
      }

      // cabeçalho
      doc.setFillColor(8, 145, 178) // cyan-700
      doc.rect(0, 0, pageWidth, 22, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('Prontuário do Paciente', marginX, 14)
      doc.setTextColor(0, 0, 0)
      y = 32

      // dados do paciente
      writeLine(patient.nome || 'Paciente', { bold: true, size: 14, gap: 8 })
      writeLine(`Convênio: ${patient.convenio || '-'}`)
      writeLine(`Alergias: ${patient.alergias || '-'}`)
      if (patient.telefone) writeLine(`Telefone: ${patient.telefone}`)
      if (patient.email) writeLine(`E-mail: ${patient.email}`)
      y += 4

      // histórico de consultas
      doc.setDrawColor(200, 200, 200)
      doc.line(marginX, y, pageWidth - marginX, y)
      y += 8
      writeLine('Histórico de Consultas', { bold: true, size: 13, gap: 8 })

      if (consults.length === 0) {
        writeLine('Nenhuma consulta encontrada.')
      } else {
        consults.forEach((c, index) => {
          checkPageBreak(5)
          const { date, time } = splitDateTime(c.data_consulta)
          writeLine(`${index + 1}. ${c.motivo || 'Consulta'}`, { bold: true, gap: 6 })
          writeLine(`Data: ${date || '-'}  Horário: ${time || '-'}`)
          writeLine(`Descrição: ${c.observacoes || '-'}`)
          writeLine(`Medicação: ${c.medicamento || '-'}`)
          writeLine(`Dosagem e Precauções: ${c.precaucoes_dosagem || '-'}`)
          y += 3
        })
      }

      // histórico de exames
      y += 4
      doc.line(marginX, y, pageWidth - marginX, y)
      y += 8
      writeLine('Histórico de Exames', { bold: true, size: 13, gap: 8 })

      if (exams.length === 0) {
        writeLine('Nenhum exame encontrado.')
      } else {
        exams.forEach((exam, index) => {
          checkPageBreak(5)
          const { date, time } = splitDateTime(exam.data_exame)
          writeLine(`${index + 1}. ${exam.descricao || 'Exame'}`, { bold: true, gap: 6 })
          writeLine(`Data: ${date || '-'}  Horário: ${time || '-'}`)
          writeLine(`Tipo: ${exam.tipo_exame || '-'}`)
          writeLine(`Laboratório: ${exam.laboratorio || '-'}`)
          writeLine(`Resultados: ${exam.resultado || '-'}`)
          y += 3
        })
      }

      // rodapé com data de emissão
      const issuedAt = new Date().toLocaleString('pt-BR')
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text(`Documento gerado em ${issuedAt}`, marginX, pageHeight - 8)

      const fileName = `prontuario-${(patient.nome || 'paciente').replace(/\s+/g, '-').toLowerCase()}.pdf`
      doc.save(fileName)

      toast.success('PDF do prontuário exportado com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      toast.error('Erro ao exportar o PDF do prontuário!')
    }
  }

  if (!patient) return <p>Carregando...</p>

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {patient.photoUrl ? (
            <img
              src={patient.photoUrl}
              alt={`Foto de ${patient.nome}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-cyan-600"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center border-2 border-cyan-200">
              <FaUserAlt size={24} />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{patient.nome}</h2>
            <p><span className="font-semibold">Convênio:</span> {patient.convenio}</p>
            <p><span className="font-semibold">Alergias:</span> {patient.alergias}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportPdf}
          className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition self-start sm:self-center"
        >
          <FaFilePdf size={16} />
          Exportar PDF do prontuário
        </button>
      </div>

      {/* Consultas */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Histórico de Consultas</h3>

        {isEditingConsult ? (
          <form onSubmit={handleUpdateConsult} className="space-y-4">
            {Object.keys(editConsultData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {key === 'dosagePrecautions'
                    ? 'Dosagem e Precauções'
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                  value={editConsultData[key]}
                  onChange={(e) =>
                    setEditConsultData({ ...editConsultData, [key]: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditingConsult(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : consults.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta encontrada.</p>
        ) : (
          consults.map((c) => {
            const { date, time } = splitDateTime(c.data_consulta)
            return (
            <div
              key={c.id}
              className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <p><strong>Consulta:</strong> {c.motivo}</p>
              <p><strong>Data:</strong> {date} - {time}</p>
              <p><strong>Descrição:</strong> {c.observacoes}</p>
              <p><strong>Medicação:</strong> {c.medicamento}</p>
              <p><strong>Dosagem e Precauções:</strong> {c.precaucoes_dosagem}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEditConsult(c)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteConsult(c.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Deletar
                </button>
              </div>
            </div>
          )})
        )}
      </div>

      {/* Exames */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Histórico de Exames</h3>

        {isEditingExam ? (
          <form onSubmit={handleUpdateExam} className="space-y-4">
            {Object.keys(editExamData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {key === 'documentUrl'
                    ? 'URL do Documento'
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {key === 'results' ? (
                  <textarea
                    value={editExamData[key]}
                    onChange={(e) =>
                      setEditExamData({ ...editExamData, [key]: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="3"
                    required
                  />
                ) : (
                  <input
                    type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                    value={editExamData[key]}
                    onChange={(e) =>
                      setEditExamData({ ...editExamData, [key]: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required={key !== 'documentUrl'}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditingExam(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : exams.length === 0 ? (
          <p className="text-gray-500">Nenhum exame encontrado.</p>
        ) : (
          exams.map((exam) => {
            const { date, time } = splitDateTime(exam.data_exame)
            return (
            <div
              key={exam.id}
              className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <p><strong>Exame:</strong> {exam.descricao}</p>
              <p><strong>Data:</strong> {date} - {time}</p>
              <p><strong>Tipo:</strong> {exam.tipo_exame}</p>
              <p><strong>Laboratório:</strong> {exam.laboratorio}</p>
              <p><strong>Documento:</strong> {exam.documento_url}</p>
              <p><strong>Resultados:</strong> {exam.resultado}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEditExam(exam)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Deletar
                </button>
              </div>
            </div>
          )})
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </section>
  )
}

export default PatientDetails