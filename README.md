# ReelRate

ReelRate er en React-basert webapplikasjon som lar brukere utforske, søke og lagre sine favorittfilmer. Med en intuitiv brukergrensesnitt og animerte overganger gir appen en sømløs brukeropplevelse.



## 📋 Innholdsfortegnelse

***
* [Funksjoner](#-funksjoner)
* [Demo](#-demo)
* [Teknologier](#-teknologier)
* [Installasjon](#-installasjon)
* [Bruk](#-bruk)
* [API-referanse](#-api-referanse)
* [Skjermbilder](#-skjermbilder)
* [Kontakt](#-kontakt)
***

## ✨ Funksjoner

- **Utforsk filmer**: Bla gjennom populære og aktuelle filmer
- **Detaljert visning**: Se informasjon om hver film, inkludert beskrivelse, skuespillere og vurderinger
- **Brukerkonto**: Registrer deg og logg inn for å få tilgang til personlige funksjoner
- **Rating**: ReelRate tar andre brukeres rangeringer og legger de til i lister for forslag for andre. Man gir terningkast på en film og filmen blir filtrert ut så man ikke vil se den igjen i anbefalinger.
- **Søk**: Finn filmer basert på tittel, sjanger eller skuespillere
- **Responsive animasjoner**: Jevne sideoverganger med Framer Motion
- **Profilhåndtering**: Administrer watchlist og favoritter
- **Caching**: ReelRate cacher filmer man har vært inne på eller fått forslag om i 24 timer så om man er mye inn og ut av filmer vil responsen være rask.
- **Mobil**: ReelRate tilpasser seg mobil, nettbrett og desktop sømløst
***
## 🚀 Demo

Prøv applikasjonen live på: [ReelRate](https://reelrate-6f7a8.web.app/)
Prøv og registrer deg!

***
## 💻 Teknologier

- **Frontend**: React 19.0.0, React Router 7.4.0
- **UI/Animasjoner**: Framer Motion 12.5.0, Bootstrap 5.3.3, FontAwesome
- **Backend/Database**: Firebase FireStore 11.4.0
- **Autentisering**: Firebase Authentication
- **Andre verktøy**: npm, Git, lodash, Axios.
***
## 📦 Installasjon

For å sette opp prosjektet lokalt, følg disse trinnene:

1. Klone repositoriet:
   ```
   git clone https://github.com/chrissundal/ReelRate.git
   ```

2. Naviger til prosjektmappen:
   ```
   cd ReelRate
   ```

3. Installer avhengigheter:
   ```
   npm install
   ```

4. Opprett en `.env`-fil i rotmappen og legg til Firebase-konfigurasjon:
   ```
   REACT_APP_FIREBASE_API_KEY=din-api-nøkkel
   REACT_APP_FIREBASE_AUTH_DOMAIN=ditt-prosjekt.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=ditt-prosjekt
   REACT_APP_FIREBASE_STORAGE_BUCKET=ditt-prosjekt.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=din-sender-id
   REACT_APP_FIREBASE_APP_ID=ditt-app-id
   ```

5. Start utviklingsserveren:
   ```
   npm start
   ```
***
## 🔧 Bruk

1. Åpne nettleseren og gå til `http://localhost:3000`
2. Registrer en ny konto eller logg inn med eksisterende legitimasjon
3. Utforsk filmene på startsiden eller søk etter spesifikke titler
4. Klikk på en film for å se detaljert informasjon
5. Lagre favorittfilmer til din profil
***
## 📚 API-referanse

ReelRate bruker [OMDb API](https://www.omdbapi.com/) for filmdata.
For å bruke API-et trenger du å:

1. Registrere deg for en konto på OMDb
2. Få en API-nøkkel
3. Legg til nøkkelen i `.env`-filen som `REACT_APP_OMDB_API_KEY`
***
##  📸 Skjermbilder
![ReelRate Skjermbilde](/public/img/reelrate.png)
![ReelRate Skjermbilde Mobil](/public/img/reelrate-mobil.png)        ![ReelRate Skjermbilde Mobil 2](/public/img/reelrate-mobil2.png)

***
## 📞 Kontakt

Prosjekt opprettet av [Christoffer Sundal Jacobsen](https://github.com/chrissundal) - føl deg fri til å kontakte meg!

- Email: christoffer.sundal@gmail.com
- LinkedIn: [Christoffer Sundal Jacobsen](https://www.linkedin.com/in/christoffer-sundal-jacobsen/)
