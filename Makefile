.PHONY: all run generate_publications

all: py_publications run

run: 
	/usr/bin/hugo server

py_publications:
	python3 bib2html.py


upload: 
	/usr/bin/hugo
	git add .
	git commit -m "messaggio"
	git push origin main
	git subtree push --prefix public origin gh-pages

generate_publications:
	pandoc -s content/in.md -o themes/hugo-arcana/layouts/shortcodes/publications.html --bibliography=publications.bib --template=themes/hugo-arcana/layouts/partials/bibtex-template.html
	
command_2:
	pandoc -s publications.bib -t markdown -o content/output.md 
	pandoc -s publications.bib -o themes/hugo-arcana/layouts/shortcodes/publications.html --template=themes/hugo-arcana/layouts/partials/bibtex-template.html

	pandoc -s in.md --filter=pandoc-citeproc --bibliography=publications.bib --template=themes/hugo-arcana/layouts/partials/bibtex-template.html -o themes/hugo-arcana/layouts/shortcodes/output.html

	pandoc publications.bib --filter=pandoc-citeproc --bibliography=publications.bib --template=themes/hugo-arcana/layouts/partials/bibtex-template.html -o themes/hugo-arcana/layouts/shortcodes/publicatons.html

