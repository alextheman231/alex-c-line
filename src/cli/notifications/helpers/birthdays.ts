import { normaliseIndents } from "@alextheman/utility";

interface Birthday {
  date: Temporal.PlainDate;
  getMessage: (age: number) => string;
}

const birthdays: Record<string, Birthday> = {
  alex: {
    date: Temporal.PlainDate.from({ day: 16, month: 7, year: 2003 }),
    getMessage: (age) => {
      return normaliseIndents`
                Happy birthday to AlexMan123456, my creator! 🎉
                He has turned ${age} years old today!
            `;
    },
  },
  "alex-c-line": {
    date: Temporal.PlainDate.from({ day: 20, month: 7, year: 2025 }),
    getMessage: (age) => {
      return normaliseIndents`
                Happy birthday to me, alex-c-line! 🎉
                I have turned ${age} years old today!
            `;
    },
  },
};

export default birthdays;
