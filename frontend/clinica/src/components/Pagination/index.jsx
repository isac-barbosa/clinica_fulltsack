import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

/**
 * Componente de paginação reutilizável.
 *
 * Props:
 * - currentPage: número da página atual (começa em 1)
 * - totalItems: total de itens da lista (já filtrada, se houver busca)
 * - itemsPerPage: quantos itens mostrar por página
 * - onPageChange: função chamada com o novo número da página
 */
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // se não há itens suficientes para precisar paginar, não renderiza nada
    if (totalPages <= 1) return null

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return
        onPageChange(page)
    }

    // gera os números de página a serem exibidos (com reticências para listas longas)
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
            return pages
        }

        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages)
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
            pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
        }

        return pages
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
                Mostrando <strong>{startItem}</strong>–<strong>{endItem}</strong> de{" "}
                <strong>{totalItems}</strong>
            </p>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-600 hover:bg-cyan-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                    aria-label="Página anterior"
                >
                    <FaChevronLeft size={14} />
                </button>

                {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-400 select-none">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => goToPage(page)}
                            className={`min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition ${
                                page === currentPage
                                    ? "bg-cyan-700 text-white"
                                    : "text-gray-700 hover:bg-cyan-50"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-gray-600 hover:bg-cyan-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                    aria-label="Próxima página"
                >
                    <FaChevronRight size={14} />
                </button>
            </div>
        </div>
    )
}

export default Pagination 