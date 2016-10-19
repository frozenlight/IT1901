### Bandbestillingssystem for Studentersamfundet i Trondhjem (BaST ??)


For å installere og kjøre på *nix systemer via terminal

Vi bruker Nodejs for å kjøre serveren vår. For å installere Nodejs må vi bruke en pakkebehandler.
Vi bruker pakkebehandleren *apt*, dette avhenger av din distrubusjon. På MacOS er det enklest å bruke *brew*.

For å installere programmer med  må vi kjøre apt som *super user* ved hjelp av kommandoen ´´´sudo´´´

For å laste ned prosjektet trenger vi git, for å installere kjør:
´´´
	sudo apt install git
´´´

Last ned prosjektet ved hjelp av git:
´´´
	git clone https:// *adresse til repoet*
´´´

Installer Nodejs
´´´
	sudo apt install nodejs
´´´

Gå inn i prosjektmappen
´´´
	cd Gruppe09
´´´

Ínstaller tilleggspakkene som hører til prosjektet med pakkebehandleren npm, som følger med Nodejs
Pakkene som skal installeres er lagret i prosjektets package.json fil, og installeres ved å kjøre:
´´´
	npm install
´´´

Prosjektet bruker MongoDB som database, dette installeres ved å kjøre:
´´´
	sudo apt install mongodb
´´´

Lag mappen som databasen skal være i:
´´´
	sudo mkdir /data/db
´´´

Kjør mongodb
´´´
	sudo mongod
´´´
Åpne en ny terminal så databasen og serveren kan kjøres samtidig
Deretter kan prosjektet startes ved å kjøre:
´´´
	npm start
´´´
