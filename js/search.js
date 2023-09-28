//questo file permette la ricerca delle stringhe, deve essere importato su script.html

function displayResults (results, store) {
    //elemento che serve per posizionare i risultatidi ricerca
    const searchResults = document.getElementById('results')
    //se esiste un risultato
    if (results.length) {
    let resultList = ''
    //eseguito per ogni risultato
    for (const n in results) {
        
        const item = store[results[n].ref]
        
        //trova l'elemento cercato, usato per dare la sottolineatura
        var searchTerm = document.getElementById('search-input').value.trim();
        //genera la formattazione dei risultati (ogni pagina è un resultList)
        resultList += `
            <li>
                <h3>
                    <a href="${item.url}">${highlightSearchTerm(item.title, searchTerm)}</a>
                </h3>
                <p>${highlightSearchTerm(item.content, searchTerm)}</p>
            </li>
        `;
    }
    //posiziona la lista costruita precedentemente nella pagina di riferimento (list.html)
    searchResults.innerHTML = resultList
    } else {// se non ottengo risultati restituisco la stringa seguente
    searchResults.innerHTML = 'No results found.'
    }
}

//prendo i parametri della query, l'oggetto creato serve per poter analizzare l'URL
const params = new URLSearchParams(window.location.search)
//il metodo get prende il parametro 'query' che rappresenta il valore cercato
const query = params.get('query')

//se esiste la query, effetuo la ricerca
if (query) {
    //mantengo la query nel modulo di ricerca dopo il reindirizzamento della pagina
    //senza di questo non è possibile eseguire delle operazioni su esse, come la sottolineatura
    document.getElementById('search-input').setAttribute('value', query)

    //crea idx, usa struttura per poi salvare i dati cercati
    const idx = lunr(function () {
        this.ref('id')
        this.field('title', {
            //peso della ricerca (maggiore da più priorità)
            boost: 15
        })
        this.field('tags')
        this.field('content', {
            boost: 10
        })
        //salva tutti i contenuti 
        for (const key in window.store) {
            this.add({
            id: key,
            title: window.store[key].title,
            tags: window.store[key].category,
            content: window.store[key].content
            })
        }
  })
  //necassario per cercare ogni tipo di carattere
  const stringQuery = ('*' + query + '*')
  //eseguono le ricerche parziali vere e proprie, poi viene tutto salvato dentro idx
  const resultsExact = idx.search(query);
  const resultsPartial = idx.search(stringQuery);

  // Unisce i risultati delle due ricerche in un unico array
  const results = [...resultsExact, ...resultsPartial];
  //i risultati uniti possono avere duplicazioni (quasi sempre)
  const uniqueResults = []; //conterrà i ref non duplicati
  const seenRefs = new Set(); //usato per il controllo

  //ciclo su tutti i risultati
  for (const result of results) {
    if (!seenRefs.has(result.ref)) {
      uniqueResults.push(result);
      seenRefs.add(result.ref); //vengono aggiunti i ref solo se non ci sono già
    }
  }
  //console.log(uniqueResults)
  //restituisce il risultato e costruisce la lista dei risultati 
  displayResults(uniqueResults, window.store)

  //rimpiazza il titolo nella pagina
  document.getElementById('search-title').innerText = 'Search results for ' + query
}

// esegue la sottolineatura dei termini trovati
function highlightSearchTerm(content, searchTerm) {
    const regex = new RegExp(searchTerm, 'gi');
    return content.replace(regex, '<span class="highlighted">$&</span>');
}
