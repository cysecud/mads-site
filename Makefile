.PHONY: all run generate_publications

all: py_publications run

run: 
	/usr/bin/hugo server

py_publications:
	python3 bib2html.py

generate_publications:
	pandoc -s content/pub.md -o themes/hugo-arcana/layouts/shortcodes/publications.html --bibliography=publications.bib --template=themes/hugo-arcana/layouts/partials/bibtex-template.html
	
command_2:
	pandoc -s input.bib -t markdown -o output.md
	pandoc -s publications.bib -o themes/hugo-arcana/layouts/shortcodes/publications.html --template=themes/hugo-arcana/layouts/partials/bibtex-template.html