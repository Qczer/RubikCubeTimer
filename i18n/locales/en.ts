export default {
  settings: {
    timer: {
      decimalPoints: {
        title: 'Timer decimal points',
        description: 'How many decimal points to show on the timer page'
      },
      freezeTime: {
        title: 'Freeze time (s)',
        description: 'How many seconds to hold space before timer will start'
      },
      hideTime: {
        title: 'Hide time when solving',
        description: "Show 'solve' text when solving instead of the actual time"
      },
      hideLayout: {
        title: 'Hide layout when solving',
        description: 'Only see the time'
      },
      zeroOutTime: {
        title: 'Zero out time after solve',
        description:
          'Instead of showing the time of your last solve, the timer will reset to 0.00 after a solve.'
      },
      confirmDelete: {
        title: 'Confirm delete solves',
        description: 'Get a confirmation box before you can delete a solve'
      },
      personalBestConfetti: {
        title: 'Personal best confetti',
        description: 'Display confetti when you get a personal best'
      },
      inspection: {
        title: 'Inspection',
        description:
          'Ogranicz czas inspekcji. Doskonałe do przygotowań do zawodów',
        children: {
          time: {
            title: 'Inspection time (s)'
          },
          autoStart: {
            title: 'Inspection auto start',
            description: 'Auto start after inspection time is up'
          },
          playSound: {
            title: 'Play sound',
            description: 'Announce when 8 and 12 seconds have lapsed'
          }
        }
      }
    }
  }
}
