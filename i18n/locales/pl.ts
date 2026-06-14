import type { TranslationType } from '../i18n.config'

export default {
  settings: {
    timer: {
      decimalPoints: {
        title: 'Punkty dziesiętne timera',
        description: 'Ile punktów dziesiętnych pokazać na timerze'
      },
      freezeTime: {
        title: 'Czas czekania (s)',
        description:
          'Ile sekund musisz przytrzymać spację, zanim uruchomi się timer.'
      },
      hideTime: {
        title: 'Ukryj czas podczas układania',
        description:
          "Pokaż tekst 'układaj' podczas układania zamiast rzeczywistego czasu"
      },
      hideLayout: {
        title: 'Ukryj układ podczas układania',
        description: 'Pokaż tylko czas podczas układania'
      },
      zeroOutTime: {
        title: 'Wyzeruj czas po ułożeniu',
        description:
          'Zamiast pokazywać czas ostatniego ułożenia, timer resetuje się do 0.00 po ułożeniu.'
      },
      confirmDelete: {
        title: 'Potwierdź usunięcie ułożenia',
        description:
          'Pokaż pole potwierdzenia, zanim będziesz mógł usunąć rozwiązanie.'
      },
      personalBestConfetti: {
        title: 'Konfetti na nowy rekord',
        description: 'Pokaż konfetti, gdy pobijesz swój rekord życiowy.'
      },
      inspection: {
        title: 'Inspekcja',
        description: '',
        children: {
          time: {
            title: 'Czas inspekcji (s)'
          },
          autoStart: {
            title: 'Automatyczny start po inspekcji',
            description:
              'Automatyczny start timera gdy skończy się czas inspekcji'
          },
          playSound: {
            title: 'Odtwórz dźwięk',
            description: 'Ogłoś gdy minęło 8 i 12 sekund inspekcji'
          }
        }
      }
    }
  }
} satisfies TranslationType
