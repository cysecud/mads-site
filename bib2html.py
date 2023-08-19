#converte le pubblicazioni in bibTex in una pagina html
#la pagina è costruita sulla base del template "bib-template.html"
#output: genera la pagina in shortocode che poi va importata sul file md di interesse

import bibtexparser
from jinja2 import Environment, FileSystemLoader
from collections import OrderedDict

# Apri il file BibTeX
with open('publications.bib') as bibtex_file:
    bib_database = bibtexparser.load(bibtex_file)

# Prepara i dati per il template
entries = bib_database.entries


# Raggruppa le pubblicazioni per anno
publications_by_year = {}
for entry in entries:
    year = entry['year']
    if year not in publications_by_year:
        publications_by_year[year] = []  #crea nuovo campo per la data nuova
    publications_by_year[year].append(entry) #aggiunge l'entry nella struttura del suo anno

#Ordina le annate in modo discendente
sorted_years = sorted(publications_by_year.keys(), reverse=True)
ordered_publications_by_year = OrderedDict((year, publications_by_year[year]) for year in sorted_years)

# Carica il template
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('bib-template.html')

# Genera l'HTML
html_output = template.render(publications_by_year=ordered_publications_by_year)
#html_output = template.render(entries=entries) vecchia versione

# Salva l'HTML in un file
with open('themes/hugo-arcana/layouts/shortcodes/publicatos.html', 'w') as output_file:
    output_file.write(html_output)
