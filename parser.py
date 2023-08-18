import bibtexparser

#Apre il file BibTeX
with open('publications.bib') as bibtex_file:
    bib_database = bibtexparser.load(bibtex_file)

#Stampa le informazioni di ogni entry
for entry in bib_database.entries:
    print("Tipo:", entry['ENTRYTYPE'])
    print("ID:", entry['ID'])
    for field, value in entry.items():
        if field not in ['ENTRYTYPE', 'ID']:
            print(f"{field}: {value}")
    print("-------------------------------")
