# Crea un nuovo file per salvare l'output
#genera il file bib a partire da un qualsiasi file contenente un formato bibtex
#all'inizio della linea deve esserci un @ oppure non lo riconosce

import bibtexparser

with open('publications.bib') as bibtex_file:
    bib_database = bibtexparser.load(bibtex_file)

#qui per cambiare file di output
output_filename = 'output.bib'
with open(output_filename, 'w') as output_file:
    for entry in bib_database.entries:
        output_file.write("@" + entry['ENTRYTYPE'] + "{" + entry['ID'] + ",\n")
        
        for field, value in entry.items():
            if field not in ['ENTRYTYPE', 'ID']:
                output_file.write(f"    {field}=" + "{" f"{value}" + "}" + ",\n")
        
        output_file.write("}\n\n")

print(f"Output salvato nel file {output_filename}")
