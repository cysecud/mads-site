#converte le pubblicazioni in bibTex in una pagina html
#la pagina è costruita sulla base del template "bib-template.html"
#output: genera la pagina in shortocode che poi va importata sul file md di interesse

import bibtexparser
from jinja2 import Environment, FileSystemLoader

# Apri il file BibTeX
with open('publications.bib') as bibtex_file:
    bib_database = bibtexparser.load(bibtex_file)

# Prepara i dati per il template
entries = bib_database.entries

# Carica il template
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('bib-template.html')

# Genera l'HTML
html_output = template.render(entries=entries)

# Salva l'HTML in un file
with open('themes/hugo-arcana/layouts/shortcodes/publicatos.html', 'w') as output_file:
    output_file.write(html_output)
