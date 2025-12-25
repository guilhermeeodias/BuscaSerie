import { useState } from "react"
import { FaStar, FaCalendarAlt, FaArrowLeft, FaSearch } from "react-icons/fa"
import { MdMovie } from "react-icons/md"

function App() {
  const [text, setText] = useState("")
  const [list, setList] = useState<any[]>([]) 
  const [view, setView] = useState<any>(null)

  const handleSearch = async () => {
    if(text == "") {
        alert("Digite o nome da série!")
        return
    }

    try {
        const response = await fetch("https://api.tvmaze.com/search/shows?q=" + text)
        const json = await response.json()
        setList(json)
        console.log(json) // pra ver se ta vindo certo
    } catch (e) {
        console.log(e)
    }
  }

  return (
    <div className="flex flex-col items-center font-sans min-h-screen w-full bg-slate-900 text-blue-50 pb-10">
      
      <div className="flex flex-col items-center text-center p-8 pt-12 w-full bg-linear-to-b from-slate-950 to-slate-900 shadow-2xl shadow-black/40 border-b border-slate-800">
        <h1 className="mb-2 text-5xl font-extrabold flex justify-center items-center gap-3 text-white drop-shadow-lg">
          <MdMovie className="text-amber-400 text-6xl" /> BuscaSerie
        </h1>
        <p className="text-xl text-blue-200 opacity-80 font-medium mt-2">Seu portal de séries favorito</p>

        {view === null ? 
          <div className="flex flex-col sm:flex-row justify-center mt-8 w-full gap-3">
            <input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              onKeyDown={(e) => {
                 if(e.key === 'Enter') handleSearch()
              }}
              type="text" 
              placeholder="Digite Breaking Bad, Dark..." 
              className="bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl pl-4 h-12 w-full sm:w-96 outline-none text-blue-50 transition-all placeholder-slate-500 shadow-inner"
            />
            <button onClick={handleSearch} className="bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl cursor-pointer px-6 h-12 font-bold transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20">
              <FaSearch /> Buscar
            </button>
          </div>
        : null}
      </div>

      {view == null ? (
        <div className="w-full flex flex-wrap justify-center gap-8 p-8 mt-4">
          {list.length > 0 && list.map((item: any) => (
            <div key={item.show.id} onClick={() => setView(item.show)} className="group w-64 bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-amber-500/10 border border-slate-700 hover:border-amber-400/50">
              {item.show.image ? <img src={item.show.image.medium} alt={item.show.name} className="w-full h-96 object-cover" /> : 
              <div className="w-full h-96 bg-slate-700/30 flex items-center justify-center text-slate-500 font-medium">Sem Capa</div>}
              
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-lg truncate text-blue-50 group-hover:text-amber-400 transition-colors">{item.show.name}</h3>
                <div className="flex justify-between items-center text-sm text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-amber-400"><FaStar /> {item.show.rating?.average || "?"}</span>
                  <span>{item.show.premiered ? item.show.premiered.substring(0,4) : "-"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-5xl mt-10 px-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-slate-700 relative">
            <div className="p-6 pb-0">
              <button onClick={() => setView(null)} className="flex items-center gap-2 text-amber-400 font-bold text-lg hover:text-amber-300 hover:translate-x-[-5px] transition-all cursor-pointer w-max">
                <FaArrowLeft /> Voltar
              </button>
            </div>

            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                 {view.image ? <img src={view.image.original || view.image.medium} className="w-full rounded-xl shadow-lg" /> : <div className="w-full h-96 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 font-medium">Sem Imagem</div>}
              </div>

              <div className="w-full md:w-2/3 flex flex-col">
                <h2 className="text-4xl font-extrabold text-white mb-3 drop-shadow-sm">{view.name}</h2>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-slate-700/50 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 text-blue-100 border border-slate-600">
                    <FaCalendarAlt className="text-amber-400" /> {view.premiered ? view.premiered.split("-")[0] : "N/A"}
                  </span>
                  <span className="bg-slate-700/50 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 text-blue-100 border border-slate-600">
                    <FaStar className="text-amber-400" /> {view.rating?.average || "?"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-amber-400 mb-2 border-b border-slate-700 pb-2 inline-block w-full">Sinopse</h3>
                
                <p className="text-slate-300 leading-relaxed text-lg text-justify font-light">
                   {/* remove tags html */}
                  {view.summary ? view.summary.replace(/(<([^>]+)>)/gi, "") : "Sem descrição"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App